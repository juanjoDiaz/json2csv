import { exec } from 'node:child_process';
import { promises as fsPromises } from 'node:fs';
import { dirname, join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const { mkdir, rm, readFile } = fsPromises;

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = joinPath(__dirname, '../bin/json2csv.js');
const cli = `node "${cliPath}"`;

const getFixturePath = (fixture: string): string =>
  joinPath(__dirname, '../../test-helpers/fixtures', fixture);
const resultsPath = getFixturePath('results');

describe('CLI', () => {
  let jsonFixtures: Record<string, () => any>;
  let csvFixtures: Record<string, any>;

  beforeAll(async () => {
    const loadedFixtures = await fixtures;
    jsonFixtures = loadedFixtures.jsonFixtures;
    csvFixtures = loadedFixtures.csvFixtures;

    try {
      await mkdir(resultsPath);
    } catch (err: any) {
      if (err.code !== 'EEXIST') throw err;
    }
  });

  afterAll(async () => {
    await rm(resultsPath, { recursive: true, force: true });
  });

  it('should handle ndjson', async () => {
    const opts = '--fields carModel,price,color,manual --ndjson';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/ndjson.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.ndjson);
  });

  it('should error if ndjson input data is empty and fields are not set', async () => {
    const opts = '--ndjson';

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/empty.json')}" ${opts}`,
      );

      expect.fail('Exception expected');
    } catch (err: any) {
      expect(err.stderr.split('\n')[0].substring(7)).toEqual(
        'Data should not be empty or the "fields" option should be included',
      );
    }
  });

  it('should error on invalid ndjson input data', async () => {
    const opts = '--fields carModel,price,color,manual --ndjson';

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/ndjsonInvalid.json')}" ${opts}`,
      );

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain(
        'Unexpected LEFT_BRACE ("{") in state COMMA',
      );
    }
  });

  it('should handle ndjson without streaming', async () => {
    const opts = '--fields carModel,price,color,manual --ndjson --no-streaming';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/ndjson.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.ndjson);
  });

  it('should error on invalid ndjson input path without streaming', async () => {
    const opts = '--fields carModel,price,color,manual --ndjson --no-streaming';

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/ndjsonInvalid.json')}" ${opts}`,
      );

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.stderr.split('\n')[0].substring(7)).toEqual(
        "Invalid ND-JSON couldn't be parsed",
      );
    }
  });

  it('should error on invalid input file path', async () => {
    try {
      await execAsync(`${cli} -i "${getFixturePath('/json2/default.json')}"`);

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain('Invalid input file.');
    }
  });

  it('should error on invalid input file path without streaming', async () => {
    const opts = '--no-streaming';

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json2/default.json')}" ${opts}`,
      );

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain('Invalid input file.');
    }
  });

  it('should error if input data is single item and not an object', async () => {
    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/notObjectSingleItem.json')}"`,
      );

      expect.fail('Exception expected');
    } catch (err: any) {
      expect(err.stderr.split('\n')[0].substring(7)).toEqual(
        'Data items should be objects or the "fields" option should be included',
      );
    }
  });

  it('should error if input data is not an object', async () => {
    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/notObjectArray.json')}"`,
      );

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.stderr.split('\n')[0].substring(7)).toEqual(
        'Data items should be objects or the "fields" option should be included',
      );
    }
  });

  it('should handle empty object', async () => {
    const opts = '--fields carModel,price,color';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/emptyObject.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.emptyObject);
  });

  it('should handle deep JSON objects', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/deepJSON.json')}"`,
    );

    expect(csv).toEqual(csvFixtures.deepJSON);
  });

  it('should handle deep JSON objects without streaming', async () => {
    const opts = '--no-streaming';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/deepJSON.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.deepJSON);
  });

  it('should parse json to csv and infer the fields automatically ', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}"`,
    );

    expect(csv).toEqual(csvFixtures.defaultStream);
  });

  it('should handle an input path containing a "#" character', async () => {
    // A naive `file://${path}` URL construction truncates everything after
    // "#" (parsed as a URL fragment), so the file was never found.
    const opts = '--fields a,b --no-streaming';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/file#hash.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.pathWithHash);
  });

  it('should handle an input path containing a literal "%20" substring', async () => {
    // A naive `file://${path}` URL gets percent-decoded on resolution, so a
    // filename literally containing "%20" resolved to a different, wrong
    // path with a real space instead.
    const opts = '--fields a,b --no-streaming';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/file%20name.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.pathWithPercent20);
  });

  it('should error on invalid fields config file path', async () => {
    const opts = `--config "${getFixturePath('/fields2/fieldNames.json')}"`;

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
      );

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain('Invalid config file.');
    }
  });

  it('should parse json to csv using custom fields', async () => {
    const opts = '--fields carModel,price,color,manual';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.default);
  });

  it('should output only selected fields', async () => {
    const opts = '--fields carModel,price';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.selected);
  });

  it('should output fields in the order provided', async () => {
    const opts = '--fields price,carModel';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.reversed);
  });

  it('should output empty value for non-existing fields', async () => {
    const opts =
      '--fields "first not exist field",carModel,price,"not exist field",color';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.withNotExistField);
  });

  it("should name columns as specified in 'fields' property", async () => {
    const opts = `--config "${getFixturePath('/fields/fieldNames.json')}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.fieldNames);
  });

  it('should respect a config-file option that has a CLI default, when the flag is not passed', async () => {
    // Commander pre-populates options with a coded default (like delimiter)
    // even when the flag isn't passed, which used to let that default
    // silently clobber the same option coming from --config.
    const opts = `--config "${getFixturePath('/fields/delimiterOnly.json')}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.configDelimiterOnly);
  });

  it('should support nested properties selectors', async () => {
    const opts = `--config "${getFixturePath('/fields/nested.json')}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/nested.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.nested);
  });

  it('should support nested properties selectors using braket notation', async () => {
    const opts = `--config "${getFixturePath(
      '/fields/nestedWithBrackets.json',
    )}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/nested.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.nested);
  });

  it('field.value function should receive a valid field object', async () => {
    const opts = `--config "${getFixturePath('/fields/functionWithCheck.js')}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/functionStringifyByDefault.json',
      )}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.functionStringifyByDefault);
  });

  it('field.value function should stringify results by default', async () => {
    const opts = `--config "${getFixturePath(
      '/fields/functionStringifyByDefault.js',
    )}"`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/functionStringifyByDefault.json',
      )}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.functionStringifyByDefault);
  });

  it('should process different combinations in fields option', async () => {
    const opts = `--config "${getFixturePath(
      '/fields/fancyfields.js',
    )}" --default-value NULL`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/fancyfields.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.fancyfields);
  });

  // Default value

  it("should output the default value as set in 'defaultValue'", async () => {
    const opts = '--fields carModel,price --default-value ""';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/defaultValueEmpty.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.defaultValueEmpty);
  });

  it("should override 'options.defaultValue' with 'field.defaultValue'", async () => {
    const opts = `--config "${getFixturePath(
      '/fields/overriddenDefaultValue.json',
    )}" --default-value ""`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/overriddenDefaultValue.json',
      )}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.overriddenDefaultValue);
  });

  it("should use 'options.defaultValue' when no 'field.defaultValue'", async () => {
    const opts = `--config "${getFixturePath(
      '/fields/overriddenDefaultValue2.js',
    )}" --default-value ""`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/overriddenDefaultValue.json',
      )}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.overriddenDefaultValue);
  });

  // Delimiter

  it("should use a custom delimiter when 'delimiter' property is defined", async () => {
    const opts = '--fields carModel,price,color --delimiter "\t"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.tsv);
  });

  it('should remove last delimiter |@|', async () => {
    const opts = '--delimiter "|@|"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/delimiter.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.delimiter);
  });

  // EOL

  it("should use a custom eol character when 'eol' property is present", async () => {
    const opts = '--fields carModel,price,color --eol "\r\n"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.eol);
  });

  // Header

  it('should parse json to csv without column title', async () => {
    const opts = '--fields carModel,price,color,manual --no-header';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.withoutHeader);
  });

  // Include empty rows

  it('should not include empty rows when options.includeEmptyRows is not specified', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/emptyRow.json')}"`,
    );

    expect(csv).toEqual(csvFixtures.emptyRowNotIncluded);
  });

  it('should include empty rows when options.includeEmptyRows is true', async () => {
    const opts = '--include-empty-rows';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/emptyRow.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.emptyRow);
  });

  it('should include empty rows when options.includeEmptyRows is true, with default values', async () => {
    const opts = `--config "${getFixturePath(
      '/fields/emptyRowDefaultValues.json',
    )}" --default-value NULL --include-empty-rows`;

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/emptyRow.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.emptyRowDefaultValues);
  });

  it('should parse data:[null] to csv with only column title, despite options.includeEmptyRows', async () => {
    const opts = '--fields carModel,price,color --include-empty-rows';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/arrayWithNull.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.emptyObject);
  });

  // BOM

  it('should add BOM character', async () => {
    const opts = '--fields carModel,price,color,manual --with-bom';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/specialCharacters.json')}" ${opts}`,
    );

    // Compare csv length to check if the BOM character is present
    expect(csv[0]).toEqual('\ufeff');
    expect(csv.length).toEqual(csvFixtures.default.length + 1);
    expect(csv.length).toEqual(csvFixtures.withBOM.length);
  });

  // Get input from stdin

  it('should get input from stdin and process as stream', async () => {
    const execution = execAsync(cli);

    execution.child.stdin!.write(JSON.stringify(jsonFixtures.default()));
    execution.child.stdin!.end();

    const { stdout: csv } = await execution;

    expect(csv).toEqual(csvFixtures.defaultStream);
  });

  it('should error if stdin data is not valid', async () => {
    const execution = execAsync(cli);

    execution.child.stdin!.write('{ "b": 1,');
    execution.child.stdin!.end();

    try {
      await execution;

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain(
        'Error: Parser ended in mid-parsing (state: KEY). Either not all the data was received or the data was invalid.',
      );
    }
  });

  it('should get input from stdin with -s flag', async () => {
    const execution = execAsync(`${cli} -s`);

    execution.child.stdin!.write(JSON.stringify(jsonFixtures.default()));
    execution.child.stdin!.end();

    const { stdout: csv } = await execution;

    expect(csv).toEqual(csvFixtures.default);
  });

  it('should error if stdin data is not valid with -s flag', async () => {
    const execution = execAsync(`${cli} -s`);

    execution.child.stdin!.write('{ "b": 1,');
    execution.child.stdin!.end();

    try {
      await execution;

      expect.fail('Exception expected.');
    } catch (err: any) {
      expect(err.message).toContain('Invalid data received from stdin');
    }
  });

  it('should error if stdin fails', async () => {
    const execution = execAsync(cli);

    // TODO Figure out how to make the stdin to error
    (execution.child.stdin as any)._read = execution.child.stdin!._write =
      () => {
        /* Do nothing */
      };
    execution.child.stdin!.on('error', () => {
      /* Do nothing */
    });
    execution.child.stdin!.destroy(new Error('Test error'));

    try {
      await execution;

      expect.fail('Exception expected.');
    } catch (err: any) {
      // TODO error message seems wrong
      expect(err.message).toContain(
        'Data should not be empty or the "fields" option should be included',
      );
    }
  });

  // Put output to file

  it('should output to file', async () => {
    const outputPath = getFixturePath('/results/default.csv');
    const opts = `-o "${outputPath}" --fields carModel,price,color,manual`;

    await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    const csv = await readFile(outputPath, 'utf-8');
    expect(csv).toEqual(csvFixtures.default);
  });

  it('should output to file without streaming', async () => {
    const outputPath = getFixturePath('/results/default.csv');
    const opts = `-o ${outputPath} --fields carModel,price,color,manual --no-streaming`;

    await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    const csv = await readFile(outputPath, 'utf-8');
    expect(csv).toEqual(csvFixtures.default);
  });

  it('should error on invalid output file path', async () => {
    const outputPath = getFixturePath('/results2/default.csv');
    const opts = `-o "${outputPath}" --fields carModel,price,color,manual`;

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
      );
    } catch (err: any) {
      expect(err.message).toContain('Invalid output file.');
    }
  });

  it('should error on invalid output file path without streaming', async () => {
    const outputPath = getFixturePath('/results2/default.csv');
    const opts = `-o "${outputPath}" --fields carModel,price,color,manual --no-streaming`;

    try {
      await execAsync(
        `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
      );
    } catch (err: any) {
      expect(err.message).toContain('Invalid output file.');
    }
  });

  // Pretty print

  it('should print pretty table', async () => {
    const opts = '--pretty';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.prettyprint);
  });

  it('should print pretty table without header', async () => {
    const opts = '--no-header --pretty';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.prettyprintWithoutHeader);
  });

  it('should print pretty table without streaming', async () => {
    const opts = '--fields carModel,price,color --no-streaming --pretty ';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.prettyprint);
  });

  it('should print pretty table without streaming and without header', async () => {
    const opts =
      '--fields carModel,price,color --no-streaming --no-header --pretty ';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.prettyprintWithoutHeader);
  });

  it('should print pretty table without rows', async () => {
    const opts = '--fields fieldA,fieldB,fieldC --pretty';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.prettyprintWithoutRows);
  });

  // Preprocessing

  it('should unwind all unwindable fields using the unwind transform', async () => {
    const opts =
      '--fields carModel,price,extras.items.name,extras.items.color,extras.items.items.position,extras.items.items.color' +
      ' --unwind';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwind2.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwind2);
  });

  it('should support unwinding specific fields using the unwind transform', async () => {
    const opts = '--unwind colors';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwind.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwind);
  });

  it('should support multi-level unwind using the unwind transform', async () => {
    const opts =
      '--fields carModel,price,extras.items.name,extras.items.color,extras.items.items.position,extras.items.items.color' +
      ' --unwind extras.items,extras.items.items';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwind2.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwind2);
  });

  it('should unwind and blank out repeated data', async () => {
    const opts =
      '--fields carModel,price,extras.items.name,extras.items.color,extras.items.items.position,extras.items.items.color' +
      ' --unwind extras.items,extras.items.items --unwind-blank';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwind2.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwind2Blank);
  });

  it('should support flattening deep JSON using the flatten transform', async () => {
    const opts = '--flatten-objects';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/deepJSON.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.flattenedDeepJSON);
  });

  it('should support flattening JSON with nested arrays using the flatten transform', async () => {
    const opts = '--flatten-objects --flatten-arrays';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/flattenArrays.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.flattenedArrays);
  });

  it('should support custom flatten separator using the flatten transform', async () => {
    const opts = '--flatten-objects --flatten-separator __';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/deepJSON.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.flattenedCustomSeparatorDeepJSON);
  });

  it('should support custom flatten separator using the flatten transform with arrays', async () => {
    const opts =
      '--delimiter , --flatten-objects --flatten-arrays --flatten-separator .';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/objectWithEmptyFields.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.objectWithEmptyFieldsStream);
  });

  it('should support multiple transforms and honor the order in which they are declared', async () => {
    const opts = '--unwind items --flatten-objects';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwindAndFlatten.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwindAndFlatten);
  });

  it('should unwind complex objects using the unwind transform', async () => {
    const opts =
      '--fields carModel,price,extras.items.name,extras.items.items.position,extras.items.items.color,extras.items.color' +
      ' --unwind extras.items,extras.items.items --flatten-objects --flatten-arrays';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/unwindComplexObject.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.unwindComplexObject);
  });

  // Formatters

  // String Quote

  it("should use a custom quote when 'quote' property is present", async () => {
    const opts = '--fields carModel,price --quote "\'"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.withSimpleQuotes);
  });

  it("should be able to don't output quotes when setting 'quote' to empty string", async () => {
    const opts = '--fields carModel,price --quote ""';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.withoutQuotes);
  });

  it("should escape quotes when setting 'quote' property is present", async () => {
    const opts = '--fields carModel,color --quote "\'"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/escapeCustomQuotes.json')}" ${opts}`,
    );
    expect(csv).toEqual(csvFixtures.escapeCustomQuotes);
  });

  it('should treat a regex-special quote character as a literal string', async () => {
    // "." is "any character" in a regex; a previous implementation built
    // `new RegExp(quote, 'g')`, which corrupted every character in the value.
    const opts = '--fields text --quote "." --escaped-quote ".."';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/regexSpecialQuoteChar.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.regexSpecialQuoteChar);
  });

  it('should not throw for a quote that would be an invalid regex pattern', async () => {
    // An unbalanced "(" used to throw a SyntaxError from `new RegExp(...)`.
    const opts = '--fields text --quote "(" --escaped-quote "(("';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/invalidRegexQuoteChar.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.invalidRegexQuoteChar);
  });

  it("should not escape '\"' when setting 'quote' set to something else", async () => {
    const opts = '--quote "\'"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/escapedQuotes.json')}" ${opts}`,
    );
    expect(csv).toEqual(csvFixtures.escapedQuotesUnescaped);
  });

  // String Escaped Quote

  it('should escape quotes with double quotes', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/quotes.json')}"`,
    );

    expect(csv).toEqual(csvFixtures.quotes);
  });

  it('should not escape quotes with double quotes, when there is a backslash in the end', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/backslashAtEnd.json')}"`,
    );

    expect(csv).toEqual(csvFixtures.backslashAtEnd);
  });

  it('should not escape quotes with double quotes, when there is a backslash in the end, and its not the last column', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/backslashAtEndInMiddleColumn.json',
      )}"`,
    );

    expect(csv).toEqual(csvFixtures.backslashAtEndInMiddleColumn);
  });

  it("should escape quotes with value in 'escapedQuote'", async () => {
    const opts = '--fields "a string" --escaped-quote "*"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/escapedQuotes.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.escapedQuotes);
  });

  // String Excel

  it('should format strings to force excel to view the values as strings', async () => {
    const opts = '--fields carModel,price,color --excel-strings';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/default.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.excelStrings);
  });

  it('should format strings to force excel to view the values as strings with escaped quotes', async () => {
    const opts = '--excel-strings';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/quotes.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.excelStringsWithEscapedQuoted);
  });

  // String Escaping and preserving values

  it('should parse JSON values with trailing backslashes', async () => {
    const opts = '--fields carModel,price,color';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/trailingBackslash.json')}" ${opts}`,
    );

    expect(csv).toEqual(csvFixtures.trailingBackslash);
  });

  it('should escape " when preceeded by \\', async () => {
    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath(
        '/json/escapeDoubleBackslashedEscapedQuote.json',
      )}"`,
    );

    expect(csv).toEqual(csvFixtures.escapeDoubleBackslashedEscapedQuote);
  });

  it('should preserve new lines in values', async () => {
    const opts = '--eol "\r\n"';

    const { stdout: csv } = await execAsync(
      `${cli} -i "${getFixturePath('/json/eol.json')}" ${opts}`,
    );

    expect(csv).toEqual(
      [
        '"a string"',
        '"with a \u2028description\\n and\na new line"',
        '"with a \u2029\u2028description and\r\nanother new line"',
      ].join('\r\n'),
    );
  });
});
