module.exports = {

  // collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx,js,jsx}',
  ],

  testPathIgnorePatterns: [

  ],

  roots: [
    '<rootDir>',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  modulePaths: [
    '<rootDir>',
  ],
}
