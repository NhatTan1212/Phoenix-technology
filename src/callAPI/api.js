// api.js
import Instance from '../axiosInstance';

const GetUsers = () => {
    return Instance.get('/users')
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetUsers: ' + err);
            return Promise.reject(err);
        });
};

const GetUsersById = (id) => {
    return Instance.get(`/profile/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetUsers: ' + err);
            return Promise.reject(err);
        });
};

const GetDeliveryAddress = (requestData) => {
    return Instance.post('/delivery-address', requestData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetDeliveryAddress: ' + err);
            return Promise.reject(err);
        });
};

const AddNewDeliveryAddress = (requestData) => {
    return Instance.post('/add-delivery-address', requestData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api AddNewDeliveryAddress: ' + err);
            return Promise.reject(err);
        });
};

const DeleteDeliveryAdress = (requestData) => {
    return Instance.post('/delete-delivery-address', requestData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api DeleteDeliveryAddress: ' + err);
            return Promise.reject(err);
        });
};

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

const AddNewBrand = (requestData) => {
    return Instance.post('/brands/addnew', requestData)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api AddNewBrand: ' + err);
            return Promise.reject(err);
        });
};



const DeleteBrand = (requestData) => {
    return Instance.post('/brands/delete', requestData)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api DeleteBrand: ' + err);
            return Promise.reject(err);
        });
};

const EditBrand = (requestData) => {
    return Instance.post('/brands/edit', requestData)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api EditBrand: ' + err);
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
    return Instance.get(`/laptops?${query}`)//oke
        .then((res) => res.data)
        .catch(error => {
            // Handle errors here
            console.error('Loi call api GetProductByQuery:', error);
        });
}

const AddNewUser = (formData) => {
    console.log(formData)

    return Instance.post('/newuser', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api AddNewUser:', error);
        });
}

const DeleteUser = (requestData) => {
    return Instance.post('/deleteuser', requestData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api DeleteUser:', error);
        });
}

const EditUser = (formData) => {
    console.log(formData)
    return Instance.post('/edituser', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditUser:', error);
        });
}

const EditUserInfoById = (formData) => {
    return Instance.post('/edituserinfo', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditUser:', error);
        });
}

const ChangeUserPasswordById = (formData) => {
    return Instance.post('/changeuserpassword', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditUser:', error);
        });
}

const AddNewCategory = (formData) => {
    return Instance.post('/newcategory', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api AddNewCategory:', error);
        });
}

const DeleteCategory = (requestData) => {
    return Instance.post('/deletecategory', requestData, {
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api DeleteCategory:', error);
        });
}

const EditCategory = (formData) => {
    console.log(formData)
    return Instance.post('/editcategory', formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api EditCategory:', error);
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

const SignInFb = () => {
    return Instance.get('/login/federated/facebook')
        .then(response => response.data)
        .catch(error => {
            console.error('Loi call api SignInFb:', error);
        });
}

export {
    GetUsers, GetUsersById, GetDeliveryAddress, DeleteDeliveryAdress, GetProducts, GetBrands, AddNewBrand, DeleteBrand, EditBrand, GetLaptopGaming, GetProductsByQuery, EditUser, EditUserInfoById, ChangeUserPasswordById, AddNewUser, DeleteUser, GetCategories, GetImages,
    EditProduct, AddNewProduct, DeleteProduct, GetOrder, UpdateOrder, DeleteOrder, AddNewDeliveryAddress, AddNewCategory, EditCategory, DeleteCategory,
    SignInFb
};
