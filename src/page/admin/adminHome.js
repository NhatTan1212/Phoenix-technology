import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    UserOutlined, BarsOutlined, LaptopOutlined, ShoppingOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { Menu, Space } from 'antd';

const AdminHome = () => {

    const handleMenu = (e) => {
        console.log(e)
    }
    return (
        <div className=''>
            <Space >
                <Menu
                    mode='inline'
                    defaultSelectedKeys={"db"}
                    onClick={(e) => { handleMenu(e) }}
                    items={[
                        {
                            label:
                                <Link to={'/management'}>Dashboards</Link>,
                            key: "db",
                            icon: <DashboardOutlined></DashboardOutlined>
                        },
                        {
                            label:
                                <Link to={'/management/user'}>User Management</Link>,
                            key: "um",
                            icon: <UserOutlined></UserOutlined>
                        },
                        {
                            label:
                                <Link to={'/management/category'}>Category Management</Link>,
                            key: "cm",
                            icon: <BarsOutlined></BarsOutlined>
                        },
                        {
                            label:
                                <Link to={'/management/product'}>Product Management</Link>,
                            key: "pm",
                            icon: <LaptopOutlined></LaptopOutlined>
                        },
                        {
                            label:
                                <Link to={'/management/order'}>Order Management</Link>,
                            key: "om",
                            icon: <ShoppingOutlined></ShoppingOutlined>
                        }
                    ]}>

                </Menu>

            </Space>
        </div>
    );
};
export default AdminHome;