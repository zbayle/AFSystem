import axios from 'axios';

// Change Password
export async function changePasswordAPI(userId, newPassword, onClose, token) {
  let data = JSON.stringify({
    userId,
    newPassword
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://192.168.1.60:3001/api/users/changePassword',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      console.log('Password successfully changed for user ID:', userId);
      onClose(); // Assuming onClose is a function to close the dialog or perform some cleanup
    } else {
      console.error('Failed to change password for user ID:', userId);
    }
  } catch (error) {
    console.error('Error changing password for user ID:', userId, error);
  }
}