require.extensions['.css'] = () => {
  return;
};
require('./server.babel');
require('app-module-path').addPath(__dirname+'/src/')
import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { match, RouterContext, browserHistory, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const bodyParser = require('body-parser')

const appStoreCreate = require('reducers').default
const loggerMiddleware = createLogger();
const Routes = require('components/Routes.jsx');
//import Routes from './src/components/Routes.jsx';
//const dbkey = require('./dbkey.js').key

const express = require('express')
const app = express()
var mongoose = require('mongoose')

//Fake data
var fs = require('fs')

app.use('/dist/assets', express.static(__dirname + '/dist/assets'))
app.use('/dist/images', express.static(__dirname + '/dist/images'))
app.use('/dist/favicon.ico', express.static(__dirname + '/dist/favicon.ico'))
app.use('/data', express.static(__dirname + '/data'))

app.use(bodyParser.json());
app.all('/api/*', function(req, res) {
    const NoteModel = require('./model/notes')
    const apiPath = req.url.split('/api/')[1]
    const mainApi = apiPath.split('/')
    const apiHandler = function(err, noteData) {
      if (err) res.status(404).send('Not Found')
      mongoose.disconnect(function() {
        console.log('connection close!!')
      })
      res.send(noteData)
    }
    switch(mainApi[0]) {
      case "notes":
        const subcategory = mainApi[1]
        
        // For Fake Data
        fs.readFile(__dirname+'/data/note.json', 'utf8', function (err, data) {
          if (err) throw err;
          res.send(JSON.parse(data).list.filter(function(note) {
            return note.subcategory.indexOf(subcategory) > -1
          }));
        });
        
        // For real data
        //mongoose.connect(dbkey);
        //NoteModel.find({subcategory: {$in: [subcategory]}}, apiHandler)
        
        break;
      case "note":
        const id = mainApi[1]
        const method = req.method
        //mongoose.connect(dbkey)

        if(method === 'GET') {
          // For Fake Data
          fs.readFile(__dirname+'/data/note.json', 'utf8', function (err, data) {
            if (err) throw err
            const note = JSON.parse(data).list.filter(function(note) {
              return note._id === id
            })[0]
            note ? res.send(note) : res.status(404).send('Not Found')
          });

          // For real data
          //NoteModel.findById(id, apiHandler)
        } else if(method === 'PUT') {
           // For Fake Data
          fs.readFile(__dirname+'/data/note.json', 'utf8', function (err, data) {
            if (err) throw err
            let origData = JSON.parse(data).list
            let note = origData.filter(function(note) {
              return note._id === id
            })[0]
            note = Object.assign({}, note, req.body)
            fs.writeFileSync(__dirname+'/data/note.json', JSON.stringify({"list": origData.map(item => {
              return item._id === id ? note : item
            })}))
            res.send(note)
          });

          // For real data
          //NoteModel.findByIdAndUpdate(id, {$set: req.body}, {new: true}, apiHandler)
        } else if(method === 'DELETE') {
          // For Fake Data
          fs.readFile(__dirname+'/data/note.json', 'utf8', function (err, data) {
            let origData = JSON.parse(data).list
            let note = origData.filter(function(note) {
              return note._id === id
            })[0]
            fs.writeFileSync(__dirname+'/data/note.json', JSON.stringify({"list": origData.filter(item => {
              return item._id !== id
            })}))
            res.send(note)
          })

          // For real data
          //NoteModel.findByIdAndRemove(id, apiHandler)
        } else if(method === 'POST') {
          // For Fake Data
          let newData = Object.assign({}, req.body, {
            _id: Date.now().toString()
          })
          fs.readFile(__dirname+'/data/note.json', 'utf8', function (err, data) {
            let origData = JSON.parse(data).list
            origData.push(newData)
            fs.writeFileSync(__dirname+'/data/note.json', JSON.stringify({"list": origData}))
          })
          res.send(newData)

          // For real data
          //const newPost = new NoteModel(req.body)
          //newPost.save(apiHandler)
        }
        break;
      default:
        res.send({})
    }
});
app.use(handleRender)


function handleRender(req, res) {
    if(req.url.indexOf('/api/') !== -1) return;

    let preloadedState = {
        index: {},
        notes: {},
        aboutme: {}
    }
    
    const store = appStoreCreate(preloadedState)

    const history = syncHistoryWithStore(createMemoryHistory(), store)
    
    var html = '';
    match({ routes: Routes, location: req.originalUrl, history: history}, (error, redirectLocation, renderProps) => {
        if(renderProps) {
            html = renderToStaticMarkup(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            )
            const finalState = store.getState();
            res.send(renderFullPage(html, finalState));
        } else {
            res.status(404).send('Not found');
        }
    });
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

app.listen(process.env.PORT || '3000', function() {
  console.log('listening on ' + process.env.PORT)
});