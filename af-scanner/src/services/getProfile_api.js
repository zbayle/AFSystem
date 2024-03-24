import axios from 'axios';

export const getUserProfile = async (token) => {
  const response = await axios.get('http://localhost:3001/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.userProfile;
};