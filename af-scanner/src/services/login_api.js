// api.js
import axios from 'axios';


//Login form
export async function loginUser(username, password) {
  let data = JSON.stringify({
    username,
    password
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://192.168.1.60:3001/api/users/login',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  const response = await axios.request(config);
  return response.data;
}


//Fob Login
export async function fobLogin(fobKey) {
  let data = JSON.stringify({
    fob: fobKey
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://192.168.1.60:3001/api/users/foblogin',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  const response = await axios.request(config);
  return response.data;
}