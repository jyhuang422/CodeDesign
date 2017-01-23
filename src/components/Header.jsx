import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'
import styles from './main.css'
import { Link } from 'react-router'


const Header = ({style}) => (
  <header className={styles.header} style={style}>
    <NavLinks btnSize="sm" style={{display: 'inline-block'}} />
  </header>
)

export default Header