import axios from 'axios';
const Instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
});

export default Instance;