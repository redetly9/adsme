import axios from "axios"

export const api = axios.create({
  baseURL: 'https://adsme-proxy.vercel.app/',
  headers: {'X-Custom-Header': 'foobar'}
});
