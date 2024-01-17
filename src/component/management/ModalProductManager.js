import { Modal } from 'antd';
import FormProductManager from './FormProductManager';
import ModalViewDetails from './ModalViewDetails';
import ContentModalAddNewProduct from './ContentModalAddNewProduct';

const ModalProductManager = ({ title, isActioning, width, setIsActioning, setActioningProduct, actioningProduct, fileList, setFileList, brandDefault,
    categoryDefault, brands, categories, brandsSelect, categorySelect }) => {

    return (
        <Modal
            title={title}
            open={isActioning === true}
            width={width}
            onOk={() => {
                setIsActioning(false);
                actioningProduct && setActioningProduct(null);
                fileList && setFileList([])
            }}
            onCancel={() => {
                setIsActioning(false);
                actioningProduct && setActioningProduct(null);
                fileList && setFileList([])
            }}
            footer={null}
        >
            {actioningProduct ?
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
                        brandsSelect={brandsSelect}
                        categorySelect={categorySelect}
                    ></FormProductManager>
                    :
                    title === 'Xem chi tiết sản phẩm - ' + actioningProduct.prod_name &&
                    <ModalViewDetails
                        actioningProduct={actioningProduct}
                        fileList={fileList}
                        brandDefault={brandDefault}
                        categoryDefault={categoryDefault}>
                    </ModalViewDetails>
                :
                title === 'Thêm sản phẩm mới' &&
                <ContentModalAddNewProduct
                    setIsActioning={setIsActioning}
                    brands={brands}
                    categories={categories}
                    brandsSelect={brandsSelect}
                    categorySelect={categorySelect}
                    fileList={fileList}
                    setFileList={setFileList}
                ></ContentModalAddNewProduct>

            }
        </Modal>
    )
}
export default ModalProductManager
