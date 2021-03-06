import React from 'react'
import { connect } from 'react-redux'
import { Router, browserHistory, hashHistory, createMemoryHistory } from 'react-router'
import appStoreCreate from 'reducers'
import { syncHistoryWithStore } from 'react-router-redux'
import Routes from 'components/Routes'


const store = appStoreCreate();
const history = syncHistoryWithStore(browserHistory, store);

const AppRouter = () => (
  <Router history={history}>{Routes}</Router>
)

export default AppRouter