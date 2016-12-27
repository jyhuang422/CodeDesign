import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'


const Header = ({styles}) => (
  <div style={styles}>
    <NavLinks btnSize="sm" />
  </div>
)

export default Header