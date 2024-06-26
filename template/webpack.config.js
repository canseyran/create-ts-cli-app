/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: "./src/main.ts",
  mode: "production",
  watch: false,
  output: {
    filename: "bin.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "node",
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
