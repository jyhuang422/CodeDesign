import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory, hashHistory, createMemoryHistory } from 'react-router'
import appStoreCreate from 'reducers'
import { syncHistoryWithStore } from 'react-router-redux'
import Routes from 'components/Routes'


const store = appStoreCreate();
const history = syncHistoryWithStore(browserHistory, store);

const AppRouter = () => (
  <Router history={history} routes={Routes} />
)

export default AppRouter