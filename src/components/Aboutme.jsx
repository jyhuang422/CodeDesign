import React from 'react'
import { connect } from 'react-redux'

const aboutme = ({current}) => (
  <div style={{display: current ==='index' ? 'none' : 'block'}}>
    About me
  </div>
)

const mapStateToProps = (state) => {
    return {
        current: state.page.current
    }
}

const Aboutme = connect(
  mapStateToProps,
)(aboutme);

export default Aboutme