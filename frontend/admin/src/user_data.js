import axios from "axios";

export const API_URL = "http://localhost:8000/api/"


export function get(url, params) {
    const config = { params: params };
    return axios.get(API_URL + url, config);
}

export function post(url, data) {
    axios.post(API_URL + url, data).then(res => console.log(res.data));
}