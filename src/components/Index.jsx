import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'

const IndexRaw = ({current}) => (
  <div>
      <div style={{display: current ==='/' ? 'block' : 'none'}}>
        <div id="cd-logo"><img id="cd-logo-img" src="/dist/images/CodeDesign_logo.svg" /></div>
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