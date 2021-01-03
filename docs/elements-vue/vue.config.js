const path = require('path')

module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // mutate config for production...
            console.log('configure for prod')
        } else {
            // mutate for development...
            console.log('configure not for prod')

            config.resolve = {
                modules: ['node_modules', '../../packages/node_modules/'],
                alias : {
                    '@': path.resolve(__dirname, 'src/'),
                }
            }
        }
    }
}