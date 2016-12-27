import React from 'react'
import { connect } from 'react-redux'

const aboutme = ({current}) => (
  <div>
    About me
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