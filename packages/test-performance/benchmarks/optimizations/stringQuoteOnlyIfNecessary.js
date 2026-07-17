import stringFormatter from '@json2csv/formatters/string.js';
import productionFormatter from '@json2csv/formatters/stringQuoteOnlyIfNecessary.js';
import runSuite from '../runSuite.js';

function normalizeOptions(opts = {}) {
  const quote = typeof opts.quote === 'string' ? opts.quote : '"';
  const escapedQuote =
    typeof opts.escapedQuote === 'string'
      ? opts.escapedQuote
      : `${quote}${quote}`;
  const separator = typeof opts.separator === 'string' ? opts.separator : ',';
  const eol = typeof opts.eol === 'string' ? opts.eol : '\n';

  return { quote, escapedQuote, separator, eol };
}

function referenceFormatter(opts = {}) {
  const { quote, escapedQuote, separator, eol } = normalizeOptions(opts);

  return (value) => {
    if (
      !value.includes(quote) &&
      !value.includes(separator) &&
      !value.includes(eol)
    ) {
      return value;
    }

    if (!quote || quote === escapedQuote) return value;
    return `${quote}${value.split(quote).join(escapedQuote)}${quote}`;
  };
}

function perCallArrayFormatter(opts = {}) {
  const { quote, escapedQuote, separator, eol } = normalizeOptions(opts);
  const formatString = stringFormatter({ quote, escapedQuote });

  return (value) => {
    if ([quote, separator, eol].some((char) => value.includes(char))) {
      return formatString(value);
    }
    return value;
  };
}

function cachedArrayFormatter(opts = {}) {
  const { quote, escapedQuote, separator, eol } = normalizeOptions(opts);
  const formatString = stringFormatter({ quote, escapedQuote });
  const chars = [quote, separator, eol];

  return (value) => {
    if (chars.some((char) => value.includes(char))) {
      return formatString(value);
    }
    return value;
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function regexpFormatter(opts = {}) {
  const { quote, escapedQuote, separator, eol } = normalizeOptions(opts);
  const formatString = stringFormatter({ quote, escapedQuote });
  const chars = new RegExp([quote, separator, eol].map(escapeRegExp).join('|'));

  return (value) => (chars.test(value) ? formatString(value) : value);
}

function formatBatch(formatter, values) {
  let outputLength = 0;
  for (const value of values) outputLength += formatter(value).length;
  return outputLength;
}

const scenarios = [
  {
    name: 'Quote-free short strings (1000 cells)',
    opts: {},
    values: Array.from({ length: 1000 }, (_, index) => `value-${index}`),
  },
  {
    name: 'Mixed CSV-sensitive strings (1000 cells)',
    opts: {},
    values: Array.from(
      { length: 1000 },
      (_, index) =>
        ['plain', 'with,comma', 'with"quote', 'line\nbreak', ''][index % 5],
    ),
  },
  {
    name: 'Long strings (1000 cells)',
    opts: {},
    values: Array.from(
      { length: 1000 },
      (_, index) => `${'x'.repeat(512)}${index % 4 === 0 ? ',' : ''}`,
    ),
  },
  {
    name: 'Multi-character separator and EOL (1000 cells)',
    opts: { quote: '~', escapedQuote: '~~', separator: '||', eol: '\r\n' },
    values: Array.from(
      { length: 1000 },
      (_, index) =>
        [
          'plain',
          'one|pipe',
          'two||pipes',
          'line\nbreak',
          'line\r\nbreak',
          'has~quote',
        ][index % 6],
    ),
  },
];

for (const scenario of scenarios) {
  const reference = referenceFormatter(scenario.opts);
  const candidates = [
    {
      name: 'production direct checks',
      formatter: productionFormatter(scenario.opts),
    },
    {
      name: 'per-call array',
      formatter: perCallArrayFormatter(scenario.opts),
    },
    {
      name: 'cached array',
      formatter: cachedArrayFormatter(scenario.opts),
    },
    {
      name: 'escaped RegExp alternation',
      formatter: regexpFormatter(scenario.opts),
    },
  ];

  await runSuite({
    name: scenario.name,
    expected: scenario.values.map(reference),
    benchmarks: candidates.map((candidate) => ({
      name: candidate.name,
      run: () => formatBatch(candidate.formatter, scenario.values),
      validate: () => scenario.values.map(candidate.formatter),
    })),
  });
}
