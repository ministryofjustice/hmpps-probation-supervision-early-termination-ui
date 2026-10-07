import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['{server,job}/**/*.test.{ts,js,jsx,mjs}', '{server,job}/**/*.cy.{ts,js,jsx,mjs}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      include: ['server/**/*.{ts,js,jsx,mjs}'],
    },
    reporters: ['default', 'junit', 'html'],
    outputFile: {
      junit: 'test_results/jest/junit.xml',
      json: 'test_results/jest/json.json',
      html: 'test_results/unit-test-reports.html',
    },
  },
})
