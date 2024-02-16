import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetail from './page/home/productDetail/productDetail';
import Auth from './page/auth/auth';
import SignUp from './page/auth/SignUp';
import Confirm from './page/auth/confirm';
import ResetPassword from './page/auth/ResetPassword';
import UpdatePassword from './page/auth/UpdatePassword';
import Home from './page/home/home';
import AdminHome from './page/admin/adminHome';
import ProductManagement from './page/admin/productManagement';
// import Nghich from './page/nghich';
import './App.scss'
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import Cart from './page/home/cart/cart';
import Order from './page/home/order/order';
import OrderDetail from './page/home/order/orderDetail';
import OrderManagement from './page/admin/orderManagement/orderManagement';
import AllProduct from './page/home/AllProduct/AllProduct';



function AppRoutes() {
    useEffect(() => {
        let token = Cookies.get('token')
        let tokenGID = Cookies.get('tokenGID')
        console.log(token)
        if (token || tokenGID) { }
        else {
            const guestId = uuidv4();
            Cookies.set('tokenGID', guestId, { expires: 31 })
            console.log(guestId)
        }
    }, [])
    return (
        <>
            <Routes>
                {/*---Home---*/}
                <Route path="" element={<><Home /></>} />
                <Route path="/laptop/:query" element={<><AllProduct /></>} />
                <Route path="/product-detail/:id" element={<><ProductDetail /></>} />
                <Route path="/password/reset" element={<ResetPassword />} />
                <Route path="/password/update/:email" element={<UpdatePassword />} />
                <Route path="/auth" element={<><Auth /></>} />
                <Route path="/auth/signup" element={<><SignUp /></>} />
                <Route path="/auth/confirm" element={<><Confirm /></>} />
                <Route path="/cart" element={<><Cart /></>} />
                <Route path="/order" element={<><Order /></>} />
                <Route path="/order-detail/:id" element={<><OrderDetail /></>} />
                {/*---Management---*/}
                <Route path="/management" element={<><AdminHome /></>} />
            </Routes>
        </>
    );
}

export default AppRoutes;