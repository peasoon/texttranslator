import path from "path";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const config = {
  entry: "./src/index.js",
  output: {
    filename: "scripts.js",
    path: path.join(__dirname, "src"),
  },
	watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./scss/_outerstyles.scss",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          { 
            loader: MiniCssExtractPlugin.loader, options: {
              
            } 
          },
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "expanded",
              },
            },
          }
        ]
      },
    ],
  },
};

export default config;
