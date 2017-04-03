module.exports=function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/static/",t(t.s=19)}([/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
function(e,t){e.exports=require("mongoose")},/*!************************!*\
  !*** ./model/notes.js ***!
  \************************/
function(e,t,r){"use strict";var n=r(/*! mongoose */0),i=n.Schema,o=new i({title:{type:String,required:!0},content:{type:String,required:!0},subcategory:{type:Array},img:String,author:Number,updatedTime:Date}),s=n.model("NoteModel",o);e.exports=s},/*!**********************************!*\
  !*** external "app-module-path" ***!
  \**********************************/
function(e,t){e.exports=require("app-module-path")},/*!*******************************************************!*\
  !*** external "babel-runtime/core-js/json/stringify" ***!
  \*******************************************************/
function(e,t){e.exports=require("babel-runtime/core-js/json/stringify")},/*!******************************************************!*\
  !*** external "babel-runtime/core-js/object/assign" ***!
  \******************************************************/
function(e,t){e.exports=require("babel-runtime/core-js/object/assign")},/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
function(e,t){e.exports=require("body-parser")},/*!****************************************!*\
  !*** external "components/Routes.jsx" ***!
  \****************************************/
function(e,t){e.exports=require("components/Routes.jsx")},/*!*******************************************!*\
  !*** external "css-modules-require-hook" ***!
  \*******************************************/
function(e,t){e.exports=require("css-modules-require-hook")},/*!**************************!*\
  !*** external "express" ***!
  \**************************/
function(e,t){e.exports=require("express")},/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
function(e,t){e.exports=require("fs")},/*!************************!*\
  !*** external "react" ***!
  \************************/
function(e,t){e.exports=require("react")},/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
function(e,t){e.exports=require("react-dom/server")},/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
function(e,t){e.exports=require("react-redux")},/*!*******************************!*\
  !*** external "react-router" ***!
  \*******************************/
function(e,t){e.exports=require("react-router")},/*!*************************************!*\
  !*** external "react-router-redux" ***!
  \*************************************/
function(e,t){e.exports=require("react-router-redux")},/*!***************************!*\
  !*** external "reducers" ***!
  \***************************/
function(e,t){e.exports=require("reducers")},/*!************************!*\
  !*** external "redux" ***!
  \************************/
function(e,t){e.exports=require("redux")},/*!*******************************!*\
  !*** external "redux-logger" ***!
  \*******************************/
function(e,t){e.exports=require("redux-logger")},/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
function(e,t){e.exports=require("redux-thunk")},/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(/*! babel-runtime/core-js/json/stringify */3),o=n(i),s=r(/*! babel-runtime/core-js/object/assign */4),a=n(s);t.default=function(e){function t(e,t){if(-1===e.url.indexOf("/api/")){var r={index:{},notes:{},aboutme:{}},i=y(r),o=(0,x.syncHistoryWithStore)((0,_.createMemoryHistory)(),i),s="";(0,_.match)({routes:g,location:e.originalUrl,history:o},function(e,r,o){if(o){s=(0,f.renderToStaticMarkup)(d.default.createElement(c.Provider,{store:i},d.default.createElement(_.RouterContext,o)));var a=i.getState();t.send(n(s,a))}else t.status(404).send("Not found")})}}function n(e,t){return'\n          <!doctype html>\n          <html lang="tw">\n            <head>\n              <meta charset="utf-8">\n              <meta name="viewport" content="width=device-width, initial-scale=1">\n              <title>CodeDesign</title>\n              <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />\n              <link rel="stylesheet" type="text/css" href="/dist/assets/style.css" />\n              <link rel="icon" type="image/png" href="/dist/images/favicon.png">\n            </head>\n            <body>\n              <div id="root">'+e+"</div>\n              <script>\n                window.__PRELOADED_STATE__ = "+(0,o.default)(t)+'\n              </script>\n              <script type="text/javascript" charset="utf8" src="/dist/assets/index.js"></script>\n            </body>\n          </html>\n      '}b.use("/dist/assets",v.static(__dirname+"/dist/assets")),b.use("/dist/images",v.static(__dirname+"/dist/images")),b.use("/dist/favicon.ico",v.static(__dirname+"/dist/favicon.ico")),b.use("/data",v.static(__dirname+"/data")),b.use(h.json()),b.all("/api/*",function(e,t){var n=(r(/*! ./model/notes */1),e.url.split("/api/")[1]),i=n.split("/");!function(){switch(i[0]){case"notes":var r=i[1];j.readFile(__dirname+"/data/note.json","utf8",function(e,n){if(e)throw e;t.send(JSON.parse(n).list.filter(function(e){return e.subcategory.indexOf(r)>-1}))});break;case"note":var n=i[1],s=e.method;"GET"===s?j.readFile(__dirname+"/data/note.json","utf8",function(e,r){if(e)throw e;var i=JSON.parse(r).list.filter(function(e){return e._id===n})[0];i?t.send(i):t.status(404).send("Not Found")}):"PUT"===s?j.readFile(__dirname+"/data/note.json","utf8",function(r,i){if(r)throw r;var s=JSON.parse(i).list,u=s.filter(function(e){return e._id===n})[0];u=(0,a.default)({},u,e.body),j.writeFileSync(__dirname+"/data/note.json",(0,o.default)({list:s.map(function(e){return e._id===n?u:e})})),t.send(u)}):"DELETE"===s?j.readFile(__dirname+"/data/note.json","utf8",function(e,r){var i=JSON.parse(r).list,s=i.filter(function(e){return e._id===n})[0];j.writeFileSync(__dirname+"/data/note.json",(0,o.default)({list:i.filter(function(e){return e._id!==n})})),t.send(s)}):"POST"===s&&function(){var r=(0,a.default)({},e.body,{_id:Date.now().toString()});j.readFile(__dirname+"/data/note.json","utf8",function(e,t){var n=JSON.parse(t).list;n.push(r),j.writeFileSync(__dirname+"/data/note.json",(0,o.default)({list:n}))}),t.send(r)}();break;default:t.send({})}}()}),b.use(t),b.listen(b.get("port"),function(){console.log("listening on "+b.get("port"))})};var u=r(/*! react */10),d=n(u),c=(r(/*! redux */16),r(/*! react-redux */12)),f=r(/*! react-dom/server */11),l=r(/*! redux-thunk */18),p=(n(l),r(/*! redux-logger */17)),m=n(p),_=r(/*! react-router */13),x=r(/*! react-router-redux */14);r(/*! css-modules-require-hook */7)({generateScopedName:"[name]__[local]___[hash:base64:5]"}),r(/*! app-module-path */2).addPath(__dirname+"/src/");var h=r(/*! body-parser */5),y=r(/*! reducers */15).default,g=((0,m.default)(),r(/*! components/Routes.jsx */6)),v=r(/*! express */8),b=v(),j=(r(/*! mongoose */0),r(/*! fs */9));b.set("port",r.i({NODE_ENV:"production"}).PORT||3e3),e.exports=t.default}]);