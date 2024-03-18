import React, { useState, useEffect, useContext } from 'react';
import {
    Breadcrumb, Input, Button, Table, Select, Row, Col
} from 'antd';
import { GetFavoriteLaptopsByDays } from '../../../callAPI/management/apiDashBoard';
import './TableFavoriteLaptops.scss'
import Context from '../../../store/Context';

const TableFavoriteLaptops = ({ data }) => {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const [favoriteLaptopsData, setFavoriteLaptopsData] = useState([])
    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            render: (dataIndex) => {
                return <img src={dataIndex} className='max-h-[80px]'></img>
            }
        },
        {
            title: 'Tên laptop',
            dataIndex: 'prod_name'
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: 'quantity_sold',
        },
        {
            title: 'Còn trong kho',
            dataIndex: 'stock',
        },
    ];

    const deviceColumns = [
        {
            title: "Laptop bán chạy",
            render: (record, key, index) => {
                return (
                    <div>
                        <Row>
                            <Col md={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 1 }} xs={{ span: 24, offset: 0 }}>
                                <div
                                    className='w-[108px]'
                                >
                                    < img
                                        src={record.avatar}
                                        className='w-full h-auto border-[1px] border-[#e1dada]'
                                    ></img >

                                </div>
                            </Col>
                            <Col md={{ span: 17 }} sm={{ span: 17 }} xs={{ span: 24 }}>
                                <p className='font-bold text-[17px] text-[#333] max-[576px]:max-w-[250px]'>{record.prod_name}</p>
                                <p>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                <p>Số lượng đã bán: {record.quantity_sold}</p>
                                <p>Còn trong kho: {record.stock}</p>
                            </Col>

                        </Row>
                    </div>
                )
            }
        }
    ];

    const getFavoriteBrandsByDays = (days) => {
        GetFavoriteLaptopsByDays(days).then((data) => {
            console.log(data.listFavoriteLaptops);
            if (data.success) {
                setFavoriteLaptopsData(data.listFavoriteLaptops)
            }
        })
    }

    useEffect(() => {
        getFavoriteBrandsByDays(data.daysFavoriteLaptopsSelected)
    }, [data.daysFavoriteLaptopsSelected]);

    return (
        <>

            <div className='relative'>
                <Select
                    className='absolute right-2 top-2 z-10'
                    value={data.daysFavoriteLaptopsSelected || 7}
                    options={[
                        {
                            value: 7,
                            label: 'Xem theo tuần'
                        },
                        {
                            value: 30,
                            label: 'Xem theo tháng'
                        },
                        {
                            value: 365,
                            label: 'Xem theo năm'
                        },
                    ]}
                    onChange={(e) => {
                        data.setDaysFavoriteLaptopsSelected(e)
                    }}
                ></Select>
                <h3 className='font-bold text-[15px] pl-4 p-3 bg-white '>Laptop bán chạy </h3>
                <Table
                    pagination={{ defaultPageSize: 5 }}
                    className='table-favorite-product'
                    columns={isHiddenAutoCpl ? columns : deviceColumns}
                    dataSource={favoriteLaptopsData}>
                </Table>
            </div>
        </>
    );
};
export default TableFavoriteLaptops;