require('app-module-path').addPath(__dirname+'/src/');
import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'


const cdeStore = require('reducers').cdeStore;
const AppRouter = require('components/AppRouter').default;
const loggerMiddleware = createLogger()

const express = require('express');
const app = express();


app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
app.use('/dist/images', express.static(__dirname + '/dist/images'));
//app.use('/favicon.ico', express.static(__dirname + '/dist/images/CodeDesign_logo.svg'));
app.use(handleRender);


function handleRender(req, res) {
    const current = (req.path === '/' || req.path === '/index') ? 'index' : req.path.split('/')[1];
    let preloadedState = {
        page: {
            current: current,
            pages: {
                'index': {},
                'note': {},
                'aboutme': {}
            }
        }
    }
    const store = createStore(
      cdeStore,
      preloadedState,
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
    )
    const html = renderToString(
        <Provider store={store}>
          <AppRouter />
        </Provider>
    )

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
          </head>
          <body>
            <div id="root">${html}</div>
            <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
            </script>
            <script type="text/javascript" charset="utf8" src="dist/assets/index.js"></script>
          </body>
        </html>
    `
}

app.listen(3000, function() {
  console.log('listening on 3000');
});