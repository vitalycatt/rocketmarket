if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>n(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"5595e1018c500b80127ab606c3c31454"},{url:"/_next/static/Es_Zr4urA9FgT9F4o2F-I/_buildManifest.js",revision:"44c437aca5006c76d672478a38bee384"},{url:"/_next/static/Es_Zr4urA9FgT9F4o2F-I/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/117-a5b0515de576a2bf.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/261-42993bafefc29a7e.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/298.37dced66369b2f83.js",revision:"37dced66369b2f83"},{url:"/_next/static/chunks/340-f840ac50621a4ae1.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/506-7de59e1ea3b8b034.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/529-3c045edcdaa0e60a.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/636-3310309254e3a720.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/745-3ce93f119bb41058.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/913-b832d2740b995714.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/_not-found/page-701e2d86e5488441.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/catalog/page-64f27bfccb01abda.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/checkout/page-9e576c20c883d47c.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/layout-2674dac101eb3bff.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/not-found-953a7129bfb7ab47.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/page-cc738de7dcd1b440.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/app/profile/page-4c33be781d1d39eb.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/d0deef33.bd75b11a952a2d3d.js",revision:"bd75b11a952a2d3d"},{url:"/_next/static/chunks/fd9d1056-a338ba512b8a15f1.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/framework-271460f5ed9d9bc1.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/main-app-ca900a1a2ab0f240.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/main-f9b1a3caa4f032f5.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/pages/_app-8c2c9384e8f3bfb9.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-565faaa457a3b5fc.js",revision:"Es_Zr4urA9FgT9F4o2F-I"},{url:"/_next/static/css/238dc3d14e96c9bc.css",revision:"238dc3d14e96c9bc"},{url:"/_next/static/css/ecac7a05b10f1ebe.css",revision:"ecac7a05b10f1ebe"},{url:"/_next/static/css/fc1c9daac70c093b.css",revision:"fc1c9daac70c093b"},{url:"/_next/static/media/layers-2x.9859cd12.png",revision:"9859cd12"},{url:"/_next/static/media/layers.ef6db872.png",revision:"ef6db872"},{url:"/_next/static/media/marker-icon.d577052a.png",revision:"d577052a"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/0FCC87EE-C2A3-400A-A276-E71C9F9AA4D1.jpeg",revision:"f869be32272e8d0563412e40dc53fc1d"},{url:"/icons/marker.svg",revision:"f5c13ecd6e957c611538c0ce6af0cf75"},{url:"/icons/rocket.svg",revision:"cae37753436c9edba84a2fa7ed9f055e"},{url:"/images/marker.svg",revision:"f4773e00252af6df516db2c8e812efa6"},{url:"/manifest.json",revision:"b5cc6a565efba39bb245fda4523984ce"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/rocket-pattern.jpg",revision:"ae2522d0775e164e3d29363e96221093"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
