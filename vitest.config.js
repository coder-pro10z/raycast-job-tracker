/** @type {import('vitest/config').UserConfig} */
module.exports = {
  test: {
    include: [
      'tests/**/*.test.js',
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
    environment: 'jsdom',
    globals: true,
  },
};
