import axios from 'axios';

// Update the function signature to include userId
const changePassword = async (userId, newPassword, onClose) => {
  try {
    const token = localStorage.getItem('userToken');
    const url = 'http://192.168.1.60:3001/api/users/changePassword';
    const body = {
      userId,
      newPassword
    };
    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      console.log('Password successfully changed');
      onClose(); // Assuming onClose is a function to close the dialog or perform some cleanup
    } else {
      console.error('Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
  }
};

export default changePassword;