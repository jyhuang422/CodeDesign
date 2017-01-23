import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostIfNeeded, editPost, updatePostIfNeeded, selectPost, addNewPost, createPost, deletePost } from 'actions/noteAction'
import Noteform from './NoteForm'
import { browserHistory } from 'react-router'

class noteFull extends React.Component {
    constructor(props) {
        super(props)
        this.editPost = this.editPost.bind(this)
        this.updatePost = this.updatePost.bind(this)
        this.createPost = this.createPost.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount() {
        const { dispatch, params } = this.props
        const id = (params && params.id) ? params.id : null
        if(id) {
            dispatch(selectPost(id))
        } else {
            dispatch(addNewPost())
        }
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, params, current, selectedSubcategory, post } = nextProps
        if(params.id && !current.id) {
            dispatch(selectPost(params.id))
            delete params.id
        }
        else if(current.isDeleted) browserHistory.replace(`/notes/${selectedSubcategory}`)
        else if(current.isCreated && !params.id) browserHistory.replace(`/note/${current.id}`)
        else if(current.id) dispatch(fetchPostIfNeeded(current.id))
        else if(!current.isNewPost) dispatch(addNewPost())
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

    deletePost(id) {
        const { dispatch, post } = this.props
        dispatch(deletePost(id, post.subcategory))
    }

    render() {
        const { post, params, current }  = this.props
        const id = current.id
        return (
            <div>
                {current.isNewPost &&
                    <a href="#" onClick={(e)=>{e.preventDefault(); this.createPost(id)}}>Create</a>
                }
                {!current.isNewPost && 
                    <div>
                        {current.isEditing ? <a href="#" onClick={(e)=>{e.preventDefault(); this.updatePost(id)}}>Save</a>
                                           : <a href="#" onClick={(e)=>{e.preventDefault(); this.editPost(id)}}>Edit</a>
                        }
                        <a href="#" onClick={(e)=>{e.preventDefault(); this.deletePost(id)}}>Delete</a>
                    </div>
                }
                { post && 
                    <div>
                        {post.img && 
                            <div style={{textAlign: 'center'}}>
                                <img src={ post.img } alt="" />
                            </div>
                        }
                        <article className={styles.article} style={{display: current.isEditing ? 'none': 'block'}}>
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
    const selectedSubcategory = notes.selectedSubcategory
    return {
        current,
        post: posts && posts[current.id] || null,
        selectedSubcategory
    }
}

const NoteFull = connect(
  mapStateToProps
)(noteFull);

export default NoteFull