module.exports = {
    type: 'react-component',
    npm: {
        esModules: true,
        umd: false
    },
    karma: {
        testContext: 'tests/context.js',
    },
    webpack: {
        html: {
            template: 'demo/src/index.html'
        }
    }
};
