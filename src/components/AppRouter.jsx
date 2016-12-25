import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory, createMemoryHistory } from 'react-router'
import App from 'components/App'
import store from 'reducers'
import { syncHistoryWithStore } from 'react-router-redux'

const history = syncHistoryWithStore(createMemoryHistory(), store)

const routes = (
    <Route path="/">
        <IndexRoute component={App} />
        <Route path="/aboutme" component={App} />
    </Route>
)

const AppRouter = () => (
  <Router history={history}>
    {routes}
  </Router>
)

export default AppRouter