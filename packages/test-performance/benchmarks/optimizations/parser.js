import { Parser } from '@json2csv/plainjs';
import { getProp } from '@json2csv/plainjs/utils.js';
import { unwind } from '@json2csv/transforms';
import runSuite from '../runSuite.js';

const rowCount = 1000;
const fieldCount = 20;
const fields = Array.from({ length: fieldCount }, (_, index) => `f${index}`);
const flatRows = Array.from({ length: rowCount }, (_, rowIndex) =>
  Object.fromEntries(
    fields.map((field, fieldIndex) => [field, rowIndex + fieldIndex]),
  ),
);

const explicitParser = new Parser({ fields });
const expectedFlatCsv = explicitParser.parse(flatRows);

await runSuite({
  name: `Field discovery (${rowCount} rows x ${fieldCount} fields)`,
  expected: expectedFlatCsv,
  benchmarks: [
    {
      name: 'inferred fields',
      run: () => new Parser().parse(flatRows),
    },
    {
      name: 'explicit fields',
      run: () => new Parser({ fields }).parse(flatRows),
    },
  ],
});

const wideFieldCount = 200;
const wideFields = Array.from(
  { length: wideFieldCount },
  (_, index) => `f${index}`,
);
const wideRows = Array.from({ length: rowCount }, (_, rowIndex) =>
  Object.fromEntries(
    wideFields.map((field, fieldIndex) => [field, rowIndex + fieldIndex]),
  ),
);
const wideExplicitParser = new Parser({ fields: wideFields });
const expectedWideCsv = wideExplicitParser.parse(wideRows);

await runSuite({
  name: `Wide-schema field discovery (${rowCount} rows x ${wideFieldCount} fields)`,
  expected: expectedWideCsv,
  benchmarks: [
    {
      name: 'inferred fields',
      run: () => new Parser().parse(wideRows),
    },
    {
      name: 'explicit fields',
      run: () => new Parser({ fields: wideFields }).parse(wideRows),
    },
  ],
});

const nestedRows = flatRows.map((row) => ({ nested: row }));
const nestedFields = fields.map((field) => `nested.${field}`);
const stringPathParser = new Parser({ fields: nestedFields });
const reparsedPathParser = new Parser({
  fields: nestedFields.map((field) => ({
    label: field,
    value: (row) => getProp(row, field),
  })),
});
const compiledGetterParser = new Parser({
  fields: fields.map((field) => ({
    label: `nested.${field}`,
    value: (row) => row.nested[field],
  })),
});
const expectedNestedCsv = compiledGetterParser.parse(nestedRows);

await runSuite({
  name: `Nested field lookup (${rowCount} rows x ${fieldCount} fields)`,
  expected: expectedNestedCsv,
  benchmarks: [
    {
      name: 'cached string paths',
      run: () => stringPathParser.parse(nestedRows),
    },
    {
      name: 'legacy reparsed paths',
      run: () => reparsedPathParser.parse(nestedRows),
    },
    {
      name: 'precompiled getters',
      run: () => compiledGetterParser.parse(nestedRows),
    },
  ],
});

const nestedArrayData = [
  {
    id: 1,
    items: Array.from({ length: 100 }, (_, itemIndex) => ({
      id: itemIndex,
      tags: Array.from({ length: 5 }, (_, tagIndex) => `tag-${tagIndex}`),
    })),
  },
];
const unwindFields = ['id', 'items.id', 'items.tags'];
const automaticUnwindParser = new Parser({
  fields: unwindFields,
  transforms: [unwind()],
});
const explicitUnwindParser = new Parser({
  fields: unwindFields,
  transforms: [unwind({ paths: ['items', 'items.tags'] })],
});
const repeatedUnwindParser = new Parser({
  fields: unwindFields,
  transforms: [
    unwind({
      paths: ['items', ...Array.from({ length: 99 }, () => 'items.tags')],
    }),
  ],
});
const expectedUnwindCsv = explicitUnwindParser.parse(nestedArrayData);

await runSuite({
  name: 'Automatic nested unwind path discovery (100 x 5 rows)',
  expected: expectedUnwindCsv,
  benchmarks: [
    {
      name: 'automatic paths',
      run: () => automaticUnwindParser.parse(nestedArrayData),
    },
    {
      name: 'legacy repeated paths',
      run: () => repeatedUnwindParser.parse(nestedArrayData),
    },
    {
      name: 'explicit deduplicated paths',
      run: () => explicitUnwindParser.parse(nestedArrayData),
    },
  ],
});
