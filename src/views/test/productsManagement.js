import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './productsManagement.scss'

function ProductsManagement() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm này chạy khi component được mount
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Get the JWT token from the cookie
            const token = Cookies.get('token');

            // Include the token in the Authorization header as "Bearer <token>"
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('http://localhost:8000/management', config);
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            window.location.href = "/auth"
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <ul className='list-product'>
                {data.map((item) => (
                    <li key={item.id}>
                        <img src={item.avatar} alt="Avatar" /> {/* Display the avatar */}
                        <h3>
                            {item.prod_name}
                        </h3>
                    </li>

                ))}
            </ul>
        </div>
    );
}

export default ProductsManagement;
