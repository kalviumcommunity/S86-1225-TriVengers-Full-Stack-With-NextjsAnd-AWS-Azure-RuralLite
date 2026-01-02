import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'components/Button.jsx',
        'lib/utils/helpers.js',
        'lib/logger.js',
        'lib/errorHandler.js',
        'lib/responseHandler.js',
      ],
      exclude: [
        'node_modules/',
        '.next/',
        'dist/',
        'tests/',
        '**/*.config.js',
        '**/*.config.mjs',
        '**/coverage/**',
      ],
      thresholds: {
        branches: 75,
        functions: 75,
        lines: 75,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
