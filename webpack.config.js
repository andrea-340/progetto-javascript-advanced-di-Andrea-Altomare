const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development", // Usa 'development' o 'production' a seconda del tuo ambiente
  entry: "./src/assets/js/index.js", // Percorso del file di ingresso
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // Necessario per il dev server
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Regola per file JS
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/, // Regola per file CSS
        use: [
          MiniCssExtractPlugin.loader, // Estrae CSS in file separati
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Percorso del template HTML
      favicon: false, // Disabilita la favicon
    }),
    new MiniCssExtractPlugin({
      filename: "stiles.css", // Nome del file CSS
    }),
  ],
  devtool: "source-map", // Per il debugging
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 8080, // Porta cambiata da 9004 a 8080
    open: false, // Disabilitata l'apertura automatica del browser
  },

};
