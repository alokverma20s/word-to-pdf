import axios from 'axios'
const backendUrl = process.env.REACT_APP_BACKEND_URL

const API = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const upload = (formData)=> {
    const headers={
        'Content-Type': 'multipart/form-data',
    }
    return API.post('/upload', formData, { headers });
};

export const convert = (data) => API.post('/convert', data);
