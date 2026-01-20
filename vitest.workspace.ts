import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'plainjs',
      root: './packages/plainjs',
      include: ['test/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'node',
      root: './packages/node',
      include: ['test/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'whatwg',
      root: './packages/whatwg',
      include: ['test/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'cli',
      root: './packages/cli',
      include: ['test/**/*.test.ts'],
      sequence: {
        concurrent: false,
      },
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
    },
  },
]);
