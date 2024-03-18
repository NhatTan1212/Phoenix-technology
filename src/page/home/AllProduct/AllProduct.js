import { HomeOutlined, LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Checkbox, Col, List, Pagination, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GetBrands, GetCategories, GetProductsByQuery } from '../../../callAPI/api';
import CheckBoxGroup from '../../../component/CheckBoxGroup';
import renderListProduct from '../../../component/ListProducts';
import './AllProduct.scss';
import Context from '../../../store/Context';

const CheckboxGroup = Checkbox.Group;
function AllProduct() {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const location = useLocation();
    let navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nameBrands, setNameBrands] = useState([]);
    const [brandSlugs, setBrandSlugs] = useState([]);
    const [nameCategories, setNameCategories] = useState([]);
    const [checkedListBrands, setCheckedListBrands] = useState([]);
    const [checkedListCategories, setCheckedListCategories] = useState([]);
    const { query } = useParams(); // Lấy tham số từ URL
    const [isCheckedAllBrands, setIsCheckedAllBrands] = useState(false)
    const [isCheckedAllCategories, setIsCheckedAllCategories] = useState(false)
    const [sortStatus, setSortStatus] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 1,
        limit: 1
    })
    useEffect(() => {

        setCurrentPage(pagination.currentPage)//a hiển thử đi

    }, [query])

    useEffect(() => {
        getBrands();
        getCategories();
        getProductsByQuery();
        getSortSelected();
        setCheckBoxSelected();
    }, [query]);
    const setCheckBoxSelected = () => {
        if (query === 'page=1') {
            setIsCheckedAllBrands(true)
            setIsCheckedAllCategories(true)
        } else {
            setIsCheckedAllBrands(true)
            setIsCheckedAllCategories(true)
            if (query.includes('&')) {
                let arrQuerySplit = query.split('&')
                arrQuerySplit.forEach((querySplit) => {
                    if (querySplit.includes('brand')) {
                        let brand = querySplit.split('=')[1].split(',')
                        setCheckedListBrands(brand)
                        if (!query.includes('category')) {
                            setCheckedListCategories([])
                        }
                        setIsCheckedAllBrands(false)
                    }
                    if (querySplit.includes('category')) {
                        let getCategory = querySplit.split('=')[1].split(',')
                        setCheckedListCategories(getCategory)
                        setIsCheckedAllCategories(false)
                    }
                })
            } else {
                setIsCheckedAllBrands(true)
                setIsCheckedAllCategories(true)
                if (query.includes('brand')) {
                    let brand = query.split('=')[1]
                    brand = brand.split(',')
                    setCheckedListBrands(brand)
                    setIsCheckedAllBrands(false)
                    setIsCheckedAllCategories(true)
                } else {
                    setCheckedListBrands([])
                    setIsCheckedAllBrands(true)
                }

                if (query.includes('category')) {
                    let getCategory = query.split('=')[1]
                    getCategory = getCategory.split(',')
                    setCheckedListCategories(getCategory)
                    setIsCheckedAllCategories(false)
                    setIsCheckedAllBrands(true)
                } else {
                    setCheckedListCategories([])
                    setIsCheckedAllCategories(true)
                }

            }
        }
    }

    const getSortSelected = () => {
        if (query.includes('sort=gia-thap-den-cao')) {
            setSortStatus('asc')
        } else if (query.includes('sort=gia-cao-den-thap')) {
            setSortStatus('desc')
        } else {
            setSortStatus(null)
        }
    }
    const getBrands = () => {
        GetBrands().then(response => {
            setBrands(response);
            setNameBrands(response.map((brand) => {
                return brand.name
            }, []))
            setBrandSlugs(response.map((brand) => {
                return brand.slug
            }, []))
        })
    }

    const getCategories = () => {
        GetCategories().then(response => {
            setCategories(response);
            setNameCategories(response.map((category) => {
                return category.name
            }, []))
        })
    }

    const getProductsByQuery = () => {
        GetProductsByQuery(query).then(response => {
            setProducts(response.products);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalProducts: response.totalProducts,
                limit: response.limit,
            })
            console.log('>>> Check call api:', response);
        })
    }

    const handleCheckboxChangeBrands = (e) => {
        setCheckedListBrands(e)
        let brandQuery = e.join(',')
        let categoryQuery = checkedListCategories.join(',')
        let sortQuery = query.split('sort=')[1]
        let newQuery = `/laptop/`
        if (e.length !== 0) {
            newQuery = `/laptop/brand=${brandQuery}`
        }
        if (categoryQuery !== '' && categoryQuery !== undefined) {
            newQuery += `&category=${categoryQuery}`
        }
        if (sortQuery !== '' && sortQuery !== undefined) {
            newQuery += `&sort=${sortQuery}`
        }
        navigate(newQuery.includes(`page`) ? (newQuery) : (newQuery + `&page=1`))

    };

    const handleSelectAllChangeBrands = (e) => {
        if (e.target.checked) {
            let newQuery = '/laptop/'
            let categoryQuery = checkedListCategories.join(',')
            let sortQuery = query.split('sort=')[1]
            if (categoryQuery || sortQuery) {
                if (categoryQuery) {
                    newQuery += `category=${categoryQuery.includes(`page`)
                        ? (categoryQuery.split(`&page=${currentPage}`).join('')) : categoryQuery}`
                }
                if (sortQuery) {
                    newQuery += `&sort=${sortQuery.includes(`page`)
                        ? (sortQuery.split(`&page=${currentPage}`).join('')) : sortQuery}`
                }
            }
            setCheckedListBrands([])
            navigate(newQuery.includes(`page`) ? (newQuery) : (newQuery + `&page=1`))
        } else {

        }
    };

    const handleCheckboxChangeCategories = (e) => {

        setCheckedListCategories(e)
        let categoryQuery = e.join(',')
        let brandQuery = checkedListBrands.join(',')
        let sortQuery = query.split('sort=')[1]
        let newQuery = `/laptop/`
        if (e.length !== 0) {
            newQuery = `/laptop/category=${categoryQuery}`
        }
        if (brandQuery !== '' && brandQuery !== undefined) {
            newQuery += `&brand=${brandQuery}`
        }
        if (sortQuery !== '' && sortQuery !== undefined) {
            newQuery += `&sort=${sortQuery}`
        }
        navigate(newQuery.includes(`page`) ? (newQuery) : (newQuery + `&page=1`))
    };

    const handleSelectAllChangeCategories = (e) => {
        if (e.target.checked) {
            let newQuery = '/laptop/'
            let brandQuery = checkedListBrands.join(',')
            let sortQuery = query.split('sort=')[1]
            if (brandQuery || sortQuery) {
                if (brandQuery) {
                    newQuery += `&brand=${brandQuery.includes(`page`)
                        ? (brandQuery.split(`&page=${currentPage}`).join('')) : brandQuery}`
                }
                if (sortQuery) {
                    newQuery += `&sort=${sortQuery.includes(`page`)
                        ? (sortQuery.split(`&page=${currentPage}`).join('')) : sortQuery}`
                }
            }
            setCheckedListCategories([])
            navigate(newQuery.includes(`page`) ? (newQuery) : (newQuery + `&page=1`))
        } else {

        }
    };

    const handleChangeSort = (sort) => {
        let queryNotSort = query.includes('&sort=') ? query.split('&sort=')[0] : query.split('sort=')[0];
        if (sort === 'asc') {
            if (query === queryNotSort) {
                let locationPath = location.pathname.split(`&page=${currentPage}`).join('')
                const newUrl = `${locationPath}&page=1`;
                if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                    navigate(`${newUrl}&sort=gia-thap-den-cao`)

                } else {
                    navigate(`/laptop/sort=gia-thap-den-cao&page=1`)

                }

            } else {
                if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                    let newQ = `/laptop/${queryNotSort}&sort=gia-thap-den-cao`.split(`&page=${currentPage}`).join('')

                    navigate(`${newQ}&page=1`)
                } else {
                    navigate(`/laptop/sort=gia-thap-den-cao&page=1`)

                }
            }
        } else if (sort === 'desc') {
            if (query === queryNotSort) {
                let locationPath = location.pathname.split(`&page=${currentPage}`).join('')
                const newUrl = `${locationPath}&page=1`;
                if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                    navigate(`${newUrl}&sort=gia-cao-den-thap`)

                } else {
                    navigate(`/laptop/sort=gia-cao-den-thap&page=1`)

                }

            } else {
                if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                    let newQ = `/laptop/${queryNotSort}&sort=gia-cao-den-thap`.split(`&page=${currentPage}`).join('')

                    navigate(`${newQ}&page=1`)
                } else {
                    navigate(`/laptop/sort=gia-cao-den-thap&page=1`)

                }
            }

        } else {
            console.log(query);
            console.log(queryNotSort);
            if (query.includes('sort')) {
                let newQ = `/laptop/${queryNotSort}`.split(`&page=${currentPage}`).join('')
                navigate(`${newQ}&page=1`)
            }
        }

    };

    useEffect(() => {
        getProductsByQuery();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        navigate(location.pathname.replace(/(?<=page=)\d+/, `${page}`))
    };

    return (
        <div className="allproduct-wrap-content m-auto ">
            <div className={`${isScreenSmaller430 ? 'mx-4' : 'mx-[30px]'}`}>
                <Breadcrumb
                    className="bc-allproduct"
                    items={[
                        {
                            href: '/',
                            title: (
                                <span className="flex items-center">
                                    <HomeOutlined /> Trang chủ
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="flex items-center">
                                    <LaptopOutlined className="mr-2" /> Laptop
                                </span>
                            ),
                        },
                    ]}
                />

                <Row gutter={[16, 16]}>
                    {/* Col for checkboxes */}
                    <Col xs={24} sm={24} md={24} lg={6}>
                        <CheckBoxGroup
                            tittle={'Hãng sản xuất'}
                            nameDisplay={nameBrands}
                            checkedList={checkedListBrands}
                            handleCheckboxChange={handleCheckboxChangeBrands}
                            handleSelectAllChange={handleSelectAllChangeBrands}
                            type={brands}
                            param={query}
                            isCheckedAll={isCheckedAllBrands}
                        />

                        <CheckBoxGroup

                            tittle={'Thể loại'}
                            nameDisplay={nameCategories}
                            checkedList={checkedListCategories}
                            handleCheckboxChange={handleCheckboxChangeCategories}
                            handleSelectAllChange={handleSelectAllChangeCategories}
                            type={categories}
                            isCheckedAll={isCheckedAllCategories}
                        />
                    </Col>

                    {/* Col for product list */}
                    <Col xs={24} sm={24} md={24} lg={18}>
                        <div className={`product-list-section bg-white  pt-0 ${isScreenSmaller430 ? 'p-0' : 'p-4'}`}>
                            {/* Product list goes here */}
                            <div className='flex'>
                                <span className='my-4 px-3 py-1 ml-0 pl-0 max-[430px]:pl-2 '>Ưu tiên xem:</span>
                                <span
                                    className={
                                        sortStatus === null
                                            ? ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white rounded-l-md')
                                            : ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] text-black rounded-l-md')
                                    }
                                    onClick={() => { handleChangeSort() }}
                                >
                                    Mới nhập
                                </span>
                                <span
                                    className={
                                        sortStatus === 'desc'
                                            ? ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white border-l-0')
                                            : ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] border-l-0')
                                    }
                                    onClick={() => { handleChangeSort('desc') }}
                                >
                                    Giá cao
                                </span>
                                <span
                                    className=
                                    {
                                        sortStatus === 'asc'
                                            ? 'my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white border-l-0 rounded-r-md'
                                            : 'my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] border-l-0 rounded-r-md'
                                    }
                                    onClick={() => { handleChangeSort('asc') }}
                                >
                                    Giá thấp
                                </span>
                            </div>
                            <List
                                grid={isHiddenAutoCpl ? { gutter: 16, column: 3 } : { gutter: 0, column: 2 }}
                                className=''
                                dataSource={products}
                                renderItem={(item) => (
                                    <List.Item className='h-full'>
                                        <Card className=' w-[100%] h-[100%] overflow-hidden'>
                                            {renderListProduct(item, brands)}

                                        </Card>
                                    </List.Item>
                                )}
                            />
                            <div className='flex justify-center'>
                                <Pagination
                                    onChange={(page) => { handlePageChange(page) }}
                                    current={pagination.currentPage}
                                    pageSize={pagination.limit}
                                    total={pagination.totalProducts}
                                />
                            </div>

                        </div>
                    </Col>
                </Row>

            </div>
        </div>
    );
}

export default AllProduct;
