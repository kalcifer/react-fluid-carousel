const path = require("path");

module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  moduleNameMapper: {
    "^./react": path.resolve(__dirname, "node_modules/react")
  }
};
