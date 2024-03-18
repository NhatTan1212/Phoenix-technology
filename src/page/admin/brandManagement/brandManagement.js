import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { HomeOutlined, LaptopOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Input, Button, Table, Modal
} from 'antd';
import { GetBrands, DeleteBrand } from '../../../callAPI/api';
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import ModalBrandManager from '../../../component/management/brand/ModalBrandManager';

const BrandManagement = () => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const [brands, setBrands] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isOpenedModalAddNew, setIsOpenedModalAddNew] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredBrands, setFilteredBrands] = useState(brands);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState(null);
    const [isListBrandsChanged, setIsListBrandsChanged] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'brand_id',
            width: '10%',
            sorter: (record1, record2) => { return record1.brand_id - record2.brand_id }
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'name',
            width: '15%',
            sortDirections: ["descend", "ascend"],
            responsive: ["md"]
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '15%',
            render: (_, record) => (
                <div className='avatar w-[108px]'>
                    <img src={record.image} className='w-full h-auto' />
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sortDirections: ["descend", "ascend"],
            responsive: ["lg"],
            render: (_, record) => {
                return <div className=' max-h-[3em] overflow-hidden'>{record.description}</div>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '10%',
            render: (text, record) => {
                return (
                    <div className='flex flex-col h-auto min-w-[90px]'>
                        <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2'
                            onClick={(e) => {
                                viewDetailsBrand(record)
                            }}>
                            {!isScreenSmaller1280 ? 'Xem chi tiết' : <FontAwesomeIcon className='min-w-[60px]' icon={faEye} />}
                        </button>
                        <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'
                            onClick={(e) => {
                                updateBrand(record)
                            }}>
                            {!isScreenSmaller1280 ? 'Chỉnh sửa' : <FontAwesomeIcon icon={faPenToSquare} />}
                        </button>
                        <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'
                            onClick={(e) => {
                                setBrandIdToDelete(record.brand_id)
                                setShowDeleteConfirmation(true)
                            }}>
                            {!isScreenSmaller1280 ? 'Xóa' : <FontAwesomeIcon icon={faTrash} />}
                        </button>
                    </div>
                )
            }
        },
    ];

    useEffect(() => {
        getBrands();
    }, [isEditing, searchText, isListBrandsChanged, isOpenedModalAddNew]);

    useEffect(() => {
        filterBrands();
    }, [searchText, brands]);

    const getBrands = () => {
        GetBrands().then((data) => {
            setBrands(data)
        })
    };

    const filterBrands = () => {
        const filteredBrands = brands.filter((brand) => {
            const brandId = brand.brand_id + '';
            const brandName = brand.name.toLowerCase();
            return brandName.includes(searchText.toLowerCase()) ||
                brandId.includes(searchText)
        });
        setFilteredBrands(filteredBrands);
    }

    const updateBrand = (brand) => {
        setIsEditing(true)
        setEditingBrand(brand)
    }

    const viewDetailsBrand = (brand) => {
        setIsViewing(true)
        setEditingBrand(brand)
    }

    const addNewBrand = () => {
        setIsOpenedModalAddNew(true)
    }

    const handleDeleteBrand = (brandID) => {
        const requestData = {
            token: token,
            brand_id: brandID,
        };

        DeleteBrand(requestData).then(response => {
            if (response.success) {
                setIsListBrandsChanged(!isListBrandsChanged)
                context.Message("success", "Xóa thương hiệu thành công.")
            }
        })
    }

    const handleChangeInputSearch = (e) => {
        setSearchText(e.target.value)
    }

    return (
        <div className='flex-1'>
            <Modal
                title={"Xác nhận xóa thương hiệu"}
                width={500}
                open={showDeleteConfirmation}
                footer={
                    <div>
                        <Button
                            onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#e5101d] text-white'
                            onClick={() => {
                                handleDeleteBrand(brandIdToDelete);
                                setShowDeleteConfirmation(false);
                            }}>
                            OK
                        </Button>
                    </div>
                }
                onCancel={() => setShowDeleteConfirmation(false)}
                className='model-cart'
            >
                <p>Bạn có chắc chắn muốn xóa thương hiệu khỏi hệ thống?</p>
            </Modal>

            <div className='bg-[#f0f0f0] p-3'>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <span className='flex items-center'>
                                <HomeOutlined />
                            </span>,
                        },
                        {
                            title: <span className='flex items-center'>
                                <LaptopOutlined className='mr-2' /> Brand Management
                            </span>,
                        },
                    ]}
                />
                <div className={`flex justify-between bg-white items-center  ${isHiddenAutoCpl ? 'p-4' : 'flex-col-reverse p-0'}`}>

                    <Input.Search
                        allowClear
                        className={`searchPM ${isHiddenAutoCpl ? '' : 'w-full pt-2'}`}
                        placeholder='Nhập thương hiệu, từ khóa cần tìm kiếm,...'
                        onChange={(e) => { handleChangeInputSearch(e) }}
                        style={{ width: '45%' }}></Input.Search>
                    <Button
                        className={`btn-add-prd bg-[#c8191f] text-white ${isHiddenAutoCpl ? '' : 'w-full'}
                      h-auto`}
                        onClick={() => { addNewBrand() }}
                    >
                        <span className='font-bold text-[18px] mr-2'>
                            +
                        </span>
                        <span>
                            Thêm thương hiệu
                        </span>
                    </Button>
                </div>
                <div className='flex flex-col bg-white p-4
                mt-[20px]'>
                    <h3>Quản lý thương hiệu</h3>
                    <Table
                        className='table-brand-management'
                        columns={columns}
                        dataSource={filteredBrands.map((brands) => ({
                            ...brands,
                            key: brands.id
                        }))}>
                    </Table>
                </div>
            </div>
            {isEditing &&
                <ModalBrandManager
                    title={'Chỉnh sửa thương hiệu - ' + editingBrand.name}
                    isActioning={isEditing}
                    width={500}
                    actioningBrand={editingBrand}
                    setAcctioningBrand={setEditingBrand}
                    setIsActioning={setIsEditing}
                    searchText={searchText}
                ></ModalBrandManager>
            }
            {isViewing &&
                <ModalBrandManager
                    title={'Xem chi tiết thương hiệu - ' + editingBrand.name}
                    width={700}
                    isActioning={isViewing}
                    actioningBrand={editingBrand}
                    setAcctioningBrand={setEditingBrand}
                    setIsActioning={setIsViewing}
                ></ModalBrandManager>
            }
            {isOpenedModalAddNew &&
                <ModalBrandManager
                    title={'Thêm thương hiệu mới'}
                    isActioning={isOpenedModalAddNew}
                    width={500}
                    setIsActioning={setIsOpenedModalAddNew}
                ></ModalBrandManager>
            }

        </div>

    );
};
export default BrandManagement;