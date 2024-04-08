import { AuthContext } from '../components/Auth_comp';

export async function getAllUserProfiles(token) { 
  try {
    const response = await fetch('http://localhost:3001/api/users/profile/allUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};