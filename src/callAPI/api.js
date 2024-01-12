// api.js
import axios from 'axios';
import Instance from '../axiosInstance';

const GetProducts = () => {
    return axios.get('http://localhost:8000/home')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetProducts: ' + err);
            return Promise.reject(err);
        });
};

const GetImages = () => {
    return axios.get('http://localhost:8000/list-image')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetImages: ' + err);
            return Promise.reject(err);
        });
};

const GetBrands = () => {
    return axios.get('http://localhost:8000/brands-list')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetBrands: ' + err);
            return Promise.reject(err);
        });
};

const GetCategories = () => {
    return axios.get('http://localhost:8000/categories-list')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetCategories: ' + err);
            return Promise.reject(err);
        });
};

const GetLaptopGaming = () => {
    return Instance.get('/laptop-gaming')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetLaptopGaming: ' + err);
            return Promise.reject(err);
        })
}

const GetProductsByQuery = (query) => {
    return axios.get(`http://localhost:8000/laptops/${query}`)
        .then((res) => res.data)
        .catch(error => {
            // Handle errors here
            console.error('Loi call api GetProductByQuery:', error);
        });
}

const EditProduct = (formData) => {
    return axios.post('http://localhost:8000/editproduct', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditProduct:', error);
        });
}

export { GetProducts, GetBrands, GetLaptopGaming, GetProductsByQuery, GetCategories, GetImages, EditProduct };
