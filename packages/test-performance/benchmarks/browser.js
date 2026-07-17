import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { chromium, firefox, webkit } from 'playwright';
import {
  availableBenchmarks,
  selectBenchmarks,
} from './availableBenchmarks.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const validateOnly = args.includes('--validate-only');
const selectedBenchmarks = selectBenchmarks(args);
const requestedBrowser = args
  .find((argument) => argument.startsWith('--browser='))
  ?.slice('--browser='.length);
const browsers = [
  ['chrome', 'Chrome for Testing', chromium],
  ['firefox', 'Firefox', firefox],
  ['webkit', 'WebKit (Safari engine)', webkit],
].filter(([id]) => !requestedBrowser || requestedBrowser === id);

if (!browsers.length) {
  throw new Error(
    `Unknown browser "${requestedBrowser}". Available browsers: chrome, firefox, webkit`,
  );
}

const imports = selectedBenchmarks
  .map(
    (benchmarkName) =>
      `await import(${JSON.stringify(availableBenchmarks.get(benchmarkName))});`,
  )
  .join('\n');
const entrySource = `
globalThis.__json2csvBenchmarkConfig = ${JSON.stringify({ validateOnly })};
globalThis.__json2csvBenchmarkResults = [];
try {
  ${imports}
  globalThis.__json2csvBenchmarkDone = true;
} catch (error) {
  globalThis.__json2csvBenchmarkError = error?.stack || String(error);
  console.error(globalThis.__json2csvBenchmarkError);
}
`;
const browserRunSuitePath = path.join(dirname, 'runSuite.browser.js');
const bundle = await esbuild.build({
  stdin: {
    contents: entrySource,
    resolveDir: dirname,
    sourcefile: 'browser-entry.js',
  },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  write: false,
  plugins: [
    {
      name: 'browser-benchmark-runner',
      setup(build) {
        build.onResolve({ filter: /runSuite\.js$/ }, () => ({
          path: browserRunSuitePath,
        }));
      },
    },
  ],
});
const bundleSource = bundle.outputFiles[0].text;

for (const [, browserName, browserType] of browsers) {
  const browser = await browserType.launch({ headless: true });
  try {
    process.stdout.write(
      `\njson2csv performance suite | ${browserName} ${browser.version()}\n`,
    );
    const page = await browser.newPage();
    page.on('console', (message) => {
      if (message.type() === 'log') process.stdout.write(`${message.text()}\n`);
    });
    await page.setContent('<!doctype html><meta charset="utf-8">');
    await page.addScriptTag({ content: bundleSource, type: 'module' });
    await page.waitForFunction(
      () =>
        globalThis.__json2csvBenchmarkDone ||
        globalThis.__json2csvBenchmarkError,
      undefined,
      { timeout: 15 * 60 * 1000 },
    );
    const error = await page.evaluate(
      () => globalThis.__json2csvBenchmarkError,
    );
    if (error) throw new Error(error);
  } finally {
    await browser.close();
  }
}
