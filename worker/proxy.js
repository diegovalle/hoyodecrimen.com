const DOMAIN = 'hoyodecrimen.com'// 'hoyodecrimen.com';    //
const PROXYPATH = 'api/v1';                // path to be proxied
const ORIGIN = 'api.hoyodecrimen.com';         // where to fetch content from

addEventListener('fetch', event => {
  var url = new URL(event.request.url);
  if (url.pathname.startsWith('/' + PROXYPATH + '/') || url.pathname === '/' + PROXYPATH) {
    handleRequest(event, url);
  } else {
    event.respondWith(fetch(event.request));
  }
})

async function handleRequest(event, url) {
  // Change URL from public URL to use the origin URL
  var originUrl = url.toString().replace(
      'https://' + DOMAIN + '/' + PROXYPATH, 
      'https://' + ORIGIN+ '/' + PROXYPATH
    );
    event.passThroughOnException();
    event.respondWith(fetch(originUrl));
}