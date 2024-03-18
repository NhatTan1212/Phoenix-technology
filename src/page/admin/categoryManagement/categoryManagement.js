import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { HomeOutlined, BarsOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Input, Button, Table, Modal
} from 'antd';
import { GetCategories, DeleteCategory } from '../../../callAPI/api';
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import ModalCategoryManager from '../../../component/management/category/ModalCategoryManager';

const CategoryManagement = () => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isOpenedModalAddNew, setIsOpenedModalAddNew] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [isListCategoriesChanged, setIsListCategoriesChanged] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'category_id',
            width: '10%',
            sorter: (record1, record2) => { return record1.id - record2.id }
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            width: '30%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sortDirections: ["descend", "ascend"],
            responsive: ["lg"]
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: `${isHiddenAutoCpl ? '150px' : '10%'}`,
            render: (text, record) => {
                return (<div className='flex flex-col h-auto'>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2'
                        onClick={(e) => {
                            viewDetailsCategory(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Xem chi tiết' : <FontAwesomeIcon className='min-w-[60px]' icon={faEye} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'
                        onClick={(e) => {
                            updateCategory(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Chỉnh sửa' : <FontAwesomeIcon icon={faPenToSquare} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'
                        onClick={(e) => {
                            setCategoryIdToDelete(record.category_id)
                            setShowDeleteConfirmation(true)
                        }}>
                        {!isScreenSmaller1280 ? 'Xóa' : <FontAwesomeIcon icon={faTrash} />}
                    </button>
                </div>)
            }
        },
    ];

    useEffect(() => {
        getCategories();
    }, [isEditing, searchText, isListCategoriesChanged, isOpenedModalAddNew]);

    useEffect(() => {
        filterCategories();
    }, [searchText, categories]);

    const getCategories = () => {
        GetCategories().then((data) => {
            setCategories(data)
        })
    };

    const filterCategories = () => {
        const filteredCategories = categories.filter((category) => {
            const categoryId = category.category_id + '';
            const categoryName = category.name.toLowerCase();
            const categoryDescription = category.description.toLowerCase();
            return categoryName.includes(searchText.toLowerCase()) ||
                categoryId.includes(searchText) ||
                categoryDescription.includes(searchText.toLowerCase());
        });
        setFilteredCategories(filteredCategories);
    }

    const updateCategory = (category) => {
        setIsEditing(true)
        setEditingCategory(category)
    }

    const viewDetailsCategory = (category) => {
        setIsViewing(true)
        setEditingCategory(category)
    }

    const addNewCategory = () => {
        setIsOpenedModalAddNew(true)
    }

    const handleDeleteCategory = (categoryId) => {
        const requestData = {
            token: token,
            category_id: categoryId,
        };

        DeleteCategory(requestData).then(response => {
            if (response.success) {
                setIsListCategoriesChanged(!isListCategoriesChanged)
                context.Message("success", "Xóa danh mục thành công.")

            }
        })
    }

    const handleChangeInputSearch = (e) => {
        setSearchText(e.target.value)

    }


    return (
        <div className='flex-1'>
            <Modal
                title={"Xác nhận xóa danh mục"}
                width={500}
                open={showDeleteConfirmation}
                footer={
                    <div>
                        <Button
                            onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#e5101d] text-white' id='confirm-delete-category'
                            onClick={() => {
                                handleDeleteCategory(categoryIdToDelete);
                                setShowDeleteConfirmation(false);
                            }}>
                            OK
                        </Button>
                    </div>
                }
                onCancel={() => setShowDeleteConfirmation(false)}
                className='model-cart'
            >
                <p>Bạn có chắc chắn muốn xóa danh mục khỏi hệ thống?</p>
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
                                <BarsOutlined className='mr-2' /> Category Management
                            </span>,
                        },
                    ]}
                />
                <div className={`flex justify-between bg-white items-center  ${isHiddenAutoCpl ? 'p-4' : 'flex-col-reverse p-0'}`}>

                    <Input.Search
                        allowClear
                        className={`searchPM ${isHiddenAutoCpl ? '' : 'w-full pt-2'}`}
                        placeholder='Nhập danh mục, từ khóa cần tìm kiếm,...'
                        onChange={(e) => { handleChangeInputSearch(e) }}
                        style={{ width: '45%' }}></Input.Search>
                    <Button
                        className={`btn-add-prd bg-[#c8191f] text-white ${isHiddenAutoCpl ? '' : 'w-full'}
                        h-auto`}
                        onClick={() => { addNewCategory() }}
                    >
                        <span className={`font-bold text-[18px] mr-2`}>
                            +
                        </span>
                        <span>
                            Thêm danh mục
                        </span>
                    </Button>
                </div>
                <div className='flex flex-col bg-white p-4
                mt-[20px]'>
                    <h3>Quản lý danh mục</h3>
                    <Table
                        className='table-category-management'
                        columns={columns}
                        dataSource={filteredCategories.map((categories) => ({
                            ...categories,
                            key: categories.id
                        }))}>
                    </Table>
                </div>
            </div>
            {isEditing &&
                <ModalCategoryManager
                    title={'Chỉnh sửa danh mục - ' + editingCategory.name}
                    isActioning={isEditing}
                    width={500}
                    actioningCategory={editingCategory}
                    setAcctioningCategory={setEditingCategory}
                    setIsActioning={setIsEditing}
                    searchText={searchText}
                ></ModalCategoryManager>
            }
            {isViewing &&
                <ModalCategoryManager
                    title={'Xem chi tiết danh mục - ' + editingCategory.name}
                    width={500}
                    isActioning={isViewing}
                    actioningCategory={editingCategory}
                    setAcctioningCategory={setEditingCategory}
                    setIsActioning={setIsViewing}
                ></ModalCategoryManager>
            }
            {isOpenedModalAddNew &&
                <ModalCategoryManager
                    title={'Thêm danh mục mới'}
                    isActioning={isOpenedModalAddNew}
                    width={500}
                    setIsActioning={setIsOpenedModalAddNew}
                ></ModalCategoryManager>
            }

        </div>

    );
};
export default CategoryManagement;