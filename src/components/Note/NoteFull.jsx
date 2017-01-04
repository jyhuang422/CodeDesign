import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostsIfNeeded, selectSubcategory } from 'actions/noteAction'

const noteFull = ({posts, params}) => (
    <div>
        <p>{posts[params.id].title}</p>
        <p>{posts[params.id].content}</p>
    </div>
)

const mapStateToProps = (state) => {
    const notes = state.notes;
    console.log(state.notes);
    return {
        posts: notes.entities.posts
    }
}

const NoteFull = connect(
  mapStateToProps
)(noteFull);

export default NoteFull