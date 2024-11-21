export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/config/",
    "/src/models/",
    "/src/seeders/",
    "/src/validators/",
  ],
};