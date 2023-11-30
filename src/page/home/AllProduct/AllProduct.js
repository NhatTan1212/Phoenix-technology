import React, { useState, useEffect } from 'react';
import { HomeOutlined, LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Row, Col, Checkbox, List, Card } from 'antd';
import './AllProduct.scss';
import axios from 'axios';
import { GetProducts, GetBrands } from '../../../callAPI/api';
import renderListProduct from '../../../component/ListProducts';

const CheckboxGroup = Checkbox.Group;
function AllProduct() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [nameBrands, setNameBrands] = useState([]);
    const [checkedList, setCheckedList] = useState([]);

    useEffect(() => {
        getProducts();
        getBrands();
    }, []);

    const getProducts = () => {
        GetProducts().then((data) => {
            setProducts(data)
        })
    };

    const getBrands = () => {
        GetBrands().then(response => {
            setBrands(response);
            setNameBrands(response.map((brand) => {
                return brand.name
            }, []))
        })
    }

    const handleCheckboxChange = (e) => {
        // Handle checkbox change logic here
        console.log(e);
    };

    const handleSelectAllChange = (e) => {
        console.log(nameBrands);
        setCheckedList(e.target.checked ? nameBrands : [])
        // Handle "Select All" logic here
    };

    return (
        <div className="w-10/12 m-auto">
            <Breadcrumb
                className="bc-allproduct"
                items={[
                    {
                        href: '',
                        title: (
                            <span className="flex items-center">
                                <HomeOutlined />
                            </span>
                        ),
                    },
                    {
                        title: (
                            <span className="flex items-center">
                                <LaptopOutlined className="mr-2" /> Product Management
                            </span>
                        ),
                    },
                ]}
            />

            <Row gutter={[16, 16]}>
                {/* Col for checkboxes */}
                <Col xs={24} sm={12} md={6}>
                    <h3 className='font-bold my-4'>Hãng sản xuất</h3>
                    <div className="checkbox-section">
                        <Checkbox
                            className='w-full mb-1'
                            checked={nameBrands.length === checkedList.length}
                            onChange={(e) => handleSelectAllChange(e)}>
                            Tất cả
                        </Checkbox>
                        <CheckboxGroup
                            className=''
                            value={checkedList} onChange={(e) => handleCheckboxChange(e)}
                        >
                            <Row>
                                {nameBrands.map((brand) => (
                                    <Col span={12} className='my-1'>
                                        <Checkbox value={brand}>{brand}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </CheckboxGroup>

                    </div>
                </Col>

                {/* Col for product list */}
                <Col xs={24} sm={12} md={18}>
                    <div className="product-list-section">
                        {/* Product list goes here */}
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={products}
                            renderItem={(item) => (
                                <List.Item className='h-full'>
                                    <Card className=' w-[100%] h-[100%]'>
                                        {renderListProduct(item, brands)}

                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AllProduct;
