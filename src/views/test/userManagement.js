import React from "react";

class UserManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    id: 1,
                    name: "Nhật Tân",
                    email: "honhattan121@gmail.com",
                    isOnline: true
                },
                {
                    id: 2,
                    name: "User2",
                    email: "user2@gmail.com",
                    isOnline: true
                },
                {
                    id: 3,
                    name: "User3",
                    email: "user3@gmail.com",
                    isOnline: false
                },
            ]
        };
    }


    render() {
        return (
            <div>
                <h1>Quản lý người dùng</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Mã số khách hàng</th>
                            <th>Tên khách hàng</th>
                            <th>email</th>
                            <th>trạng thái đăng nhập</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((value, index) => {
                                return <tr key={value.id}>
                                    <td>
                                        {value.id}
                                    </td>
                                    <td>
                                        {value.name}
                                    </td>
                                    <td>
                                        {value.email}
                                    </td>

                                    <>
                                        {value.isOnline ?
                                            <td>
                                                online
                                            </td>
                                            :
                                            <td>
                                                offline
                                            </td>
                                        }

                                    </>


                                </tr>


                            })
                        }
                    </tbody>
                </table>

            </div>
        )
    }
}

export default UserManagement 