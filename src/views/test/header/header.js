import React, { useState } from 'react';
import '../header/header.scss';
import { Link, NavLink } from 'react-router-dom';

function Header() {

    const isLoging = localStorage.getItem('isLogin');
    const userName = localStorage.getItem('user_name');

    console.log(userName)
    return (
        <div className='header'>
            <div className="topnav">
                <NavLink to='/' activeClassName='active'>Home</NavLink>
                <NavLink to='/products/management' activeClassName='active'>Products</NavLink>
                <NavLink to='/user/management' activeClassName='active'>Users</NavLink>
                <NavLink to='/contact' activeClassName='active'>Contact</NavLink>
            </div>
            <div className='auth'>
                <>
                    {isLoging ?
                        <>
                            <Link to='/auth'>{userName}</Link>
                        </> : <>
                            <Link to='/auth'>Đăng nhập</Link>
                        </>

                    }
                </>
            </div>
        </div>
    );
}

export default Header