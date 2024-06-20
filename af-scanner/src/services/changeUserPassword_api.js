import axios from 'axios';

// Define the changePassword function with necessary parameters
const changePassword = async (newPassword, confirmNewPassword, onClose) => {
  try {
    const response = await axios.post('http://192.168.1.60:3001/api/users/changePassword', {
      newPassword,
      confirmNewPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Include other necessary headers, such as authorization tokens
      },
    });

    // Check for success status in the response
    if (response.status === 200) {
      console.log('Password successfully changed');
      onClose(); // Assuming onClose is a function to close the dialog or perform some cleanup
    } else {
      console.error('Failed to change password');
    }
  } catch (error) {
    // Handle errors (e.g., network error, server error, etc.)
    console.error('Error changing password:', error);
  }
};

export default changePassword;