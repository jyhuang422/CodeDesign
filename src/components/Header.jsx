import React from 'react'
import { connect } from 'react-redux'
import NavLinks from 'components/NavLinks'
import styles from './main.css'
import { Link } from 'react-router'


const Header = ({style}) => (
  <header className={styles.header} style={style}>
    <Link to="/" className={styles.headerLogo}><img src="/dist/images/CodeDesign_logo.svg" /></Link>
    <NavLinks btnSize="sm" style={{position: 'absolute', right: '20px', display: 'inline-block'}} />
  </header>
)

export default Header