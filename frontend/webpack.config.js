module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      components: path.resolve(__dirname, 'src', 'components'),
      lib: path.resolve(__dirname, 'src', 'lib'),
      scenes: path.resolve(__dirname, 'src', 'scenes'),
    },
    preferRelative: true,
  },
}
