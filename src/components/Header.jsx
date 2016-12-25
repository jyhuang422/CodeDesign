import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'


const HeaderRaw = ({current}) => (
  <div style={{display: current !=='index' ? 'block' : 'none'}}>
    <NavLinks btnSize="sm" />
  </div>
)

const mapStateToProps = (state) => {
    return {
        current: state.page.current
    }
}

const Header = connect(
  mapStateToProps,
)(HeaderRaw);

export default Header