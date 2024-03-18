import { Modal } from 'antd';
import ContentModalAddNewCategory from '../category/ContentModalAddNewCategory';
import ModalBrandViewDetails from './ModalBrandViewDetails';
import EditBrandDetails from './EditBrandDetails';
import ContentModalAddNewBrand from './ContentModalAddNewBrand';

const ModalBrandManager = ({ title, isActioning, width, setIsActioning, setActioningBrand, actioningBrand }) => {

    return (
        <Modal
            title={title}
            open={isActioning === true}
            width={width}
            onOk={() => {
                setIsActioning(false);
                // actioningBrand && setActioningBrand(null);
            }}
            onCancel={() => {
                setIsActioning(false);
                // actioningBrand && setActioningBrand(null);
            }}
            footer={null}
        >
            {actioningBrand ?
                title === 'Chỉnh sửa thương hiệu - ' + actioningBrand.name ?
                    <EditBrandDetails
                        isActioning={isActioning}
                        setIsActioning={setIsActioning}
                        setActioningBrand={setActioningBrand}
                        actioningBrand={actioningBrand}
                    ></EditBrandDetails>
                    :
                    title === 'Xem chi tiết thương hiệu - ' + actioningBrand.name &&
                    <ModalBrandViewDetails
                        actioningBrand={actioningBrand}
                    ></ModalBrandViewDetails>
                :
                title === 'Thêm thương hiệu mới' &&
                <ContentModalAddNewBrand
                    setIsActioning={setIsActioning}
                ></ContentModalAddNewBrand>

            }
        </Modal>
    )
}
export default ModalBrandManager
