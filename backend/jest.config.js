const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/app.ts",
    "!src/services/*.ts",
    "!**/*.test.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/services/rickMortyService.test.ts",
  ],
};
