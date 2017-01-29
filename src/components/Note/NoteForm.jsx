import React from 'react'
//import { Field, reduxForm } from 'redux-form';
import { Field, Form, actions } from 'react-redux-form';
import { createPost, editorChange } from 'actions/noteAction'
import {EditorState, convertToRaw, RichUtils} from 'draft-js';
import RichEditor from './RichEditor'
import { connect } from 'react-redux'
import styles from './NoteForm.css'
import draftToHtml from 'draftjs-to-html';


class noteForm extends React.Component {
  constructor(props) {
    super(props)
    this.createPost = this.createPost.bind(this)
  }

  createPost(current) {
    const { dispatch, editorState } = this.props
    current.updatedContent = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    dispatch(createPost(current))
  }

  render() {
    const {post, noteModel, current} = this.props
    return (
      <form style={{display: current.isEditing ? 'block' : 'none'}}>
          <Field model="noteModel.title">
              <input className={styles.title} 
                     type="text" 
                     placeholder="Please add the title"
                     value={typeof(current.updatedTitle) === 'string' ? current.updatedTitle : post.title} 
              />
          </Field>
          <RichEditor content={post.content || ""} />
          {current.isNewPost && 
          <a className={styles.create} href="#" onClick={(e)=>{e.preventDefault(); this.createPost(current)}}>Create</a>
          }
      </form>
    )
  }
}

const mapStateToProps = (state = {}) => {
    const notes = state.notes
    const current = notes.selectedPost
    const posts = notes.entities.posts
    return {
        post: posts && posts[current.id] || {},
        noteModel: state.noteModel,
        current,
        editorState: current.editorState
    }
}

const NoteForm = connect(
  mapStateToProps
  //mapDispatchToProps
)(noteForm);

export default NoteForm;
