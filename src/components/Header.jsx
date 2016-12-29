import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'
import { Link } from 'react-router'


const Header = ({styles}) => (
  <div className="header" style={styles}>
    <NavLinks btnSize="sm" styles={{display: 'inline-block'}} />
  </div>
)

export default Header