import { Modal } from 'antd';
import FormProductManager from './FormProductManager';
import ModalViewDetails from './ModalViewDetails';

const ModalProductManager = ({ title, isActioning, width, setIsActioning, setActioningProduct, actioningProduct, fileList, setFileList, brandDefault,
    categoryDefault, brands, categories }) => {

    return (
        <Modal
            title={title}
            open={isActioning === true}
            width={width}
            onOk={() => {
                setIsActioning(false);
                title === 'Chỉnh sửa sản phẩm - ' + actioningProduct.prod_name && setActioningProduct(null);
            }}
            onCancel={() => {
                setIsActioning(false);
                title === 'Chỉnh sửa sản phẩm - ' + actioningProduct.prod_name && setActioningProduct(null);
            }}
            footer={null}
        >
            {
                console.log(title)}
            {
                title === 'Chỉnh sửa sản phẩm - ' + actioningProduct.prod_name ?
                    <FormProductManager
                        isActioning={isActioning}
                        setIsActioning={setIsActioning}
                        setActioningProduct={setActioningProduct}
                        actioningProduct={actioningProduct}
                        fileList={fileList}
                        setFileList={setFileList}
                        brandDefault={brandDefault}
                        categoryDefault={categoryDefault}
                        brands={brands}
                        categories={categories}
                    ></FormProductManager>
                    :
                    <ModalViewDetails
                        actioningProduct={actioningProduct}
                        fileList={fileList}
                        brandDefault={brandDefault}
                        categoryDefault={categoryDefault}>
                    </ModalViewDetails>
            }
        </Modal>
    )
}
export default ModalProductManager
