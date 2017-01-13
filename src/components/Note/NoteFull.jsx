import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostIfNeeded, editPost, updatePostIfNeeded, selectPost, addNewPost, createPost } from 'actions/noteAction'
import Noteform from './NoteForm'
import { browserHistory } from 'react-router'

class noteFull extends React.Component {
    constructor(props) {
        super(props)
        this.editPost = this.editPost.bind(this)
        this.updatePost = this.updatePost.bind(this)
        this.createPost = this.createPost.bind(this)
    }

    componentDidMount() {
        const { dispatch, params, posts } = this.props
        const id = (params && params.id) ? params.id : null
        if(id) {
            dispatch(selectPost(id))
        } else {
            dispatch(addNewPost())
        }
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, params, current } = nextProps
        if(params.id) dispatch(fetchPostIfNeeded(params.id))
        else if(current.isNewPost && current.id) browserHistory.replace(`/note/${current.id}`)
    }

    editPost(id) {
        const { dispatch } = this.props
        dispatch(editPost(id))
    }

    updatePost(id) {
        const { dispatch, current } = this.props
        dispatch(updatePostIfNeeded(id, current))
    }

    createPost(id) {
        const { dispatch, current } = this.props
        dispatch(createPost(current))
    }

    render() {
        const { post, params, current }  = this.props
        const id = current.id
        return (
            <div className={styles.main}>
                {current.isNewPost &&
                    <a href="#" onClick={(e)=>{e.preventDefault(); this.createPost(id)}}>Create</a>
                }
                {!current.isNewPost && 
                    <div>
                        {current.isEditing ? <a href="#" onClick={(e)=>{e.preventDefault(); this.updatePost(id)}}>Save</a>
                                           : <a href="#" onClick={(e)=>{e.preventDefault(); this.editPost(id)}}>Edit</a>
                        }
                        <a href="#" onClick={(e)=>{e.preventDefault()}}>Delete</a>
                    </div>
                }
                { post && 
                    <div>
                        {post.img && 
                            <div style={{textAlign: 'center'}}>
                                <img src={ post.img } alt="" />
                            </div>
                        }
                        <article style={{display: current.isEditing ? 'none': 'block'}}>
                            <h1 className={styles.title} style={{textAlign: 'center'}}>{ typeof(current.updatedTitle) === 'string' ?  current.updatedTitle : post.title }</h1>
                            { (typeof(current.updatedContent) === 'string' ? current.updatedContent : post.content).split('\n').map(function(item) {
                                return (
                                    <span className={styles.desc}>{item}<br /></span>
                                )
                            }) }
                        </article>
                    </div>
                }
                <Noteform />
            </div>
        )
    }
}

const mapStateToProps = (state = {}) => {
    const notes = state.notes
    const current = notes.selectedPost
    const posts = notes.entities.posts
    return {
        current,
        post: posts && posts[current.id] || null 
    }
}

const NoteFull = connect(
  mapStateToProps
)(noteFull);

export default NoteFull