import React from 'react'
import App from 'components/App'
import Index from 'components/Index'
import Aboutme from 'components/Aboutme'
import Note from 'components/Note'
import NoteList from 'components/Note/NoteList'
import NoteFull from 'components/Note/NoteFull'
import { Route, IndexRoute, Redirect } from 'react-router'

const Routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="aboutme" component={Aboutme} />
        <Route path="notes/:subcategory" component={Note}>
            <IndexRoute component={NoteList} />
        </Route>
        <Route path="note/" component={Note}>
            <IndexRoute component={NoteFull} />
            <Route path=":id" components={NoteFull} />
        </Route>
        <Redirect from="notes" to="/notes/code" />
    </Route>
);


export default Routes 