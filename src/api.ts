import axios from "axios"

export const api = axios.create({
    baseURL: 'http://185.38.84.38/',
    headers: {'X-Custom-Header': 'foobar'}
  });
  