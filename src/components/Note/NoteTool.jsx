import React from 'react'
import { connect } from 'react-redux'
import { addNewPost } from 'actions/noteAction'
import styles from './NoteTool.css'
import { Link, browserHistory } from 'react-router'

const noteTool = ({current, addNewPost}) => (
    <div className={styles.container}>
        <Link 
            className={styles.link} 
            to={'/note/'} 
            onClick={(e)=>{e.preventDefault(); addNewPost()}}
        >
            Add New Post
        </Link>
    </div>
)

const mapStateToProps = (state = {}) => {
    const notes = state.notes
    return {
        current: notes.selectedPost
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addNewPost: () => {
            dispatch(addNewPost())
            browserHistory.push('/note/')
        }
    }
}

const NoteTool = connect(
  mapStateToProps,
  mapDispatchToProps
)(noteTool);

export default NoteTool;

