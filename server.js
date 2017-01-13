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
app.use('/code.json', express.static(__dirname + '/code.json'));
app.use('/design.json', express.static(__dirname + '/design.json'));

app.use(bodyParser.json());
//const NoteModel = require('./model/notes')
//mongoose.connect(dbkey);
//app.use('/favicon.ico', express.static(__dirname + '/dist/images/CodeDesign_logo.svg'));
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
        /*const fake = []
        for(let i = 0; i < 10; i++) {
          fake.push({
            _id: i+123,
            title: 'This is a title',
            content: '這乍聽之下似乎很合理：請工程師寫程式、請牙醫師看病、請設計師畫圖，各行各業的專業井水不犯河水，誰也不干涉誰，本來就是一個成熟的社會運作，所需要的基本條件。於是，以十分愛向美國看齊的台灣為例，我們從小便被灌輸著要努力向上、用功念書，將來好孝順父母、報效國家這樣的老梗觀念。然後，人們總愛說，在選科系的時候，最好要選那些會賺錢、有頭路的科系：電機、律師、醫師、經濟、企管、資管等等。而那些美術、音樂、哲學、天文等科系，還是留給那些「有個富爸爸」、從小在家裡學習彈豎琴、畫國畫、學騎馬，以後準備送出國的「假掰」氣質型白富美／高富帥好了。',
            subcategory: ['code', 'design'],
            author: 1
          })
        }
        res.send(fake);*/
        break;
      case "note":
        const id = mainApi[1]
        const method = req.method
        mongoose.connect(dbkey);

        if(method === 'GET') {
          NoteModel.findById(id, function(err, note) {
            if (err) throw err;
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
        
        /*res.send({
          _id: 123,
          title: 'This is a title',
          content: '這乍聽之下似乎很合理：請工程師寫程式、請牙醫師看病、請設計師畫圖，各行各業的專業井水不犯河水，誰也不干涉誰，本來就是一個成熟的社會運作，所需要的基本條件。於是，以十分愛向美國看齊的台灣為例，我們從小便被灌輸著要努力向上、用功念書，將來好孝順父母、報效國家這樣的老梗觀念。然後，人們總愛說，在選科系的時候，最好要選那些會賺錢、有頭路的科系：電機、律師、醫師、經濟、企管、資管等等。而那些美術、音樂、哲學、天文等科系，還是留給那些「有個富爸爸」、從小在家裡學習彈豎琴、畫國畫、學騎馬，以後準備送出國的「假掰」氣質型白富美／高富帥好了。',
          subcategory: ['code', 'design'],
          author: 1
        })*/
        break;
      default:
        res.send({})
    }
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