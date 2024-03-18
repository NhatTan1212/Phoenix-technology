import React, { useState, useEffect, useContext } from 'react';
import Context from '../../../store/Context';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Breadcrumb, Layout, Menu, theme, Col, Row, Image, Button, InputNumber,
    Space, message, Tag
} from 'antd';
import axios from 'axios';
import './productDetail.scss'
import Cookies from 'js-cookie';
import { Descriptions } from 'antd';
import Instance from '../../../axiosInstance';
import ModalProductManager from '../../../component/management/product/ModalProductManager';
import { GetBrands, GetCategories } from '../../../callAPI/api';
import { faL } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom/client';

const { Header, Content, Footer, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const ProductDetail = () => {
    //Context responsive
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const param = useParams()
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate()
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
    const [isGetProductDetailSuccessfully, setIsGetProductDetailSuccessfully] = useState(false)
    const [isGetBrandSuccessfully, setIsGetBrandSuccessfully] = useState(false)
    const [showFullContent, setShowFullContent] = useState(false);

    const success = (text) => {
        messageApi.open({
            type: 'success',
            content: text,
        });
    };

    const error = (text) => {
        messageApi.open({
            type: 'error',
            content: text,
        });
    };

    const formatPriceWithCommas = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const getProductDetail = () => {
        Instance.get(`/product-detail/${id}`)
            .then(response => {
                // console.log(response.data);
                setProductDetail(response.data);
                console.log(response.data)
                setImages(response.data.images)
                setIsGetProductDetailSuccessfully(true)
                // console.log(response.data.images)
                // setProductQuantity(productDetail.data.quantity)
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
            setIsGetBrandSuccessfully(true)
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
        let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
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

    useEffect(() => {
        getProductDetail();
        getBrands();
        getCategories();
    }, [param]);
    const truncateContent = (content, maxLength) => {
        return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
    };
    useEffect(() => {
        if (isGetProductDetailSuccessfully && productDetail.data.detailed_evaluation !== 'null' && productDetail.data.detailed_evaluation) {
            const content = productDetail.data.detailed_evaluation
            const container = document.getElementById('row-detailed-evaluation')
            showFullContent === true ? container.innerHTML = content : container.innerHTML = truncateContent(content, 3500)
        }
    }, [isGetProductDetailSuccessfully, showFullContent])

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
                className='w-10/12 mx-[auto] max-[550px]:w-full'
                style={{
                    padding: '0',
                }}>
                <Breadcrumb
                    className='my-0 mx-4 max-[550px]:mx-6'
                >
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
                        className='py-0 px-6'
                        style={{

                            minHeight: 280,
                        }}>
                        {(isGetProductDetailSuccessfully && productDetail.data.prod_name) && (
                            // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                            <h1 className='md:text-[24px] font-bold sm:text-[17px]'>
                                {productDetail.data.prod_name}
                            </h1>
                        )}
                        <Row className={`mt-[30px] ${isScreenSmaller1280 ? 'block' : ''}`}>
                            <Col span={`${isScreenSmaller1280 ? '24' : '8'}`} className='px-[15px]'>
                                {(isGetProductDetailSuccessfully && productDetail.images && productDetail.images.length > 0) && (
                                    // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                    <Image src={productDetail.images[0].url}
                                        className='max-h-[500px]'></Image>
                                )}

                                <Image.PreviewGroup
                                    preview={{
                                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                    }}
                                >
                                    <div className='flex justify-around'>
                                        {(isGetProductDetailSuccessfully && productDetail.images) && (
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
                            <Col span={`${isScreenSmaller1280 ? '24' : '8'}`} className='px-[15px] flex flex-col mt-[30px]'>
                                {(isGetProductDetailSuccessfully && productDetail.data.quantity) ?
                                    <>
                                        <span className='text-[16px]'>Giá chính hãng:
                                            <span
                                                className='line-through text-[22px] pl-[20px]'>
                                                {isGetProductDetailSuccessfully && (
                                                    // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                                    formatPriceWithCommas(productDetail.data.cost)

                                                )}đ
                                            </span>
                                        </span>
                                        <span className=' text-[16px]'>Giá khuyến mãi:
                                            <span
                                                className='font-bold text-[#c8191f] text-[38px] 
                                        pl-[20px]'>
                                                {isGetProductDetailSuccessfully && (
                                                    // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                                    formatPriceWithCommas(productDetail.data.price)
                                                )}đ

                                            </span>
                                        </span>
                                        <span className='text-[16px]'>Số lượng hiện có:
                                            <span
                                                className='text-[16px] pl-[10px]'>
                                                {isGetProductDetailSuccessfully && (
                                                    // Hiển thị nội dung của component chỉ khi dữ liệu đã sẵn sàng
                                                    formatPriceWithCommas(productDetail.data.quantity)

                                                )}
                                            </span>
                                        </span>
                                        <Space>
                                            {
                                                isGetProductDetailSuccessfully && (
                                                    <InputNumber
                                                        min={1}
                                                        max={productDetail.data.quantity}
                                                        value={buyQuantity}
                                                        onChange={setBuyQuantity} />
                                                )

                                            }
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
                                    </> :
                                    <>
                                        <Tag icon={<ExclamationCircleOutlined />} color="warning"
                                            className='ant__tag--warning-pd flex m-0 bg-black '>
                                            Sản phẩm đã hết hàng
                                        </Tag>
                                        <button
                                            className='bg-[#c8191f] text-[20px] text-white 
                                    flex justify-center font-bold hover:text-white 
                                    hover:shadow-[0_0_6px_0_#333] mt-[10px] rounded-[3px]
                                    leading-[60px] '
                                            onClick={() => { navigate(`../../laptop/category=${productDetail.slug}`) }}>
                                            Khám phá các laptop khác
                                        </button>
                                        <p className='uppercase text-[18px] text-center
                                font-bold my-[18px]'>Gọi ngay
                                            <a
                                                className='text-[#c8191f]'
                                                href="tel:0359 973 209"> 0359 973 209 </a>
                                            để được tư vấn mua hàng
                                        </p>
                                    </>
                                }

                            </Col>
                            <Col span={`${isScreenSmaller1280 ? '24' : '8'}`} className='px-[15px] border-[1px] border-[#dbdbdb] whitespace-nowrap text-ellipsis overflow-hidden'>
                                <div className='flex justify-between'>
                                    <h3 className='text-[#000] text-[16px] my-4 font-bold'>
                                        Thông số kỹ thuật
                                    </h3>
                                    <h3 className='text-[#dd0000] text-[14px] my-4 font-bold
                                    cursor-pointer hover:underline'
                                        onClick={() => { viewDetailsProduct() }}>Xem cấu hình chi tiết</h3>
                                </div>
                                <table className='tb-detail'>
                                    {(isGetProductDetailSuccessfully && productDetail.data && isGetBrandSuccessfully && brands) && (
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
                                                <td>RAM</td>
                                                <td>{productDetail.data.ram}</td>
                                            </tr>
                                            <tr>
                                                <td>Ổ cứng</td>
                                                <td>{productDetail.data.hard_drive}</td>
                                            </tr>
                                            <tr>
                                                <td>Đồ họa</td>
                                                <td>{(productDetail.data.on_board !== 'null' && productDetail.data.on_board)
                                                    ? productDetail.data.on_board : productDetail.data.graphics}</td>
                                            </tr>
                                            <tr>
                                                <td>Webcam</td>
                                                <td>{productDetail.data.webcam}</td>
                                            </tr>
                                            <tr>
                                                <td>Kết nối</td>
                                                <td
                                                    className=' '
                                                >{productDetail.data.connection}</td>
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
                                    )
                                    }

                                </table>
                            </Col>
                        </Row>
                        <Row className='mt-4 border-t-[1px] pt-4 row-detailed-evaluation pb-4'>
                            {isGetProductDetailSuccessfully && (
                                <Col span={`${isScreenSmaller1280 ? '24' : '16'}`}>
                                    <div id='row-detailed-evaluation' className={(!showFullContent
                                        && productDetail.data.detailed_evaluation !== 'null'
                                        && productDetail.data.detailed_evaluation) ? 'blur-bottom' : ''}>
                                    </div>
                                    {(!showFullContent && productDetail.data.detailed_evaluation !== null && productDetail.data.detailed_evaluation !== 'null'
                                        && productDetail.data.detailed_evaluation !== '') && (
                                            <Button
                                                className='absolute bottom-0 left-[45%]'
                                                onClick={() => { setShowFullContent(true) }}>Xem thêm</Button>
                                        )}
                                </Col>
                            )}
                        </Row>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
};
export default ProductDetail;