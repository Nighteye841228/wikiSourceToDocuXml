module.exports = {
    publicPath:
    process.env.NODE_ENV === 'production' ? '/wikiSourceToDocuXml/' : '/',
    configureWebpack: {
        devtool: 'source-map',
    },
};
