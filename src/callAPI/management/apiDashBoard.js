import Instance from '../../axiosInstance';

const GetOrderSuccessByDays = (days) => {
    return Instance.get(`/order-success-by-date/${days}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetOrderSuccessByDays: ' + err);
            return Promise.reject(err);
        });
};

const GetNewOrderByDays = (days) => {
    return Instance.get(`/new-order-by-date/${days}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetOrderSuccessByDays: ' + err);
            return Promise.reject(err);
        });
};

const GetNewUserByDays = (days) => {
    return Instance.get(`/new-user-by-date/${days}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetUserSuccessByDays: ' + err);
            return Promise.reject(err);
        });
};

const GetFavoriteBrandsByDays = (days) => {
    return Instance.get(`/favorite-brands/${days}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetFavoriteBrandsByDays: ' + err);
            return Promise.reject(err);
        });
};

const GetFavoriteLaptopsByDays = (days) => {
    return Instance.get(`/favorite-laptops/${days}`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('Loi call api GetFavoriteLaptopsByDays: ' + err);
            return Promise.reject(err);
        });
};

export { GetOrderSuccessByDays, GetNewOrderByDays, GetNewUserByDays, GetFavoriteBrandsByDays, GetFavoriteLaptopsByDays }