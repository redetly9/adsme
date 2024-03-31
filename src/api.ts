import axios from "axios"

export const api = axios.create({
  baseURL: 'https://adsme-proxy-j1tg6pl3a-eyeballs-projects.vercel.app/',
  headers: {'X-Custom-Header': 'foobar'}
});
