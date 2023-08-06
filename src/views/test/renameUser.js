import React from "react";

class RenameUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "Nhật Tân"

            }
        };
    }


    reName = (event) => {
        this.setState({ user: { name: event.target.value } });
        console.log(event.target.value)
    }


    render() {
        return (
            <div>
                <h1>Xin chào {this.state.user.name}!</h1>
                <h3>Đổi tên người dùng</h3>
                <input
                    type="text"
                    placeholder={this.state.user.name}
                    onChange={(event) => this.reName(event)}
                ></input>
            </div>
        )
    }
}

export default RenameUser 