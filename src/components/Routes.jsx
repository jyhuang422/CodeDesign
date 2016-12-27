import React from 'react'
import App from 'components/App'
import Index from 'components/Index'
import Aboutme from 'components/Aboutme'
import { Route, IndexRoute } from 'react-router'

const Routes = (
    <Route path="/" components={App}>
        <IndexRoute component={Index} />
        <Route path="aboutme" component={Aboutme} />
    </Route>
);


export default Routes 