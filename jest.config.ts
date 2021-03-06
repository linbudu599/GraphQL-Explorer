export default {
  automock: false,
  bail: 5,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./server/utils/(auth|jwt|bcrypt).ts"],
  setupFilesAfterEnv: [],
  setupFiles: [],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  notify: true,
  preset: "ts-jest",
  runner: "jest-runner",
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    enzymeAdapter: "react16",
  },
  maxWorkers: "80%",
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    // waiting for alias configuration on Parcel & TS
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
  },
  // TODO: config by env variables dynamically
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  testRunner: "jasmine2",
  timers: "real",
  transform: { "\\.tsx?$": "ts-jest" },
};
