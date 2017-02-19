import React from 'react'
import { connect } from 'react-redux'
import {navTo} from 'actions'
import classnames from 'classnames'
import styles from './main.css'
import { Link } from 'react-router'
import {browserHistory} from 'react-router'

const navLinks = ({page, onNavTo, btnSize, style={}}) => {
    var datas = page;
    var btns = [];
    for(let data in datas) {
        if(datas.hasOwnProperty(data)) {
            let path = data === 'index' ? '/' : '/'+data;
            //let classes = classnames('btn-category', (btnSize ? btnSize : ''));
            let btn = (
                <Link
                    className={styles.nav+" "+styles[btnSize]+" "+styles[data]}
                    key={'main_'+data}
                    to={path}
                    onClick = {(e) => {
                        e.preventDefault();
                        onNavTo(path);
                    }}
                >
                {data}
                </Link>
            );
            btns.push(btn);
        }
    }
    return (
        <nav style={Object.assign({}, style, {textAlign: 'center'})}>
            {btns}
        </nav>
    ) 
}


const mapDispatchToProps = (dispatch) => {
    return {
        onNavTo: (id) => {
            browserHistory.push(id);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        page: {
            notes: state.notes,
            aboutme: state.aboutme
        }
    }
}

const NavLinks = connect(
  mapStateToProps,
  mapDispatchToProps
)(navLinks);

export default NavLinks