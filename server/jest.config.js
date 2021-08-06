module.exports = {
    verbose: true,
    testURL: 'http://0.0.0.0:3004',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
	setupFilesAfterEnv: ['./jest.setup.js']
  };