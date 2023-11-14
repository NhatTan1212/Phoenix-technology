import axios from 'axios';
const Instance = axios.create({
    baseURL: 'https://phoenixlt.azurewebsites.net',
    timeout: 10000,
});

export default Instance;