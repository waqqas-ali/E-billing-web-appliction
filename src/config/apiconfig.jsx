// apiconfing for base_url

// const config = {
//   BASE_URL: "http://192.168.1.2:8007",
// };

// export default config;

const config = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
};

export default config;


