import axios from "axios"

export const api = axios.create({
    baseURL: 'https://adsme-back.onrender.com/',
    headers: {'X-Custom-Header': 'foobar'}
  });
  