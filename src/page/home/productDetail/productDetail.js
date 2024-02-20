import React, { useState, useEffect, useContext } from 'react';
import Context from '../../../store/Context';
import { useParams, Link } from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import {
    Breadcrumb, Layout, Menu, theme, Col, Row, Image, Button, InputNumber,
    Space, message
} from 'antd';
import axios from 'axios';
import './productDetail.scss'
import Cookies from 'js-cookie';
import { Descriptions } from 'antd';
import Instance from '../../../axiosInstance';
import ModalProductManager from '../../../component/management/ModalProductManager';
import { GetBrands, GetCategories } from '../../../callAPI/api';

const { Header, Content, Footer, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const ProductDetail = () => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const context = useContext(Context)
    const isCartChange = context.isCartChange
    const setIsCartChange = context.setIsCartChange
    const [productDetail, setProductDetail] = useState({});
    const [dataProductDetail, setDataProductDetail] = useState(null);
    const { id } = useParams(); // Lấy tham số từ URL
    const [images, setImages] = useState([]);
    const [buyQuantity, setBuyQuantity] = useState('1');
    const [messageApi, contextHolder] = message.useMessage();
    const [isViewDetailsOpened, setIsViewDetailsOpened] = useState('false');
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandDefault, setBrandDefault] = useState('')
    const [categoryDefault, setCategoryDefault] = useState('')
    const success = (text) => {
        messageApi.open({
            type: 'success',
            content: text,
        });
    };

    const formatPriceWithCommas = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        getProductDetail();
        getBrands();
        getCategories();
    }, []);
    const getProductDetail = () => {
        Instance.get(`/product-detail/${id}`)
            .then(response => {
                // console.log(response.data);
                setProductDetail(response.data);
                console.log(response.data)
                setImages(response.data.images)
                // console.log(response.data.images)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }
    const getBrands = () => {
        GetBrands().then(response => {
            // console.log(response.data.map((brand) => {
            //     return brand.name
            // }, []));
            setBrands(response);
        })
    }

    const getCategories = () => {
        GetCategories().then(response => {
            // console.log("categories: \n", response.data);
            setCategories(response);
        })
    }

    const handleAddCart = () => {

        const token = Cookies.get('token');
        const tokenGID = Cookies.get('tokenGID');
        console.log("hello", token, tokenGID, productDetail);
        const data = {
            token: token,
            product_id: productDetail.data.id,
            count: buyQuantity,
            quantity: productDetail.data.quantity //số lượng hàng còn trong kho
        }
        const dataGID = {
            tokenGID: tokenGID,
            product_id: productDetail.data.id,
            count: buyQuantity,
            quantity: productDetail.data.quantity //số lượng hàng còn trong kho
        }
        if (token !== undefined) {
            Instance.post('/addcart', data, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response);
                    success('Thêm sản phẩm vào giỏ hàng thành công.')
                    setIsCartChange(true)
                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        } else if (tokenGID !== undefined) {
            Instance.post('/addcart', dataGID, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response);
                    success('Thêm sản phẩm vào giỏ hàng thành công.')
                    setIsCartChange(true)
                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        }

    }
    const viewDetailsProduct = () => {
        setIsViewDetailsOpened(true)
        setDataProductDetail(productDetail.data)
        const getBrand = brands.find((brand) => {
            return brand.brand_id === productDetail.data.brand_id

        });
        setBrandDefault(getBrand.name)

        const getCategory = categories.find((category) => {
            return category.category_id === productDetail.data.category_id

        });
        setCategoryDefault(getCategory.name)
    }

    return (
        <Layout>
            {contextHolder}
            {isViewDetailsOpened === true ?
                <ModalProductManager
                    title={'Xem chi tiết sản phẩm - ' + productDetail.data.prod_name}
                    isActioning={isViewDetailsOpened}
                    width={800}
                    setIsActioning={setIsViewDetailsOpened}
                    actioningProduct={dataProductDetail}
                    setActioningProduct={setDataProductDetail}
                    fileList={images}
                    setFileList={setImages}
                    brandDefault={brandDefault}
                    categoryDefault={categoryDefault}
                ></ModalProductManager>
                : null
            }
            <Content
                className='w-10/12 mx-[auto]'
                style={{
                    padding: '0',
                }}>
                <Breadcrumb
                    className=''
                    style={{
                        margin: '16px 0',
                    }}>
                    <Breadcrumb.Item>
                        <Link to={'/'}>Home</Link>
                    </Breadcrumb.Item>
                    {productDetail.category && (
                        <Breadcrumb.Item>
                            <Link to={`/laptop/category=${productDetail.slug}`}>{productDetail.category}</Link>
                        </Breadcrumb.Item>
                    )}
                    {productDetail.data && (
                        <Breadcrumb.Item>{productDetail.data.prod_name}</Breadcrumb.Item>
                    )}
                </Breadcrumb>
                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer,
                    }}>
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}>
                        {productDetail.data && (
                            // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                            <h1 className='text-[24px] font-bold'>
                                {productDetail.data.prod_name}
                            </h1>
                        )}
                        <Row className='mt-[30px]'>
                            <Col span={8} className='px-[15px]'>
                                {productDetail.images && productDetail.images.length > 0 && (
                                    // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                    <Image src={productDetail.images[0].url}></Image>
                                )}

                                <Image.PreviewGroup
                                    preview={{
                                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                    }}
                                >
                                    <div className='flex justify-around'>
                                        {productDetail.images && (
                                            images.map((img) => (
                                                <Image
                                                    // className='border-0 border-red-500'
                                                    width={75}
                                                    key={img.image_id}
                                                    src={img.url}>
                                                </Image>
                                            ))
                                        )}


                                    </div>
                                </Image.PreviewGroup>
                            </Col>
                            <Col span={8} className='px-[15px] flex flex-col mt-[30px]'>
                                <span className='text-[16px]'>Giá chính hãng:
                                    <span
                                        className='line-through text-[22px] pl-[20px]'>
                                        {productDetail.data && (
                                            // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                            formatPriceWithCommas(productDetail.data.cost)

                                        )}đ
                                    </span>
                                </span>
                                <span className=' text-[16px]'>Giá khuyến mãi:
                                    <span
                                        className='font-bold text-[#c8191f] text-[38px] 
                                        pl-[20px]'>
                                        {productDetail.data && (
                                            // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                            formatPriceWithCommas(productDetail.data.price)
                                        )}đ

                                    </span>
                                </span>
                                <span className='text-[16px]'>Số lượng hiện có:
                                    <span
                                        className='text-[16px] pl-[10px]'>
                                        {productDetail.data && (
                                            // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                            formatPriceWithCommas(productDetail.data.quantity)

                                        )}
                                    </span>
                                </span>
                                <Space>
                                    {productDetail.data && (
                                        <InputNumber
                                            min={1}
                                            max={productDetail.data.quantity}
                                            value={buyQuantity}
                                            onChange={setBuyQuantity} />
                                    )}
                                </Space>
                                <button
                                    className='bg-[#c8191f] text-[18px] text-white 
                                    flex justify-center font-bold hover:text-white 
                                    hover:shadow-[0_0_6px_0_#333] mt-[10px]
                                    leading-[60px] uppercase'
                                    onClick={() => { handleAddCart() }}>
                                    Thêm vào giỏ hàng
                                </button>
                                <p className='uppercase text-[18px] text-center
                                font-bold my-[18px]'>Gọi ngay
                                    <a
                                        className='text-[#c8191f]'
                                        href="tel:0359 973 209"> 0359 973 209 </a>
                                    để giữ hàng
                                </p>
                            </Col>
                            <Col span={8} className='px-[15px]'>
                                <div className='flex justify-between'>
                                    <h3 className='text-[#000] text-[16px] my-4 font-bold'>
                                        Thông số kỹ thuật
                                    </h3>
                                    <h3 className='text-[#dd0000] text-[14px] my-4 font-bold
                                    cursor-pointer hover:underline'
                                        onClick={() => { viewDetailsProduct() }}>Xem chi tiết</h3>
                                </div>
                                <table className='tb-detail'>
                                    {productDetail.data && (
                                        <tbody>
                                            <tr className=''>
                                                <td className='whitespace-nowrap'>Tên sản phẩm</td>
                                                <td className='w-full'>{productDetail.data.prod_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Hãng</td>
                                                <td>{brands.find((brand) => {
                                                    return brand.brand_id === productDetail.data.brand_id
                                                }).name}</td>
                                            </tr>
                                            <tr>
                                                <td>Cpu</td>
                                                <td>{productDetail.data.cpu}</td>
                                            </tr>
                                            <tr>
                                                <td>Ổ cứng</td>
                                                <td>{productDetail.data.hard_drive}</td>
                                            </tr>
                                            <tr>
                                                <td>Webcam</td>
                                                <td>{productDetail.data.webcam}</td>
                                            </tr>
                                            <tr>
                                                <td>Kết nối</td>
                                                <td>{productDetail.data.connection}</td>
                                            </tr>
                                            <tr>
                                                <td>Pin</td>
                                                <td>{productDetail.data.pin}</td>
                                            </tr>
                                            <tr>
                                                <td>Hệ điều hành</td>
                                                <td>{productDetail.data.operation_system}</td>
                                            </tr>
                                        </tbody>
                                    )}

                                </table>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
};
export default ProductDetail;