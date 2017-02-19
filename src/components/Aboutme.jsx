import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'

const aboutme = ({current}) => (
  <div className={styles.aboutmeMain}>
    <img src="/dist/images/learning.svg" />
    <div>Under Construction</div>
  </div>
)

const mapStateToProps = (state, ownProps) => {
    const current = ownProps.location ? ownProps.location.pathname : '/'
    return {
        current: current
    }
}

const Aboutme = connect(
  mapStateToProps,
)(aboutme);

export default Aboutme