// storageUtils.js

// Функция для получения значения cookie по имени
export const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  };
  
  // Функция для получения значения из localStorage или cookies
  export const getUser = () => {
    return localStorage.user || getCookie('user');
  };
  
  export const getToken = () => {
    return localStorage.token || getCookie('token');
  };
  
  export const getPhone = () => {
    return localStorage.phone || getCookie('phone');
  };
  
  // Другие утилитарные функции могут быть добавлены здесь