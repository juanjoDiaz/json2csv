import { type Readable, Writable } from 'node:stream';
import {
  number as numberFormatter,
  stringExcel as stringExcelFormatter,
  string as stringFormatter,
  stringQuoteOnlyIfNecessary as stringQuoteOnlyIfNecessaryFormatter,
} from '@json2csv/formatters';
import { AsyncParser as Parser, type ParserOptions } from '@json2csv/node';
import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';
import type CarInfo from '@json2csv/test-helpers/fixtures/types/carInfo.ts';
import { forceLfEol } from '@json2csv/test-helpers/utils.ts';
import { flatten, unwind } from '@json2csv/transforms';
import { beforeAll, describe, expect, it } from 'vitest';

let jsonFixtures: Record<string, (opts?: { objectMode: boolean }) => Readable>;
let csvFixtures: Record<string, string>;

beforeAll(async () => {
  const loaded = await fixtures;
  jsonFixtures = loaded.jsonFixturesStreams;
  csvFixtures = loaded.csvFixtures;
});

async function parseInput<TRaw extends object, T extends object>(
  parser: Parser<TRaw, T>,
  nodeStream:
    | string
    | ArrayBufferView
    | Iterable<TRaw>
    | AsyncIterable<TRaw>
    | TRaw
    | ReadableStream<TRaw>
    | Readable,
): Promise<string> {
  return await parser.parse(nodeStream).promise();
}

describe('Node Async Parser', () => {
  it('should error if input is of an invalid format', async () => {
    const parser = new Parser();
    // @ts-expect-error test for non TS users. Wrong type expected
    await expect(parseInput(parser, 123)).rejects.toThrow(
      'Data should be a JSON object, JSON array, typed array, string or stream',
    );
  });

  it('should handle object mode', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
    };
    const transformOpts = { objectMode: true };

    const parser = new Parser(opts, {}, transformOpts);
    const csv = await parseInput(
      parser,
      jsonFixtures.default({ objectMode: true }),
    );

    expect(csv).toBe(csvFixtures.ndjson);
  });

  it('should handle ndjson', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
      ndjson: true,
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.ndjson());

    expect(csv).toBe(csvFixtures.ndjson);
  });

  it('should error if ndjson input data is empty and fields are not set', async () => {
    const opts: ParserOptions = {
      ndjson: true,
    };

    const parser = new Parser(opts);
    await expect(parseInput(parser, jsonFixtures.empty())).rejects.toThrow(
      'Data should not be empty or the "fields" option should be included',
    );
  });

  it('should handle ndjson with small chunk size', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
      ndjson: true,
    };

    const parser = new Parser(opts, undefined, { highWaterMark: 16 });
    await expect(
      parseInput(parser, jsonFixtures.ndjsonInvalid()),
    ).rejects.toThrow('Unexpected LEFT_BRACE ("{") in state COMMA');
  });

  it('should error on invalid ndjson input data', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
      ndjson: true,
    };

    const parser = new Parser(opts);
    await expect(
      parseInput(parser, jsonFixtures.ndjsonInvalid()),
    ).rejects.toThrow('Unexpected LEFT_BRACE ("{") in state COMMA');
  });

  it('should not modify the opts passed', async () => {
    const opts: ParserOptions = {};
    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.defaultStream);
    expect(opts).toEqual({});
  });

  it('should error if input data is empty and fields are not set', async () => {
    const parser = new Parser();
    await expect(parseInput(parser, jsonFixtures.empty())).rejects.toThrow(
      'Data should not be empty or the "fields" option should be included',
    );
  });

  it('should error if input data is single item and not an object', async () => {
    const parser = new Parser();
    await expect(
      parseInput(parser, `"${jsonFixtures.notObjectSingleItem()}"`),
    ).rejects.toThrow(
      'Data items should be objects or the "fields" option should be included',
    );
  });

  it('should error if input data is not an object', async () => {
    const parser = new Parser();
    await expect(
      parseInput(parser, jsonFixtures.notObjectArray()),
    ).rejects.toThrow(
      'Data items should be objects or the "fields" option should be included',
    );
  });

  it('should error if input data is not valid json', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
    };

    const parser = new Parser(opts);
    await expect(
      parseInput(parser, jsonFixtures.defaultInvalid()),
    ).rejects.toThrow('Unexpected LEFT_BRACE ("{") in state KEY');
  });

  it("should error if input data is not valid json and doesn't emit the first token", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
    };

    const parser = new Parser(opts);
    await expect(
      parseInput(parser, jsonFixtures.invalidNoToken()),
    ).rejects.toThrow('Data should be a valid JSON object or array');
  });

  it('should handle empty object', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.emptyObject());

    expect(csv).toBe(csvFixtures.emptyObject);
  });

  it('should handle empty array', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.emptyArray());

    expect(csv).toBe(csvFixtures.emptyObject);
  });

  it('should hanlde array with nulls', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.arrayWithNull());

    expect(csv).toBe(csvFixtures.emptyObject);
  });

  it('should handle deep JSON objects', async () => {
    const parser = new Parser();
    const csv = await parseInput(parser, jsonFixtures.deepJSON());

    expect(csv).toBe(csvFixtures.deepJSON);
  });

  it('should parse json to csv and infer the fields automatically ', async () => {
    const parser = new Parser();
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.defaultStream);
  });

  it('should parse json to csv using custom fields', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.default);
  });

  it('should output only selected fields', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.selected);
  });

  it('should output fields in the order provided', async () => {
    const opts: ParserOptions = {
      fields: ['price', 'carModel'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.reversed);
  });

  it('should output empty value for non-existing fields', async () => {
    const opts: ParserOptions = {
      fields: [
        'first not exist field',
        'carModel',
        'price',
        'not exist field',
        'color',
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.withNotExistField);
  });

  it("should name columns as specified in 'fields' property", async () => {
    const opts: ParserOptions = {
      fields: [
        {
          label: 'Car Model',
          value: 'carModel',
        },
        {
          label: 'Price USD',
          value: 'price',
        },
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.fieldNames);
  });

  it("should error on invalid 'fields' property", async () => {
    const opts: ParserOptions = {
      fields: [
        { value: 'price' },
        // @ts-expect-error test for non TS users. Wrong type expected
        () => {
          /* Do nothing */
        },
      ],
    };

    const parser = new Parser(opts);
    await expect(parseInput(parser, jsonFixtures.default())).rejects.toThrow(
      `Invalid field info option. ${JSON.stringify(opts.fields![1])}`,
    );
  });

  it("should error on invalid 'fields.value' property", async () => {
    const opts: ParserOptions<CarInfo> = {
      fields: [
        { value: (row: CarInfo) => row.price },
        // @ts-expect-error test for non TS users. Wrong type expected
        { label: 'Price USD', value: [] },
      ],
    };

    const parser = new Parser(opts);
    await expect(parseInput(parser, jsonFixtures.default())).rejects.toThrow(
      `Invalid field info option. ${JSON.stringify(opts.fields![1])}`,
    );
  });

  it('should support nested properties selectors', async () => {
    const opts: ParserOptions = {
      fields: [
        {
          label: 'Make',
          value: 'car.make',
        },
        {
          label: 'Model',
          value: 'car.model',
        },
        {
          label: 'Price',
          value: 'prices[0]',
        },
        {
          label: 'Color',
          value: 'color',
        },
        {
          label: 'Year',
          value: 'car.ye.ar',
        },
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.nested());

    expect(csv).toBe(csvFixtures.nested);
  });

  it('should support nested properties selectors using braket notation', async () => {
    const opts: ParserOptions = {
      fields: [
        {
          label: 'Make',
          value: 'car[make]',
        },
        {
          label: 'Model',
          value: 'car["model"]',
        },
        {
          label: 'Price',
          value: 'prices[0]',
        },
        {
          label: 'Color',
          value: 'color',
        },
        {
          label: 'Year',
          value: "car['ye'][ar]",
        },
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.nested());

    expect(csv).toBe(csvFixtures.nested);
  });

  it('field.value function should receive a valid field object', async () => {
    const opts: ParserOptions<{ value1: any }> = {
      fields: [
        {
          label: 'Value1',
          default: 'default value',
          value: (row, field) => {
            expect(field).toEqual({
              label: 'Value1',
              default: 'default value',
            });
            return row.value1.toLocaleString();
          },
        },
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(
      parser,
      jsonFixtures.functionStringifyByDefault(),
    );

    expect(csv).toBe(csvFixtures.functionStringifyByDefault);
  });

  it('field.value function should stringify results by default', async () => {
    const opts: ParserOptions<{ value1: any }> = {
      fields: [
        {
          label: 'Value1',
          value: (row: { value1: any }) => row.value1.toLocaleString(),
        },
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(
      parser,
      jsonFixtures.functionStringifyByDefault(),
    );

    expect(csv).toBe(csvFixtures.functionStringifyByDefault);
  });

  it('should process different combinations in fields option', async () => {
    const opts: ParserOptions = {
      fields: [
        {
          label: 'PATH1',
          value: 'path1',
        },
        {
          label: 'PATH1+PATH2',
          value: (row: any) => row.path1 + row.path2,
        },
        {
          label: 'NEST1',
          value: 'bird.nest1',
        },
        'bird.nest2',
        {
          label: 'nonexistent',
          value: 'fake.path',
          default: 'col specific default value',
        },
      ],
      defaultValue: 'NULL',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.fancyfields());

    expect(csv).toBe(csvFixtures.fancyfields);
  });

  // Default value

  it("should output the default value as set in 'defaultValue'", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price'],
      defaultValue: '',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.defaultValueEmpty());

    expect(csv).toBe(csvFixtures.defaultValueEmpty);
  });

  it("should override 'options.defaultValue' with 'field.defaultValue'", async () => {
    const opts: ParserOptions = {
      fields: [
        { value: 'carModel' },
        { value: 'price', default: 1 },
        { value: 'color' },
      ],
      defaultValue: '',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.overriddenDefaultValue());

    expect(csv).toBe(csvFixtures.overriddenDefaultValue);
  });

  it("should use 'options.defaultValue' when no 'field.defaultValue'", async () => {
    const opts: ParserOptions<CarInfo> = {
      fields: [
        {
          value: 'carModel',
        },
        {
          label: 'price',
          value: (row: CarInfo) => row.price,
          default: 1,
        },
        {
          label: 'color',
          value: (row: CarInfo) => row.color,
        },
      ],
      defaultValue: '',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.overriddenDefaultValue());

    expect(csv).toBe(csvFixtures.overriddenDefaultValue);
  });

  // Delimiter

  it("should use a custom delimiter when 'delimiter' property is defined", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
      delimiter: '\t',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.tsv);
  });

  it('should remove last delimiter |@|', async () => {
    const opts: ParserOptions = { delimiter: '|@|' };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.delimiter());

    expect(csv).toBe(csvFixtures.delimiter);
  });

  // EOL

  it("should use a custom eol character when 'eol' property is present", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
      eol: '\r\n',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.eol);
  });

  // Header

  it('should parse json to csv without column title', async () => {
    const opts: ParserOptions = {
      header: false,
      fields: ['carModel', 'price', 'color', 'manual'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.withoutHeader);
  });

  // Include empty rows

  it('should not include empty rows when options.includeEmptyRows is not specified', async () => {
    const parser = new Parser();
    const csv = await parseInput(parser, jsonFixtures.emptyRow());

    expect(csv).toBe(csvFixtures.emptyRowNotIncluded);
  });

  it('should include empty rows when options.includeEmptyRows is true', async () => {
    const opts: ParserOptions = {
      includeEmptyRows: true,
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.emptyRow());

    expect(csv).toBe(csvFixtures.emptyRow);
  });

  it('should not include empty rows when options.includeEmptyRows is false', async () => {
    const opts: ParserOptions = {
      includeEmptyRows: false,
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.emptyRow());

    expect(csv).toBe(csvFixtures.emptyRowNotIncluded);
  });

  it('should include empty rows when options.includeEmptyRows is true, with default values', async () => {
    const opts: ParserOptions = {
      fields: [
        {
          value: 'carModel',
        },
        {
          value: 'price',
          default: 1,
        },
        {
          value: 'color',
        },
      ],
      defaultValue: 'NULL',
      includeEmptyRows: true,
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.emptyRow());

    expect(csv).toBe(csvFixtures.emptyRowDefaultValues);
  });

  it('should parse data:[null] to csv with only column title, despite options.includeEmptyRows', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
      includeEmptyRows: true,
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.arrayWithNull());

    expect(csv).toBe(csvFixtures.emptyObject);
  });

  // BOM

  it('should add BOM character', async () => {
    const opts: ParserOptions = {
      withBOM: true,
      fields: ['carModel', 'price', 'color', 'manual'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.specialCharacters());

    // Compare csv length to check if the BOM character is present
    expect(csv[0]).toBe('\ufeff');
    expect(csv.length).toBe(csvFixtures.default.length + 1);
    expect(csv.length).toBe(csvFixtures.withBOM.length);
  });

  // Transforms

  it('should unwind all unwindable fields using the unwind transform', async () => {
    const opts: ParserOptions = {
      fields: [
        'carModel',
        'price',
        'extras.items.name',
        'extras.items.color',
        'extras.items.items.position',
        'extras.items.items.color',
      ],
      transforms: [unwind()],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwind2());

    expect(csv).toBe(csvFixtures.unwind2);
  });

  it('should support unwinding specific fields using the unwind transform', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'colors'],
      transforms: [unwind({ paths: ['colors'] })],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwind());

    expect(csv).toBe(csvFixtures.unwind);
  });

  it('should support multi-level unwind using the unwind transform', async () => {
    const opts: ParserOptions = {
      fields: [
        'carModel',
        'price',
        'extras.items.name',
        'extras.items.color',
        'extras.items.items.position',
        'extras.items.items.color',
      ],
      transforms: [unwind({ paths: ['extras.items', 'extras.items.items'] })],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwind2());

    expect(csv).toBe(csvFixtures.unwind2);
  });

  it('should support unwind and blank out repeated data using the unwind transform', async () => {
    const opts: ParserOptions = {
      fields: [
        'carModel',
        'price',
        'extras.items.name',
        'extras.items.color',
        'extras.items.items.position',
        'extras.items.items.color',
      ],
      transforms: [
        unwind({
          paths: ['extras.items', 'extras.items.items'],
          blankOut: true,
        }),
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwind2());

    expect(csv).toBe(csvFixtures.unwind2Blank);
  });

  it('should support flattening deep JSON using the flatten transform', async () => {
    const opts: ParserOptions = {
      transforms: [flatten()],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.deepJSON());

    expect(csv).toBe(csvFixtures.flattenedDeepJSON);
  });

  it('should support flattening JSON with nested arrays using the flatten transform', async () => {
    const opts: ParserOptions = {
      transforms: [flatten({ arrays: true })],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.flattenArrays());

    expect(csv).toBe(csvFixtures.flattenedArrays);
  });

  it('should support custom flatten separator using the flatten transform', async () => {
    const opts: ParserOptions = {
      transforms: [flatten({ separator: '__' })],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.deepJSON());

    expect(csv).toBe(csvFixtures.flattenedCustomSeparatorDeepJSON);
  });

  it('should support custom flatten separator using the flatten transform', async () => {
    const opts: ParserOptions = {
      delimiter: ';',
      transforms: [flatten({ separator: '.', arrays: true, objects: true })],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.objectWithEmptyFields());

    expect(csv).toBe(csvFixtures.objectWithEmptyFieldsStream);
  });

  it('should support multiple transforms and honor the order in which they are declared', async () => {
    const opts: ParserOptions = {
      transforms: [unwind({ paths: ['items'] }), flatten()],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwindAndFlatten());

    expect(csv).toBe(csvFixtures.unwindAndFlatten);
  });

  it('should unwind complex objects using the unwind transform', async () => {
    const opts: ParserOptions = {
      fields: [
        'carModel',
        'price',
        'extras.items.name',
        'extras.items.items.position',
        'extras.items.items.color',
        'extras.items.color',
      ],
      transforms: [
        unwind({ paths: ['extras.items', 'extras.items.items'] }),
        flatten(),
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.unwindComplexObject());

    expect(csv).toBe(csvFixtures.unwindComplexObject);
  });

  it('should support custom transforms', async () => {
    interface TransformedCarInfo {
      model: string;
      price: number;
      color: string;
      manual: 'automatic' | 'manual';
    }

    const opts: ParserOptions<CarInfo, TransformedCarInfo> = {
      transforms: [
        (row) => ({
          model: row.carModel,
          price: row.price / 1000,
          color: row.color,
          manual: row.manual || 'automatic',
        }),
      ],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.defaultCustomTransform);
  });

  it('should handle errors in transforms correctly', async () => {
    const outputStream = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });

    const opts: ParserOptions<CarInfo> = {
      transforms: [
        (row: CarInfo) => {
          if (row.carModel === 'Mercedes') {
            throw new Error('Mercerdes not allowed');
          }

          return row;
        },
      ],
    };

    const parser = new Parser(opts);
    const transformation = parser.parse(jsonFixtures.default());
    const promise = new Promise((res) => {
      transformation.on('end', () => {
        expect.fail('Exception expected');
        res(undefined);
      });
      transformation.on('error', (err) => res(err));
    });

    transformation.pipe(outputStream);
    await promise;
  });

  // Formatters

  // Number

  it("should used a custom separator when 'decimals' is passed to the number formatter", async () => {
    const opts: ParserOptions = {
      formatters: {
        number: numberFormatter({ decimals: 2 }),
      },
    };
    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.numberFormatter());

    expect(csv).toBe(csvFixtures.numberFixedDecimals);
  });

  it("should used a custom separator when 'separator' is passed to the number formatter", async () => {
    const opts: ParserOptions = {
      delimiter: ';',
      formatters: {
        number: numberFormatter({ separator: ',' }),
      },
    };
    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.numberFormatter());

    expect(csv).toBe(csvFixtures.numberCustomSeparator);
  });

  it("should used a custom separator and fixed number of decimals when 'separator' and 'decimals' are passed to the number formatter", async () => {
    const opts: ParserOptions = {
      delimiter: ';',
      formatters: {
        number: numberFormatter({ separator: ',', decimals: 2 }),
      },
    };
    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.numberFormatter());

    expect(csv).toBe(csvFixtures.numberFixedDecimalsAndCustomSeparator);
  });

  // Symbol

  it('should format Symbol by its name', async () => {
    const transformOpts = { objectMode: true };

    const parser = new Parser({}, {}, transformOpts);
    const csv = await parseInput(
      parser,
      jsonFixtures.symbol({ objectMode: true }),
    );

    expect(csv).toBe(csvFixtures.symbol);
  });

  // String Quote

  it("should use a custom quote when 'quote' property is present", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price'],
      formatters: {
        string: stringFormatter({ quote: "'" }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.withSimpleQuotes);
  });

  it("should be able to don't output quotes when setting 'quote' to empty string", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price'],
      formatters: {
        string: stringFormatter({ quote: '' }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.withoutQuotes);
  });

  it("should escape quotes when setting 'quote' property is present", async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'color'],
      formatters: {
        string: stringFormatter({ quote: "'" }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.escapeCustomQuotes());

    expect(csv).toBe(csvFixtures.escapeCustomQuotes);
  });

  it("should not escape '\"' when setting 'quote' set to something else", async () => {
    const opts: ParserOptions = {
      formatters: {
        string: stringFormatter({ quote: "'" }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.escapedQuotes());

    expect(csv).toBe(csvFixtures.escapedQuotesUnescaped);
  });

  // String Escaped Quote

  it('should escape quotes with double quotes', async () => {
    const parser = new Parser();
    const csv = await parseInput(parser, jsonFixtures.quotes());

    expect(csv).toBe(csvFixtures.quotes);
  });

  it('should not escape quotes with double quotes, when there is a backslash in the end', async () => {
    const parser = new Parser();
    const csv = await parseInput(parser, jsonFixtures.backslashAtEnd());

    expect(csv).toBe(csvFixtures.backslashAtEnd);
  });

  it('should not escape quotes with double quotes, when there is a backslash in the end, and its not the last column', async () => {
    const parser = new Parser();
    const csv = await parseInput(
      parser,
      jsonFixtures.backslashAtEndInMiddleColumn(),
    );

    expect(csv).toBe(csvFixtures.backslashAtEndInMiddleColumn);
  });

  it("should escape quotes with value in 'escapedQuote'", async () => {
    const opts: ParserOptions = {
      fields: ['a string'],
      formatters: {
        string: stringFormatter({ escapedQuote: '*' }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.escapedQuotes());

    expect(csv).toBe(csvFixtures.escapedQuotes);
  });

  it("should escape quotes before new line with value in 'escapedQuote'", async () => {
    const opts: ParserOptions = {
      fields: ['a string'],
      eol: '\n',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.backslashBeforeNewLine());

    expect(csv).toBe(forceLfEol(csvFixtures.backslashBeforeNewLine));
  });

  // String Quote Only if Necessary

  it('should quote only if necessary if using stringQuoteOnlyIfNecessary formatter', async () => {
    const opts: ParserOptions = {
      formatters: {
        string: stringQuoteOnlyIfNecessaryFormatter({ eol: '\n' }),
      },
      eol: '\n',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.quoteOnlyIfNecessary());

    expect(csv).toBe(forceLfEol(csvFixtures.quoteOnlyIfNecessary));
  });

  // String Excel

  it('should format strings to force excel to view the values as strings', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
      formatters: {
        string: stringExcelFormatter,
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.excelStrings);
  });

  it('should format strings to force excel to view the values as strings with escaped quotes', async () => {
    const opts: ParserOptions = {
      formatters: {
        string: stringExcelFormatter,
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.quotes());

    expect(csv).toBe(csvFixtures.excelStringsWithEscapedQuoted);
  });

  // String Escaping and preserving values

  it('should parse JSON values with trailing backslashes', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color'],
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.trailingBackslash());

    expect(csv).toBe(csvFixtures.trailingBackslash);
  });

  it('should escape " when preceeded by \\', async () => {
    const parser = new Parser();
    const csv = await parseInput(
      parser,
      jsonFixtures.escapeDoubleBackslashedEscapedQuote(),
    );

    expect(csv).toBe(csvFixtures.escapeDoubleBackslashedEscapedQuote);
  });

  it('should preserve new lines in values', async () => {
    const opts: ParserOptions = {
      eol: '\r\n',
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.eol());

    expect(csv).toBe(
      [
        '"a string"',
        '"with a \u2028description\\n and\na new line"',
        '"with a \u2029\u2028description and\r\nanother new line"',
      ].join('\r\n'),
    );
  });

  // Headers

  it('should format headers based on the headers formatter', async () => {
    const opts: ParserOptions = {
      fields: ['carModel', 'price', 'color', 'manual'],
      formatters: {
        header: stringFormatter({ quote: '' }),
      },
    };

    const parser = new Parser(opts);
    const csv = await parseInput(parser, jsonFixtures.default());

    expect(csv).toBe(csvFixtures.customHeaderQuotes);
  });
});
