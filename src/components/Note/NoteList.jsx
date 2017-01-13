import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostsIfNeeded, selectSubcategory } from 'actions/noteAction'
import { Link, browserHistory } from 'react-router'

class noteList extends React.Component {
    constructor(props) {
        super(props)
        this.viewFull = this.viewFull.bind(this)
        this.addNewPost = this.addNewPost.bind(this)
    }

    componentDidMount() {
        const { dispatch, params } = this.props
        const subcategory = (params && params.subcategory) ? params.subcategory : 'code'
        //dispatch(selectSubcategory(subcategory))
        dispatch(fetchPostsIfNeeded(subcategory))
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps)
        //console.log(this.props)
        if (nextProps.selectedSubcategory !== this.props.selectedSubcategory) {
          //console.log('============ 2')
          const { dispatch, selectedSubcategory } = nextProps
          //dispatch(selectSubcategory(selectedSubcategory))
          dispatch(fetchPostsIfNeeded(selectedSubcategory))
        } else if(nextProps.params && nextProps.params.subcategory) {
            //console.log('============ 1')
            const {dispatch, params} = nextProps;
            const subcategory = params.subcategory;
            if(subcategory !== this.props.selectedSubcategory) {
                dispatch(selectSubcategory(subcategory));
                //dispatch(fetchPostsIfNeeded(subcategory))
            }
        }
    }

    viewFull(id) {
        browserHistory.push('/note/'+id)
    }

    addNewPost() {
        browserHistory.push('/note/')
    }

    render() {
        const { posts, items, isFetching, lastUpdated } = this.props
        return (
            <div className={styles.main}>
                {isFetching && items.length === 0 &&
                  <h2>Loading...</h2>
                }
                <Link to={'/note/'} onClick={(e)=>{e.preventDefault(); this.addNewPost()}} >
                    Add New Post
                </Link>
                <p className={styles.timestamp}> 
                    {lastUpdated &&
                      <span>
                        Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                      </span>
                    }
                </p>
                <ul className={styles.list} style={{opacity: isFetching ? '0' : '1'}}>
                    {items.map((id) => (
                        <Link to={'/note/'+id} onClick={(e)=>{e.preventDefault(); this.viewFull(id)}} className={styles.item} key={'note_'+id}>
                            <div className={styles.media}>
                                <img src={ posts[id]['img'] || '/dist/images/CodeDesign_logo.svg'} alt="" />
                            </div>
                            <div className={styles.desc}>
                                <p className={styles.title}>{posts[id]['title']}</p>
                                <p className="">{posts[id]['content']}</p>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const notes = state.notes;
    const {selectedSubcategory, postsBySubcategory} = notes;
    const {
        isFetching,
        lastUpdated,
        items
    } = postsBySubcategory[selectedSubcategory] || {
        isFetching: true,
        items: []
    }
    return {
        selectedSubcategory,
        postsBySubcategory,
        items,
        isFetching,
        lastUpdated,
        posts: notes.entities.posts
    }
}

const NoteList = connect(
  mapStateToProps
)(noteList);

export default NoteList