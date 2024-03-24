// api.js
import axios from 'axios';

export async function loginUser(username, password) {
  let data = JSON.stringify({
    username,
    password
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/api/users/login',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  const response = await axios.request(config);
  return response.data;
}