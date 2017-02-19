import React from 'react'
import { connect } from 'react-redux'
import styles from './main.css'
import NavLinks from 'components/NavLinks'

const IndexRaw = ({current}) => (
  <div>
      <div style={{display: current ==='/' ? 'block' : 'none'}}>
        <div className={styles.logo}><img src="/dist/images/CodeDesign_logo_index.svg" /></div>
        <NavLinks btnSize="lg" />
      </div>
  </div>
)

const mapStateToProps = (state, ownProps) => {
    const current = ownProps.location ? ownProps.location.pathname : '/';
    return {
        current: current
    }
}

const Index = connect(
  mapStateToProps,
)(IndexRaw);

export default Index