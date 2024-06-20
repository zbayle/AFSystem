import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, TextField } from '@mui/material';

function PasswordChangeDialog({ open, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Optional: Add validation here (e.g., check if passwords match)

    try {
      const response = await fetch('http://192.168.1.60:3001/api/users/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other necessary headers, such as authorization tokens
        },
        body: JSON.stringify({
          newPassword: newPassword,
          // confirmNewPassword might not be needed by your API, but included if necessary
          confirmNewPassword: confirmNewPassword,
        }),
      });

      if (response.ok) {
        // Handle success
        console.log('Password successfully changed');
        onClose(); // Close the dialog
        // Optionally, reset form fields here
      } else {
        // Handle server-side validation errors or other issues
        console.error('Failed to change password');
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error('Error changing password:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            id="new-password"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="confirm-new-password"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button type="submit" color="primary">
            Change Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordChangeDialog;