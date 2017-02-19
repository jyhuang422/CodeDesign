import React from 'react'
import { connect } from 'react-redux'
import styles from './NoteFull.css'
import classnames from 'classnames'
import { fetchPostIfNeeded, editPost, updatePostIfNeeded, selectPost, addNewPost, createPost, deletePost } from 'actions/noteAction'
import Noteform from './NoteForm'
import { browserHistory } from 'react-router'
import 'github-markdown-css/github-markdown.css'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

function createMarkup(content) {
  return {__html: content};
}

class noteFull extends React.Component {
    constructor(props) {
        super(props)
        this.editPost = this.editPost.bind(this)
        this.updatePost = this.updatePost.bind(this)
        //this.createPost = this.createPost.bind(this)
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
        if(current.err) return;
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
        const { dispatch, current, editorState } = this.props
        if(editorState) current.updatedContent = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        dispatch(updatePostIfNeeded(id, current))
    }

    /*createPost(id) {
        const { dispatch, current } = this.props
        dispatch(createPost(current))
    }*/

    deletePost(id) {
        const { dispatch, post } = this.props
        dispatch(deletePost(id, post.subcategory))
    }

    render() {
        const { post, params, current }  = this.props
        const id = current.id
        return (
            <div>
                {!current.isNewPost && post && 
                    <div className={styles.tool}>
                        {current.isEditing ? <a href="#" onClick={(e)=>{e.preventDefault(); this.updatePost(id)}}>Save</a>
                                           : <a href="#" onClick={(e)=>{e.preventDefault(); this.editPost(id)}}>Edit</a>
                        }
                        <a href="#" onClick={(e)=>{e.preventDefault(); this.deletePost(id)}}>Delete</a>
                    </div>
                }
                { (!post && !current.err && !current.isEditing) &&
                    <div>Loading ...</div>
                }
                { current.err &&
                    <div>No Content</div>
                }
                { post && 
                    <div className={styles.article} style={{display: current.isEditing ? 'none': 'block'}}>
                        {post.img && 
                            <div style={{textAlign: 'center'}}>
                                <img src={ post.img } alt="" />
                            </div>
                        }
                        <article className="markdown-body">
                            <h1 className={styles.title} style={{textAlign: 'center'}}>{ typeof(current.updatedTitle) === 'string' ?  current.updatedTitle : post.title }</h1>
                            <div className={styles.desc} dangerouslySetInnerHTML={createMarkup((typeof(current.updatedContent) === 'string' ? current.updatedContent : post.content))}></div>
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
        selectedSubcategory,
        editorState: current.editorState
    }
}

const NoteFull = connect(
  mapStateToProps
)(noteFull);

export default NoteFull