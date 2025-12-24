export const getAccessToken = () => {
    const data = JSON.parse(localStorage.getItem("eBilling"));
    return data?.accessToken || null;
  };
  
  export const getRefreshToken = () => {
    const data = JSON.parse(localStorage.getItem("eBilling"));
    return data?.refreshToken || null;
  };
  
  export const setAccessToken = (token) => {
    const data = JSON.parse(localStorage.getItem("eBilling"));
    if (!data) return;
  
    data.accessToken = token;
    localStorage.setItem("eBilling", JSON.stringify(data));
  };
  
  export const clearAuth = () => {
    localStorage.removeItem("eBilling");
  };
  