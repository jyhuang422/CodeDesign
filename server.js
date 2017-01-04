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

const appStoreCreate = require('reducers').default;
const loggerMiddleware = createLogger();
const Routes = require('components/Routes').default;
const dbkey = require('./dbkey.js').key;

const express = require('express');
const app = express();
var mongoose = require('mongoose');

app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
app.use('/dist/images', express.static(__dirname + '/dist/images'));
app.use('/code.json', express.static(__dirname + '/code.json'));
app.use('/design.json', express.static(__dirname + '/design.json'));

//const NoteModel = require('./model/notes')
//mongoose.connect(dbkey);
//app.use('/favicon.ico', express.static(__dirname + '/dist/images/CodeDesign_logo.svg'));
app.get('/api/*', function(req, res) {
    const NoteModel = require('./model/notes')
    const subcategory = req.url.split('/api/notes/')[1]
    mongoose.connect(dbkey);
    NoteModel.find({subcategory: {$in: [subcategory]}}, function(err, notes) {
      if (err) throw err;
      let final = {}
      notes.forEach(function(note) {
        final[note._id] = note;
      })
      mongoose.disconnect(function() {
        console.log('connection close!!')
      })
      res.send(final)
    });
});
app.use(handleRender);


/*var aNote = new NoteModel({
  id: 2,
  title: "This is a test Title",
  content: "Styles are not added on require, but instead on call to use/ref. Styles are removed from page if unuse/unref is called exactly as often as use/ref.",
  img: "/dist/images/CodeDesign_logo.svg",
  subcategory: ['code', 'design'],
  author: 1
});

aNote.save(function(err) {
  if (err) throw err;
  console.log('User created!');
});*/


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