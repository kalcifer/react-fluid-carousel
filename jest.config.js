const path = require("path");

module.exports = {
  verbose: true,
  moduleNameMapper: {
    "^./react": path.resolve(__dirname, "node_modules/react")
  }
};
