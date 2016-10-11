import {join} from 'path'

const include = join(__dirname, 'src')

export default {
  entry: './src/quasi',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'quasi',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', include},
    ],
  },
}
