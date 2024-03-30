import axios from "axios"

export const api = axios.create({
  baseURL: 'http://185.38.84.38/',
    // baseURL: 'https://adsme-back.onrender.com',
    headers: {'X-Custom-Header': 'foobar'}
  });
  