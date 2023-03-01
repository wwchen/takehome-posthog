module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'components': path.resolve(__dirname, 'src', 'components'),
        },
        preferRelative: true
    }
}