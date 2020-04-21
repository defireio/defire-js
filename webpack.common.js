const path = require("path");

module.exports = {
  target: "web",
  entry: {
    Defire: ["./dist/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "./builds"),
    library: "Defire",
  },
};
