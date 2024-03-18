import { Modal } from 'antd';
import ContentModalAddNewCategory from './ContentModalAddNewCategory';
import EditUserDetails from '../user/EditUserDetails';
import ModalCategoryViewDetails from './ModalCategoryViewDetails';
import EditCategoryDetails from './EditCategoryDetails';

const ModalCategoryManager = ({ title, isActioning, width, setIsActioning, setActioningCategory, actioningCategory }) => {

    return (
        <Modal
            title={title}
            open={isActioning === true}
            width={width}
            onOk={() => {
                setIsActioning(false);
                // actioningCategory && setActioningCategory(null);
            }}
            onCancel={() => {
                setIsActioning(false);
                // actioningCategory && setActioningCategory(null);
            }}
            footer={null}
        >
            {actioningCategory ?
                title === 'Chỉnh sửa danh mục - ' + actioningCategory.name ?
                    <EditCategoryDetails
                        isActioning={isActioning}
                        setIsActioning={setIsActioning}
                        setActioningCategory={setActioningCategory}
                        actioningCategory={actioningCategory}
                    ></EditCategoryDetails>
                    :
                    title === 'Xem chi tiết danh mục - ' + actioningCategory.name &&
                    <ModalCategoryViewDetails
                        actioningCategory={actioningCategory}
                    ></ModalCategoryViewDetails>
                :
                title === 'Thêm danh mục mới' &&
                <ContentModalAddNewCategory
                    setIsActioning={setIsActioning}
                ></ContentModalAddNewCategory>

            }
        </Modal>
    )
}
export default ModalCategoryManager
