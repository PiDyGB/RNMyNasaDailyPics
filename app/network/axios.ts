import axios from "axios";


const apiNasaGovClient = axios.create({
    baseURL: 'https://api.nasa.gov/'
})

apiNasaGovClient.interceptors.request.use(config => {
    if (config.method === 'get') {
        if (!config.params) {
            config.params = {};
        }
        config.params['api_key'] = 'YcqaqQFhuLhWXiR13kXxmGvoTmx0iT4NTuPNAOyd';
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export default apiNasaGovClient