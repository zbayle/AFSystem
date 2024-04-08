import React, { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Paper, Typography } from '@mui/material';
import { AuthContext } from '../Auth_comp';
import { getAllUserProfiles } from '../../services/getUserProfile_api';

import UserProfileDialog  from './userProfileDialog_comp';

function ProfilesDialog({ open, onClose }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { token } = useContext(AuthContext);
  

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  useEffect(() => {
    if (open) {
      getAllUserProfiles(token).then(data => setProfiles(data));
    }
  }, [open, token]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>User Profiles</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {profiles.map(profile => (
            <Grid item xs={12} sm={6} md={4} key={profile._id} onClick={() => handleProfileClick(profile)}>
              <Paper elevation={3}>
                <Typography variant="h6">{profile.username}</Typography>
                <Typography variant="subtitle1">{profile.email}</Typography>
                <Typography variant="subtitle2">{profile.role}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <UserProfileDialog open={profileDialogOpen} onClose={handleProfileDialogClose} _id={selectedProfile?._id} />
    </Dialog> 
  );
}
export default ProfilesDialog;