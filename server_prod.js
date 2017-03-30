'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _server = require('react-dom/server');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require.extensions['.css'] = function () {
  return;
};
require('./server.babel');
require('app-module-path').addPath(__dirname + '/src/');


var bodyParser = require('body-parser');

var appStoreCreate = require('reducers').default;
var loggerMiddleware = (0, _reduxLogger2.default)();
var Routes = require('components/Routes');
//const dbkey = require('./dbkey.js').key

var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Fake data
var fs = require('fs');

app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
app.use('/dist/images', express.static(__dirname + '/dist/images'));
app.use('/dist/favicon.ico', express.static(__dirname + '/dist/favicon.ico'));
app.use('/data', express.static(__dirname + '/data'));

app.use(bodyParser.json());
app.all('/api/*', function (req, res) {
  var NoteModel = require('./model/notes');
  var apiPath = req.url.split('/api/')[1];
  var mainApi = apiPath.split('/');
  var apiHandler = function apiHandler(err, noteData) {
    if (err) res.status(404).send('Not Found');
    mongoose.disconnect(function () {
      console.log('connection close!!');
    });
    res.send(noteData);
  };

  (function () {
    switch (mainApi[0]) {
      case "notes":
        var subcategory = mainApi[1];

        // For Fake Data
        fs.readFile(__dirname + '/data/note.json', 'utf8', function (err, data) {
          if (err) throw err;
          res.send(JSON.parse(data).list.filter(function (note) {
            return note.subcategory.indexOf(subcategory) > -1;
          }));
        });

        // For real data
        //mongoose.connect(dbkey);
        //NoteModel.find({subcategory: {$in: [subcategory]}}, apiHandler)

        break;
      case "note":
        var id = mainApi[1];
        var method = req.method;
        //mongoose.connect(dbkey)

        if (method === 'GET') {
          // For Fake Data
          fs.readFile(__dirname + '/data/note.json', 'utf8', function (err, data) {
            if (err) throw err;
            var note = JSON.parse(data).list.filter(function (note) {
              return note._id === id;
            })[0];
            note ? res.send(note) : res.status(404).send('Not Found');
          });

          // For real data
          //NoteModel.findById(id, apiHandler)
        } else if (method === 'PUT') {
          // For Fake Data
          fs.readFile(__dirname + '/data/note.json', 'utf8', function (err, data) {
            if (err) throw err;
            var origData = JSON.parse(data).list;
            var note = origData.filter(function (note) {
              return note._id === id;
            })[0];
            note = (0, _assign2.default)({}, note, req.body);
            fs.writeFileSync(__dirname + '/data/note.json', (0, _stringify2.default)({ "list": origData.map(function (item) {
                return item._id === id ? note : item;
              }) }));
            res.send(note);
          });

          // For real data
          //NoteModel.findByIdAndUpdate(id, {$set: req.body}, {new: true}, apiHandler)
        } else if (method === 'DELETE') {
          // For Fake Data
          fs.readFile(__dirname + '/data/note.json', 'utf8', function (err, data) {
            var origData = JSON.parse(data).list;
            var note = origData.filter(function (note) {
              return note._id === id;
            })[0];
            fs.writeFileSync(__dirname + '/data/note.json', (0, _stringify2.default)({ "list": origData.filter(function (item) {
                return item._id !== id;
              }) }));
            res.send(note);
          });

          // For real data
          //NoteModel.findByIdAndRemove(id, apiHandler)
        } else if (method === 'POST') {
          (function () {
            // For Fake Data
            var newData = (0, _assign2.default)({}, req.body, {
              _id: Date.now().toString()
            });
            fs.readFile(__dirname + '/data/note.json', 'utf8', function (err, data) {
              var origData = JSON.parse(data).list;
              origData.push(newData);
              fs.writeFileSync(__dirname + '/data/note.json', (0, _stringify2.default)({ "list": origData }));
            });
            res.send(newData);

            // For real data
            //const newPost = new NoteModel(req.body)
            //newPost.save(apiHandler)
          })();
        }
        break;
      default:
        res.send({});
    }
  })();
});
app.use(handleRender);

function handleRender(req, res) {
  if (req.url.indexOf('/api/') !== -1) return;

  var preloadedState = {
    index: {},
    notes: {},
    aboutme: {}
  };

  var store = appStoreCreate(preloadedState);

  var history = (0, _reactRouterRedux.syncHistoryWithStore)((0, _reactRouter.createMemoryHistory)(), store);

  var html = '';
  (0, _reactRouter.match)({ routes: Routes, location: req.originalUrl, history: history }, function (error, redirectLocation, renderProps) {
    if (renderProps) {
      html = (0, _server.renderToStaticMarkup)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(_reactRouter.RouterContext, renderProps)
      ));
      var finalState = store.getState();
      res.send(renderFullPage(html, finalState));
    } else {
      res.status(404).send('Not found');
    }
  });
}

function renderFullPage(html, preloadedState) {
  return '\n        <!doctype html>\n        <html lang="tw">\n          <head>\n            <meta charset="utf-8">\n            <meta name="viewport" content="width=device-width, initial-scale=1">\n            <title>CodeDesign</title>\n            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />\n            <link rel="stylesheet" type="text/css" href="/dist/assets/style.css" />\n            <link rel="icon" type="image/png" href="/dist/images/favicon.png">\n          </head>\n          <body>\n            <div id="root">' + html + '</div>\n            <script>\n              window.__PRELOADED_STATE__ = ' + (0, _stringify2.default)(preloadedState) + '\n            </script>\n            <script type="text/javascript" charset="utf8" src="/dist/assets/index.js"></script>\n          </body>\n        </html>\n    ';
}

app.listen(process.env.PORT || '3000', function () {
  console.log('listening on ' + process.env.PORT);
});
