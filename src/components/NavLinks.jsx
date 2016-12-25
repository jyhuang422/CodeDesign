import React from 'react'
import { connect } from 'react-redux'
import {navTo} from 'actions'
import classnames from 'classnames'
import { Link } from 'react-router'

const navLinks = ({page, onNavTo, btnSize}) => {
    var datas = page.pages;
    var btns = [];
    for(let data in datas) {
        if(datas.hasOwnProperty(data)) {
            let path = data === 'index' ? '/' : '/'+data;
            let classes = classnames('btn-category', (btnSize ? btnSize : ''));
            let btn = (
                <Link 
                    className={classes}
                    key={'main_'+data}
                    to={path}
                    onClick = {(e) => {
                        e.preventDefault();
                        onNavTo(data);
                    }}
                >
                {data}
                </Link>
            );
            btns.push(btn);
        }
    }
    return (
        <div style={{textAlign: 'center'}}>
            {btns}
        </div>
    ) 
}


const mapDispatchToProps = (dispatch) => {
    return {
        onNavTo: (id) => {
            dispatch(navTo(id))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        page: state.page
    }
}

const NavLinks = connect(
  mapStateToProps,
  mapDispatchToProps
)(navLinks);

export default NavLinks