import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'

const IndexRaw = ({current}) => (
  <div>
      <div style={{display: current ==='index' ? 'block' : 'none'}}>
        <div id="cd-logo"><img id="cd-logo-img" src="/dist/images/CodeDesign_logo.svg" /></div>
        <NavLinks btnSize="lg" />
      </div>
  </div>
)

const mapStateToProps = (state) => {
    return {
        current: state.page.current
    }
}

const Index = connect(
  mapStateToProps,
)(IndexRaw);

export default Index