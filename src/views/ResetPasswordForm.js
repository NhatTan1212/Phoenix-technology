import React, { useState } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 10000,
});

function ResetPasswordForm() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('Request data: ' + email)
            const response = await instance.post('recover-pass', { email });
            // Xử lý phản hồi từ backend (nếu cần)
            console.log('Response data: ' + response.data);
        } catch (error) {
            // Xử lý lỗi
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                    />
                </div>
                <button type="submit" className="btn btn-primary" value="submit" name="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordForm;