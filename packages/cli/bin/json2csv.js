#!/usr/bin/env node

import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from 'fs';
import os from 'os';
import { isAbsolute, join, extname } from 'path';
import { Command } from 'commander';

import { flatten, unwind } from '@json2csv/transforms';
import {
  string as stringFormatter,
  stringExcel as stringExcelFormatter,
} from '@json2csv/formatters';
import { Parser } from '@json2csv/plainjs';
import { Transform as Json2csvTransform } from '@json2csv/node';

import pkg from '../package.json' assert { type: 'json' };
import parseNdJson from './utils/parseNdjson.js';
import TablePrinter from './utils/TablePrinter.js';

const { readFile, writeFile } = fsPromises;

const program = new Command();
program
  .version(pkg.version)
  .option(
    '-i, --input <input>',
    'Path and name of the incoming json file. Defaults to stdin.'
  )
  .option(
    '-o, --output <output>',
    'Path and name of the resulting csv file. Defaults to stdout.'
  )
  .option(
    '-c, --config <path>',
    'Specify a file with a valid JSON configuration.'
  )
  .option('-n, --ndjson', 'Treat the input as NewLine-Delimited JSON.')
  .option(
    '-s, --no-streaming',
    'Process the whole JSON array in memory instead of doing it line by line.'
  )
  .option(
    '-f, --fields <fields>',
    'List of fields to process. Defaults to field auto-detection.'
  )
  // CSV customizations
  .option(
    '-v, --default-value <defaultValue>',
    'Default value to use for missing fields.'
  )
  .option(
    '-d, --delimiter <delimiter>',
    "Character(s) to use as delimiter. Defaults to ','.",
    ','
  )
  .option(
    '-e, --eol <eol>',
    "Character(s) to use as End-of-Line for separating rows. Defaults to '\\n'.",
    os.EOL
  )
  .option('-H, --no-header', 'Disable the column name header.')
  .option(
    '-a, --include-empty-rows',
    'Includes empty rows in the resulting CSV output.'
  )
  .option(
    '-b, --with-bom',
    'Includes BOM character at the beginning of the CSV.'
  )
  .option(
    '-p, --pretty',
    'Print output as a pretty table. Use only when printing to console.'
  )
  // Built-in formatters
  .option(
    '-q, --quote <quote>',
    "Character(s) to use as quote mark. Defaults to '\"'."
  )
  .option(
    '-Q, --escaped-quote <escapedQuote>',
    'Character(s) to use as a escaped quote. Defaults to a double `quote`, \'""\'.'
  )
  .option(
    '-E, --excel-strings',
    'Wraps string data to force Excel to interpret it as string even if it contains a number.'
  )
  // Built-in transforms
  .option(
    '--unwind [paths]',
    'Creates multiple rows from a single JSON document similar to MongoDB unwind.'
  )
  .option(
    '--unwind-blank',
    'When unwinding, blank out instead of repeating data. Defaults to false.',
    false
  )
  .option(
    '--flatten-objects',
    'Flatten nested objects. Defaults to false.',
    false
  )
  .option(
    '--flatten-arrays',
    'Flatten nested arrays. Defaults to false.',
    false
  )
  .option(
    '--flatten-separator <separator>',
    "Flattened keys separator. Defaults to '.'.",
    '.'
  );

program.parse(process.argv);

const programOpts = program.opts();

function makePathAbsolute(filePath) {
  return filePath && !isAbsolute(filePath)
    ? join(process.cwd(), filePath)
    : filePath;
}

programOpts.input = makePathAbsolute(programOpts.input);
programOpts.output = makePathAbsolute(programOpts.output);
programOpts.config = makePathAbsolute(programOpts.config);

// don't fail if piped to e.g. head
/* c8 ignore next 3 */
process.stdout.on('error', (error) => {
  if (error.code === 'EPIPE') process.exit(1);
});

async function getInputJSON(inputPath) {
  // For some reason assert is detected as not used by eslint
  // eslint-disable-next-line no-unused-vars
  const assert =
    extname(inputPath).toLowerCase() === '.json'
      ? { assert: { type: 'json' } }
      : undefined;
  const { default: json } = await import(`file://${inputPath}`, assert);
  return json;
}

function getInputStream(inputPath) {
  if (inputPath) return createReadStream(inputPath, { encoding: 'utf8' });

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  return process.stdin;
}

function getOutputStream(outputPath, config) {
  if (outputPath) return createWriteStream(outputPath, { encoding: 'utf8' });
  if (config.pretty) return new TablePrinter(config).writeStream();
  return process.stdout;
}

async function getInput(inputPath, ndjson, eol) {
  if (!inputPath) return getInputFromStdin(ndjson);
  if (ndjson) return parseNdJson(await readFile(inputPath, 'utf8'), eol);
  return await getInputJSON(inputPath);
}

async function getInputFromStdin(ndjson) {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    let inputData = '';
    process.stdin.on('data', (chunk) => (inputData += chunk));
    process.stdin.on('error', (err) =>
      reject(new Error('Could not read from stdin', err))
    );
    process.stdin.on('end', () => {
      try {
        resolve(ndjson ? parseNdJson(inputData) : JSON.parse(inputData));
      } catch (err) {
        reject(new Error('Invalid data received from stdin', err));
      }
    });
  });
}

async function processOutput(outputPath, csv, config) {
  if (!outputPath) {
    config.pretty
      ? new TablePrinter(config).printCSV(csv)
      : process.stdout.write(csv);
    return;
  }

  await writeFile(outputPath, csv);
}

async function processInMemory(input, output, config, opts) {
  const inputData = await getInput(input, config.ndjson, config.eol);
  const outputData = new Parser(opts).parse(inputData);
  await processOutput(output, outputData, config);
}

async function processStream(input, output, config, opts) {
  const inputStream = getInputStream(input);
  const transform = new Json2csvTransform(opts);
  const outputStream = getOutputStream(output, config);

  await new Promise((resolve, reject) => {
    inputStream.pipe(transform).pipe(outputStream);
    inputStream.on('error', reject);
    transform.on('error', reject);
    outputStream.on('error', reject).on('finish', resolve);
  });
}

(async (programConfig) => {
  try {
    const config = Object.assign(
      {},
      programConfig.config ? await getInputJSON(programConfig.config) : {},
      programConfig
    );

    const transforms = [];
    if (config.unwind) {
      transforms.push(
        unwind({
          paths: config.unwind === true ? undefined : config.unwind.split(','),
          blankOut: config.unwindBlank,
        })
      );
    }

    if (config.flattenObjects || config.flattenArrays) {
      transforms.push(
        flatten({
          objects: config.flattenObjects,
          arrays: config.flattenArrays,
          separator: config.flattenSeparator,
        })
      );
    }

    const formatters = {
      string: config.excelStrings
        ? stringExcelFormatter
        : stringFormatter({
            quote: config.quote,
            escapedQuote: config.escapedQuote,
          }),
    };

    const opts = {
      transforms,
      formatters,
      fields: config.fields
        ? Array.isArray(config.fields)
          ? config.fields
          : config.fields.split(',')
        : config.fields,
      defaultValue: config.defaultValue,
      delimiter: config.delimiter,
      eol: config.eol,
      header: config.header,
      includeEmptyRows: config.includeEmptyRows,
      withBOM: config.withBom,
      ndjson: config.ndjson,
    };

    await (config.streaming ? processStream : processInMemory)(
      config.input,
      config.output,
      config,
      opts
    );
  } catch (err) {
    let processedError = err;
    if (programConfig.input && err.message.includes(programConfig.input)) {
      processedError = new Error(`Invalid input file. (${err.message})`);
    } else if (
      programConfig.output &&
      err.message.includes(programConfig.output)
    ) {
      processedError = new Error(`Invalid output file. (${err.message})`);
    } else if (
      programConfig.config &&
      err.message.includes(programConfig.config)
    ) {
      processedError = new Error(`Invalid config file. (${err.message})`);
    }
    // eslint-disable-next-line no-console
    console.error('test', processedError);
    process.exit(1);
  }
})(programOpts);
