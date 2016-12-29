import React from 'react'
import { connect } from 'react-redux'
import styles from './Note.css'
import classnames from 'classnames'
import { fetchPostsIfNeeded, selectSubcategory } from 'actions/noteAction'
import { Link, browserHistory } from 'react-router'


class note extends React.Component {
    constructor(props) {
        super(props)
        this.changeSubcategory = this.changeSubcategory.bind(this)
    }

    componentDidMount() {
        const { dispatch, params } = this.props
        const subcategory = (params && params.subcategory) ? params.subcategory : 'code'
        //dispatch(selectSubcategory(subcategory))
        dispatch(fetchPostsIfNeeded(subcategory))
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        console.log(this.props)
        if (nextProps.selectedSubcategory !== this.props.selectedSubcategory) {
          console.log('============ 2')
          const { dispatch, selectedSubcategory } = nextProps
          //dispatch(selectSubcategory(selectedSubcategory))
          dispatch(fetchPostsIfNeeded(selectedSubcategory))
        } else if(nextProps.params && nextProps.params.subcategory) {
            console.log('============ 1')
            const {dispatch, params} = nextProps;
            const subcategory = params.subcategory;
            if(subcategory !== this.props.selectedSubcategory) {
                dispatch(selectSubcategory(subcategory));
                //dispatch(fetchPostsIfNeeded(subcategory))
            }
        }
    }

    changeSubcategory(nextSubcategory) {
        //this.props.dispatch(selectSubcategory(nextSubcategory))
        browserHistory.push('/notes/'+nextSubcategory)
    }

    render() {
        const { posts, items, isFetching, lastUpdated } = this.props
        return (
          <div className={styles.wrap}>
            <div className={styles.category}>
                <Link to='/notes/code' onClick={(e) => {e.preventDefault(); this.changeSubcategory('code')}} >Code</Link>
                <Link to='/notes/design' onClick={(e) => {e.preventDefault(); this.changeSubcategory('design')}}>Design</Link>
            </div>
            <div className={styles.content}>
                {isFetching && items.length === 0 &&
                  <h2>Loading...</h2>
                }
                <p className={styles.timestamp}> 
                    {lastUpdated &&
                      <span>
                        Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                      </span>
                    }
                </p>
                <ul className={styles.list}>
                    {items.map((id) => (
                        <a href="#" className={styles.item}>
                            <div className={styles.media}>
                                <img src={posts[id]['img']} alt="" />
                            </div>
                            <div className={styles.desc}>
                                <p className={styles.title}>{posts[id]['title']}</p>
                                <p className="">{posts[id]['content']}</p>
                            </div>
                        </a>
                    ))}
                </ul>
            </div>
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
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

const Note = connect(
  mapStateToProps,
)(note);

export default Note