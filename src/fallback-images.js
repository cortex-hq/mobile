// Assume that the image at this URL is already cached via sw-precache.
const FALLBACK_PROFILE_IMAGE = 'assets/images/tests/test-avatar-default.png';

// toolbox is considered loaded because runtimeCaching is used in sw-precache-config.js

function getFallbackProfileImage() {
  return toolbox.cacheOnly(new Request(FALLBACK_PROFILE_IMAGE));
}

function profileImageRequest(request) {
  console.log(`profileImageRequest::fct`);
  return toolbox.cacheFirst(request).catch(getFallbackProfileImage);
}

// force precache fallback image. Do not rely on sw-precache-config
toolbox.precache([ FALLBACK_PROFILE_IMAGE]);

toolbox.router.get(
  new RegExp('lorempixel\.com'),
  profileImageRequest
);
