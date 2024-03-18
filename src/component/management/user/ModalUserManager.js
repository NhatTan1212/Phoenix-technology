import { Modal } from 'antd';
import ContentModalAddNewUser from './ContentModalAddNewUser';
import ModalUserViewDetails from './ModalUserViewDetails';
import EditUserDetails from './EditUserDetails';

const ModalUserManager = ({ title, isActioning, width, setIsActioning, setActioningUser, actioningUser }) => {

    return (
        <Modal
            title={title}
            open={isActioning === true}
            width={width}
            onOk={() => {
                setIsActioning(false);
                // actioningUser && setActioningUser(null);
            }}
            onCancel={() => {
                setIsActioning(false);
                // actioningUser && setActioningUser(null);
            }}
            footer={null}
        >
            {actioningUser ?
                title === 'Chỉnh sửa tài khoản - ' + actioningUser.name ?
                    <EditUserDetails
                        isActioning={isActioning}
                        setIsActioning={setIsActioning}
                        setActioningUser={setActioningUser}
                        actioningUser={actioningUser}
                    ></EditUserDetails>
                    :
                    title === 'Xem chi tiết tài khoản - ' + actioningUser.name &&
                    <ModalUserViewDetails
                        actioningUser={actioningUser}
                    ></ModalUserViewDetails>
                :
                title === 'Thêm tài khoản mới' &&
                <ContentModalAddNewUser
                    setIsActioning={setIsActioning}
                ></ContentModalAddNewUser>

            }
        </Modal>
    )
}
export default ModalUserManager
