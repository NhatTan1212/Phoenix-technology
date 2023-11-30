// api.js
import axios from 'axios';

const GetProducts = () => {
    return axios.get('https://phoenixlt.azurewebsites.net/home')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetProduct: ' + err);
            return Promise.reject(err);
        });
};

const GetBrands = () => {
    return axios.get('https://phoenixlt.azurewebsites.net/brands-list')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetBrands: ' + err);
            return Promise.reject(err);
        });
};

export { GetProducts, GetBrands };
