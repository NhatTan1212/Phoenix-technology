import React, { useState } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 10000,
});

function ResetNewPasswordForm() {
    const [password, setPassword] = useState('');
    const token = new URLSearchParams(window.location.search).get('token');
    const email = new URLSearchParams(window.location.search).get('email');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Gửi yêu cầu đặt lại mật khẩu mới
        // Sử dụng email: email, token: token, password: password
        try {
            const response = await instance.post('reset-new-pass', { email, token, password });
            // Xử lý phản hồi từ backend (nếu cần)
            console.log(response.data);
        } catch (error) {
            // Xử lý lỗi
            console.error(error);
        }
    };

    return (
        <div>
            <h1>New Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Mật khẩu mới
                    </label>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu mới..."
                    />
                </div>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn btn-primary" value="submit" name="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default ResetNewPasswordForm;
