import axios from "axios"

export const api = axios.create({
    baseURL: 'https://adsme.app/',
    headers: {'X-Custom-Header': 'foobar'}
  });
  