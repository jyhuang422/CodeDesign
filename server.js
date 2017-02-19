require.extensions['.css'] = () => {
  return;
};
require('app-module-path').addPath(__dirname+'/src/');
import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { match, RouterContext, browserHistory, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const bodyParser = require('body-parser');

const appStoreCreate = require('reducers').default;
const loggerMiddleware = createLogger();
const Routes = require('components/Routes').default;
const dbkey = require('./dbkey.js').key;

const express = require('express');
const app = express();
var mongoose = require('mongoose');

app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
app.use('/dist/images', express.static(__dirname + '/dist/images'));
app.use('/dist/favicon.ico', express.static(__dirname + '/dist/favicon.ico'));
//app.use('/code.json', express.static(__dirname + '/code.json'));
//app.use('/design.json', express.static(__dirname + '/design.json'));

app.use(bodyParser.json());
app.all('/api/*', function(req, res) {
    const NoteModel = require('./model/notes')
    const apiPath = req.url.split('/api/')[1]
    const mainApi = apiPath.split('/')
    switch(mainApi[0]) {
      case "notes":
        const subcategory = mainApi[1]
        mongoose.connect(dbkey);
        NoteModel.find({subcategory: {$in: [subcategory]}}, function(err, notes) {
          if (err) throw err;
          let final = {}
          mongoose.disconnect(function() {
            console.log('connection close!!')
          })
          res.send(notes)
        });
        break;
      case "note":
        const id = mainApi[1]
        const method = req.method
        mongoose.connect(dbkey);

        if(method === 'GET') {
          NoteModel.findById(id, function(err, note) {
            if (err) res.status(404).send('Not Found');
            mongoose.disconnect(function() {
              console.log('connection close!!')
            })
            res.send(note)
          });
        } else if(method === 'PUT') {
          NoteModel.findByIdAndUpdate(id, {$set: req.body}, {new: true}, function(err, note) {
            if(err) throw err;
            mongoose.disconnect(function() {
              console.log('connection close!!')
            })
            res.send(note)
          })
        } else if(method === 'DELETE') {
          NoteModel.findByIdAndRemove(id, function(err, note) {
            if(err) throw err;
            mongoose.disconnect(function() {
              console.log('connection close!!')
            })
            res.send(note)
          })
        } else if(method === 'POST') {
          const newPost = new NoteModel(req.body)
          newPost.save(function(err, note) {
            if(err) throw err;
            mongoose.disconnect(function() {
              console.log('connection close!!')
            })
            res.send(note)
          })
        }
        break;
      default:
        res.send({})
    }
});
app.use(handleRender);


function handleRender(req, res) {
    if(req.url.indexOf('/api/') !== -1) return;

    let preloadedState = {
        index: {},
        note: {},
        aboutme: {}
    }
    
    const store = appStoreCreate(preloadedState);

    const history = syncHistoryWithStore(createMemoryHistory(), store)
    
    var html = '';
    match({ routes: Routes, location: req.originalUrl, history: history}, (error, redirectLocation, renderProps) => {
        if(renderProps) {
            html = renderToStaticMarkup(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            )
        } else {
            res.status(404).send('Not found');
        }
    });

    const finalState = store.getState();

    res.send(renderFullPage(html, finalState));
}

function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html lang="tw">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>CodeDesign</title>
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />
            <link rel="stylesheet" type="text/css" href="/dist/assets/style.css" />
            <link rel="icon" type="image/png" href="/dist/images/favicon.png">
          </head>
          <body>
            <div id="root">${html}</div>
            <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
            </script>
            <script type="text/javascript" charset="utf8" src="/dist/assets/index.js"></script>
          </body>
        </html>
    `
}

app.listen(3000, function() {
  console.log('listening on 3000');
});