let mix = require('laravel-mix')
let path = require('path')

mix.setPublicPath('dist')
    .js('resources/js/field.js', 'js')
    .vue({ version: 3 })
    .sass('resources/sass/field.scss', 'css')
    .webpackConfig({
        externals: {
            vue: 'Vue'
        },
        output: {
            uniqueName: 'fourstacks/nova-checkboxes'
        },
        resolve: {
            modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
            alias: {
                'laravel-nova': path.join(
                    __dirname,
                    '../../../vendor/laravel/nova/resources/js/mixins/packages.js'
                )
            }
        }
    })
    .alias({
        'laravel-nova': path.join(
            __dirname,
            '../../../vendor/laravel/nova/resources/js/mixins/packages.js'
        )
    })
