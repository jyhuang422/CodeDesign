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

const express = require('express');
const app = express();

app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
app.use('/dist/images', express.static(__dirname + '/dist/images'));
//app.use('/favicon.ico', express.static(__dirname + '/dist/images/CodeDesign_logo.svg'));
app.use(handleRender);


function handleRender(req, res) {
    const current = (req.path === '/' || req.path === '/index') ? '/' : req.path.split('/')[1];
    let preloadedState = {
        nav: current,
        page: {
            'index': {},
            'note': {},
            'aboutme': {}
        }
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