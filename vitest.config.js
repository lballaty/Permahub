/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/vitest.config.js
 * Description: Vitest configuration for unit testing
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-07
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',

    // Enable global test functions (describe, it, expect)
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/'
      ],
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85
    },

    // Include patterns
    include: ['tests/unit/**/*.test.js'],

    // Setup files
    setupFiles: ['tests/setup.js'],

    // Timeout for tests
    testTimeout: 10000
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@tests': resolve(__dirname, 'tests')
    }
  }
});
