module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/api\/tests\//,
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 25,
          name: 'cortex-api-cache'
        }
      }
    }
  ]
};
