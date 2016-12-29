import React from 'react'
import App from 'components/App'
import Index from 'components/Index'
import Aboutme from 'components/Aboutme'
import Note from 'components/Note'
import { Route, IndexRoute, Redirect } from 'react-router'

const Routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="aboutme" component={Aboutme} />
        <Route path="/notes/:subcategory" component={Note} />
        <Redirect from="notes" to="/notes/code" />
    </Route>
);


export default Routes 