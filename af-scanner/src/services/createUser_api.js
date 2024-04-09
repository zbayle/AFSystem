import axios from 'axios';

const createUser = async (userData, token) => {
  const url = 'http://localhost:3001/api/users/register';
  try {
    const response = await axios.post(url, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    throw error;
  }
};

export default createUser;