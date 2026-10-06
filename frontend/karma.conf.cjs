const ruta = require('node:path');

module.exports = function configurarPruebas(configuracion) {
  configuracion.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      'pruebas/configuracion.js', 'pruebas/**/*.spec.jsx', 'pruebas/**/*.spec.js',
      { pattern: 'public/**/*', served: true, included: false, watched: false }
    ],
    proxies: { '/imagenes/': '/base/public/imagenes/' },
    preprocessors: {
      'pruebas/configuracion.js': ['webpack'],
      'pruebas/**/*.spec.jsx': ['webpack'],
      'pruebas/**/*.spec.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      output: {
        path: ruta.join(__dirname, 'coverage')
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '120' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [
                  ['istanbul', { include: ['src/**/*.{js,jsx}'] }]
                ]
              }
            }
          }
        ]
      }
    },
    browsers: ['ChromeHeadless'],
    reporters: ['progress'],
    coverageReporter: {
      dir: ruta.join(__dirname, 'coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    client: {
      jasmine: { random: false }
    },
    autoWatch: true,
    singleRun: false
  });
};
