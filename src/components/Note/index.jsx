import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostsIfNeeded, selectSubcategory } from 'actions/noteAction'
import NoteTool from './NoteTool'
import { Link, browserHistory } from 'react-router'


const note = ({changeSubcategory, children}) => (
    <div className={styles.wrap}>
        <div className={styles.category}>
            <Link to='/notes/code' onClick={(e) => {e.preventDefault(); changeSubcategory('code')}} >Code</Link>
            <Link to='/notes/design' onClick={(e) => {e.preventDefault(); changeSubcategory('design')}}>Design</Link>
        </div>
        <div className={styles.main}>
            <NoteTool />
            {children}
        </div>
      </div>
);

const mapDispatchToProps = (dispatch) => {
    return {
        changeSubcategory: (nextSubcategory) => {
            browserHistory.push('/notes/'+nextSubcategory)
        }
    }
}


export const Note = connect(
  mapDispatchToProps
)(note);