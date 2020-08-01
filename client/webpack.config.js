const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  }, // Añadimos nuestro punto de salida
  resolve: {
    extensions: ["*", ".mjs", ".js", ".svelte"],
  }, // Añadimos el soporte para las extensiones que utiliza svelte
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }, // Creamos la regla para nuestros archivos JS
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      }, // Utilizamos svelte-loader para trabajar con los archivos .svelte
      {
        test: /\.css$/,
        use: [
          /**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  devServer: {
    inline: true,
    port: 8008,
    proxy: {
      "/api/books": {
        target: "http://localhost:3000",
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ], // utilizamos este plugin para añadir el recurso compilado al documento HTML
  devtool: prod ? false : "source-map",
};
