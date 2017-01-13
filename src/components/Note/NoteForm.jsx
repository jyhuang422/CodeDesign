import React from 'react'
//import { Field, reduxForm } from 'redux-form';
import { Field, Form, actions } from 'react-redux-form';
import { connect } from 'react-redux'
import styles from './NoteForm.css'

let noteForm = ({post, noteModel, current}) => (
    <form style={{display: current.isEditing ? 'block' : 'none'}}>
        <Field model="noteModel.title">
            <input className={styles.title} 
                   type="text" 
                   placeholder="Please add the title"
                   value={typeof(current.updatedTitle) === 'string' ? current.updatedTitle : post.title} 
            />
        </Field>
        <Field model="noteModel.content">
            <textarea className={styles.content}
                      placeholder="Please write some content"
                      value={ typeof(current.updatedContent) === 'string' ? current.updatedContent : post.content } 
            />
        </Field>
    </form>
)

const mapStateToProps = (state = {}) => {
    const notes = state.notes
    const current = notes.selectedPost
    const posts = notes.entities.posts
    return {
        post: posts && posts[current.id] || {},
        noteModel: state.noteModel,
        current
    }
}

// Decorate the form component
/*const NoteForm = reduxForm({
  form: 'note' // a unique name for this form
})(noteForm);*/

const test = state => ({
    initialValues: {title: '123', content: '33443'} // pull initial values from account reducer
})

const NoteForm = connect(
  /*state => ({
    initialValues: {title: 'title', content: 'content'} // pull initial values from account reducer
  }),*/
  mapStateToProps
)(noteForm);

export default NoteForm;
