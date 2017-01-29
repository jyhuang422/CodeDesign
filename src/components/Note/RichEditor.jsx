import React from 'react'
import {Editor, EditorState, ContentState, convertToRaw, RichUtils, convertFromHTML} from 'draft-js';
import { editorChange } from 'actions/noteAction'
import { connect } from 'react-redux'
import '../../../node_modules/draft-js/dist/Draft.css';
import styles from './RichEditor.css'

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = styles.styleButton;
    if (this.props.active) {
      className += ' '+styles.activeButton;
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className={styles.controls}>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className={styles.controls}>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return styles.blockquote;
    default: return null;
  }
}

class richEditor extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
    this.focus = () => this.refs.editor.focus()
  }

  onChange(editorState) {
    const { dispatch } = this.props
    dispatch(editorChange(editorState))
  }

  toggleBlockType(blockType) {
    const { editorState } = this.props
    this.onChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }

  toggleInlineStyle(inlineType) {
    const { editorState } = this.props
    this.onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineType
      )
    );
  }

  render() {
    const { editorState } = this.props

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = styles.editor + " markdown-body";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' '+styles.hidePlaceholder;
      }
    }

    return (
      <div className={styles.root}>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <section className={className} onClick={this.focus}>
            <Editor 
              blockStyleFn={getBlockStyle}
              placeholder="Please add some text ..." 
              editorState={editorState} 
              onChange={this.onChange}
              spellCheck={true}
              ref="editor"
              customStyleMap={styleMap}
            />
          </section>
      </div>
    )
  }
}

const mapStateToProps = (state = {}) => {
    const notes = state.notes
    const current = notes.selectedPost
    let initEditorState = EditorState.createEmpty()

    if(!current.editorState && notes.entities.posts && notes.entities.posts[current.id]) {
        const blocksFromHTML = convertFromHTML(notes.entities.posts[current.id].content);
        const richState = ContentState.createFromBlockArray(blocksFromHTML);
        initEditorState = EditorState.createWithContent(richState)
    } 
    
    return {
        editorState: current.editorState  || initEditorState
    }
}

const RichEditor = connect(
  mapStateToProps
)(richEditor);

export default RichEditor