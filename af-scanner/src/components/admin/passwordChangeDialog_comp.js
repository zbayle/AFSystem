import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, TextField } from '@mui/material';
import changePassword from '../../services/changeUserPassword_api';

function PasswordChangeDialog({ open, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Optional: Add validation here (e.g., check if passwords match)

    try {
      await changePassword(newPassword, confirmNewPassword, onClose); 
      
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