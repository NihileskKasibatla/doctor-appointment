module.exports = {
  collectCoverage: true,
  verbose: true,
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    "\\.(css|less|scss|png)$": "identity-obj-proxy",
    "axios": "axios/dist/node/axios.cjs"
  },
  testEnvironment: 'jsdom'
};
