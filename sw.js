var __wpo = {"assets":{"main":["/quick-proj/app.2a8c78836e8d99a2b903.js","/quick-proj/app.0846fd51ffdb00d39ad157819cfbb87a.css","/quick-proj/app.2a8c78836e8d99a2b903.js.map","/quick-proj/app.0846fd51ffdb00d39ad157819cfbb87a.css.map","/quick-proj/"],"additional":[],"optional":[]},"strategy":"all","version":"v1","name":"webpack-offline","relativePaths":false};

!function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}([function(e,n,t){"use strict";function o(e){function n(){u.additional.length&&("changed"===s?o():t("additional"))}function t(e){return caches.open(p).then(function(n){return n.addAll(u[e]).then(function(){console.groupCollapsed("[SW]:","Cached assets: "+e),u[e].forEach(function(e){console.log("Asset:",e)}),console.groupEnd()})})}function o(){var e=void 0;return caches.open(p).then(function(n){return e=n,n.keys()}).then(function(n){var t=n.map(function(e){return new URL(e.url).pathname}),o=u.additional.filter(function(e){return-1===t.indexOf(e)});o.length&&(console.group("[SW]:","Caching changed assets"),o.map(function(e){return console.log("Asset:",e),new Request(e)}).map(function(n){return fetch(n).then(function(t){return e.put(n,t)})}),console.groupEnd())})}function r(){return caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==p&&0===e.indexOf(h)?(console.log("[SW]:","Delete cache:",e),caches["delete"](e)):void 0}))})}function a(){var e=void 0;return caches.open(p).then(function(n){return e=n,n.keys()}).then(function(n){var t=n.filter(function(e){var n=new URL(e.url);-1===d.indexOf(n.pathname)&&(e._pathname=n.pathname)});if(t.length)return console.group("[SW]:","Deleting changed assets"),t=t.map(function(n){return console.log("Asset:",n._pathname),e["delete"](n)}),console.groupEnd(),Promise.all(t)})}function i(){Object.keys(u).forEach(function(e){u[e]=u[e].map(function(e){var n=new URL(c.origin+c.pathname+e);return n.pathname})})}var c=new URL(registration.scope),s=e.strategy,u=e.assets,l={all:e.version,changed:"static",hash:e.hash},h=e.name,f=l[s],p=h+":"+f;e.relativePaths&&i();var d=[].concat(u.main,u.additional,u.optional);self.addEventListener("install",function(e){console.log("[SW]:","Install event");var o=t("main").then(n);e.waitUntil(o)}),self.addEventListener("activate",function(e){console.log("[SW]:","Activate event");var n=r();"changed"===s&&(n=n.then(a)),e.waitUntil(n.then(function(){return self.clients&&self.clients.claim?self.clients.claim():void 0}))}),self.addEventListener("fetch",function(e){var n=new URL(e.request.url);if("GET"!==e.request.method||n.origin!==location.origin||-1===d.indexOf(n.pathname))return void(-1!==navigator.userAgent.indexOf("Firefox/44")&&e.respondWith(fetch(e.request)));if(-1!==u.main.indexOf(n.pathname))return void e.respondWith(caches.match(e.request,{cacheName:p}));var t=caches.match(e.request,{cacheName:p}).then(function(t){return t?t:fetch(e.request.clone()).then(function(t){if(!t||200!==t.status||"basic"!==t.type)return t;var o=t.clone();return caches.open(p).then(function(n){return n.put(e.request,o)}).then(function(){console.log("[SW]:","Cache asset: "+n.pathname)}),t})});e.respondWith(t)})}t(2),o(__wpo),e.exports=t(1)},function(e,n){},function(e,n,t){"use strict";e.exports=t(3)},function(e,n){Cache.prototype.add||(Cache.prototype.add=function(e){return this.addAll([e])}),Cache.prototype.addAll||(Cache.prototype.addAll=function(e){function n(e){this.name="NetworkError",this.code=19,this.message=e}var t=this;return n.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var t=new URL(e.url).protocol;if("http:"!==t&&"https:"!==t)throw new n("Invalid scheme");return fetch(e.clone())}))}).then(function(n){return Promise.all(n.map(function(n,o){return t.put(e[o],n)}))}).then(function(){})})}]);