import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: [
        'packages/formatters/dist/mjs/**/*.js',
        'packages/plainjs/dist/mjs/**/*.js',
        'packages/node/dist/mjs/**/*.js',
        'packages/whatwg/dist/mjs/**/*.js',
        'packages/transforms/dist/mjs/**/*.js',
      ],
      exclude: [
        'packages/test-helpers/**',
        'packages/test-performance/**',
        '**/index.js',
        '**/index.ts',
        '**/*.d.ts',
        '**/*.map',
        '**/types/**',
        '**/Formatter.js', // Type-only file
        '**/Transform.js', // Type-only file (transforms package)
      ],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 93,
        functions: 95,
        lines: 93,
        branches: 86,
      },
    },
  },
});
