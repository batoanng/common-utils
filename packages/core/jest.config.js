module.exports = {
    projects: [
        '<rootDir>/jest.common.config.js', // apply setting with preset: 'ts-jest'
    ],
    testResultsProcessor: 'jest-sonar-reporter',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
        // example for specific config
        './src/async-utils': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};
