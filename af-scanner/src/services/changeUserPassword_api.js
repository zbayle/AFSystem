import axios from 'axios';

// Change Password
export async function changePasswordAPI(userId, newPassword, onClose, token) {
  // Basic validation
  console.log('Token before validation:', token);
  if (!userId || !newPassword || !token) {
    console.error('Missing required parameters.');
    return;
  }

  let data = JSON.stringify({
    userId,
    newPassword
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    // Use a base URL from configuration or environment variable
    url: `http://192.168.1.60:3001/api/users/changePassword`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    // Check for specific success indicators in response.data if applicable
    if (response.status === 200) {
      console.log(`Password successfully changed for user ID: ${userId}`);
      if (onClose && typeof onClose === 'function') {
        onClose(); // Ensure onClose is a function before calling
      }
    } else {
      console.error(`Failed to change password for user ID: ${userId}. Status Code: ${response.status}`);
    }
  } catch (error) {
    // Log more details about the error
    console.error(`Error changing password for user ID: ${userId}. Error: ${error.message}`);
  }
}