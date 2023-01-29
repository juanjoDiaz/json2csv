import os from 'os';
import { createReadStream } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { dirname, extname, join, parse } from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __dirname = dirname(fileURLToPath(import.meta.url));

const csvDirectory = join(__dirname, './fixtures/csv');
const jsonDirectory = join(__dirname, './fixtures/json');

function getImportAssertion(filePath) {
  return extname(filePath).toLowerCase() === '.json'
    ? { assert: { type: 'json' } }
    : undefined;
}

function parseToJson(fixtures) {
  return fixtures.reduce((data, fixture) => {
    data[fixture.name] = fixture.content;
    return data;
  }, {});
}

async function loadJSON() {
  const filenames = await readdir(jsonDirectory);
  const fixtures = await Promise.all(
    filenames
      .filter((filename) => !filename.startsWith('.'))
      .map(async (filename) => {
        const name = parse(filename).name;
        const filePath = join(jsonDirectory, filename);
        let content;
        try {
          content = (await import(filePath, getImportAssertion(filePath)))
            .default;
        } catch (e) {
          content = await readFile(filePath, 'utf-8');
        }

        return {
          name,
          content: () => content,
        };
      })
  );

  return parseToJson(fixtures);
}

async function loadJSONStreams() {
  const filenames = await readdir(jsonDirectory);
  const fixtures = await Promise.all(
    filenames
      .filter((filename) => !filename.startsWith('.'))
      .map(async (filename) => {
        let parsedContent = undefined;
        try {
          parsedContent = (
            await import(
              join(jsonDirectory, filename),
              getImportAssertion(filename)
            )
          ).default;
        } catch (err) {
          // leave empty
        }
        return {
          name: parse(filename).name,
          content: ({ objectMode } = { objectMode: false }) => {
            if (objectMode) {
              return Readable.from(parsedContent);
            }
            return createReadStream(join(jsonDirectory, filename), {
              highWaterMark: 175,
            });
          },
        };
      })
  );

  return parseToJson(fixtures);
}

async function loadCSV() {
  const filenames = await readdir(csvDirectory);
  const fixtures = await Promise.all(
    filenames
      .filter((filename) => !filename.startsWith('.'))
      .map(async (filename) => ({
        name: parse(filename).name,
        content: await readFile(join(csvDirectory, filename), 'utf-8'),
      }))
  );

  return parseToJson(fixtures);
}

async function loadAllFixtures() {
  const [jsonFixtures, jsonFixturesStreams, csvFixtures] = await Promise.all([
    loadJSON(),
    loadJSONStreams(),
    loadCSV(),
  ]);

  const csvFixturesWithLinuxEol = Object.entries(csvFixtures).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]:
        os.EOL !== '\n' ? value.replace(new RegExp(os.EOL, 'g'), '\n') : value,
    }),
    {}
  );

  return {
    jsonFixtures,
    jsonFixturesStreams,
    csvFixtures,
    csvFixturesWithLinuxEol,
  };
}

export const fixtures = loadAllFixtures();
