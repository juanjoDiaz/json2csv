const os = require('os');
const {
  promises: { readdir, readFile },
  createReadStream,
} = require('fs');
const path = require('path');
const { Readable } = require('stream');

const csvDirectory = path.join(__dirname, './fixtures/csv');
const jsonDirectory = path.join(__dirname, './fixtures/json');

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
        const name = path.parse(filename).name;
        const filePath = path.join(jsonDirectory, filename);
        let content;
        try {
          content = require(filePath);
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
  const fixtures = filenames
    .filter((filename) => !filename.startsWith('.'))
    .map((filename) => {
      return {
        name: path.parse(filename).name,
        content: ({ objectMode } = { objectMode: false }) => {
          if (objectMode) {
            return Readable.from(require(path.join(jsonDirectory, filename)));
          }
          return createReadStream(path.join(jsonDirectory, filename), {
            highWaterMark: 175,
          });
        },
      };
    });

  return parseToJson(fixtures);
}

async function loadCSV() {
  const filenames = await readdir(csvDirectory);
  const fixtures = await Promise.all(
    filenames
      .filter((filename) => !filename.startsWith('.'))
      .map(async (filename) => ({
        name: path.parse(filename).name,
        content: await readFile(path.join(csvDirectory, filename), 'utf-8'),
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

module.exports.fixtures = loadAllFixtures();
