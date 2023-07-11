import axios from 'axios';

export const http = ({ url, method, data }) => {
  const token = localStorage.getItem('tokenMC');
  return axios({
    url,
    method,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  });
};

export default {};
