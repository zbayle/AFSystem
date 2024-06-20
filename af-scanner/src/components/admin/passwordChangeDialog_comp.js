import React, { useState, useContext } from 'react'; // Added useContext import
import { Dialog, DialogTitle, DialogContent, Button, TextField } from '@mui/material';
import {changePasswordAPI } from '../../services/changeUserPassword_api'; 
import { AuthContext } from '../../components/Auth_comp';

function PasswordChangeDialog({ open, onClose, userId }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { token } = useContext(AuthContext); // Fixed useContext usage
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      await changePasswordAPI(userId, newPassword,onClose, token);
    } catch (error) {
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