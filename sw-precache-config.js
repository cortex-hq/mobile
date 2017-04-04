// https://developers.google.com/web/showcase/2015/service-workers-iowa
module.exports = {
  navigateFallback: '/index.html',
  maximumFileSizeToCacheInBytes: 8388608,
  stripPrefix: 'dist',
  root: 'dist/',
  verbose: true,
  cacheId: 'cortex-v0.99',
  importScripts: [
    'fallback-images.js'
  ],
  staticFileGlobs: [
    'dist/index.html',
    'dist/**/*.{js,css}',
    'dist/assets/images/**/*.{png,jpg}',
    'dist/assets/fonts/**',
    'dist/manifest.json',
    'dist/favicon.ico'
  ],
  runtimeCaching: [
    // {
    //   urlPattern: /\/\/lorempixel.com\/*/,
    //   handler: 'networkFirst'
    // },
    {
      urlPattern: /\/api\/tests\//,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 25,
          name: 'cortex-api-cache'
        }
      }
    },
    {
      urlPattern: /\/api\/sport*/,
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 10,
          name: 'cortex-api-sport'
        },
        origin: /\/\/localhost:8080\//
      }
    }
  ]
};
