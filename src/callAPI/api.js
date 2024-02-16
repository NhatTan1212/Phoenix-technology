// api.js
import Instance from '../axiosInstance';

const GetProducts = () => {
    return Instance.get('/home')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetProducts: ' + err);
            return Promise.reject(err);
        });
};

const GetImages = () => {
    return Instance.get('/list-image')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetImages: ' + err);
            return Promise.reject(err);
        });
};

const GetBrands = () => {
    return Instance.get('/brands-list')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetBrands: ' + err);
            return Promise.reject(err);
        });
};

const GetCategories = () => {
    return Instance.get('/categories-list')
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
    return Instance.get(`/laptops/${query}`)
        .then((res) => res.data)
        .catch(error => {
            // Handle errors here
            console.error('Loi call api GetProductByQuery:', error);
        });
}

const EditProduct = (formData) => {
    return Instance.post('/editproduct', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditProduct:', error);
        });
}

const AddNewProduct = (formData) => {
    return Instance.post('/newproduct', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api AddNewProduct:', error);
        });
}

const DeleteProduct = (requestData) => {
    return Instance.post('/deleteproduct', requestData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api DeleteProduct:', error);
        });
}

const GetOrder = (reqData) => {
    return Instance.post('/order-management', reqData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api GetOrder:', error);
        });
}

const UpdateOrder = (orderId, reqData) => {
    return Instance.post(`/order-management/update/${orderId}`, reqData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api UpdateOrder:', error);
        });
}

const DeleteOrder = (requestData) => {
    return Instance.post('/deleteorder', requestData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api DeleteOrder:', error);
        });
}

export {
    GetProducts, GetBrands, GetLaptopGaming, GetProductsByQuery, GetCategories, GetImages,
    EditProduct, AddNewProduct, DeleteProduct, GetOrder, UpdateOrder, DeleteOrder
};
