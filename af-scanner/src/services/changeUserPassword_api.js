import axios from 'axios';

const changePassword = async (userData, newPassword, token) => {
  const url = 'http://192.168.1.60:3001/api/users/changePassword';
  try {
    const response = await axios.post(url, { ...userData, newPassword }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error changing password: ${error}`);
    throw error;
  }
};

export default changePassword;