import React, { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, Typography, Button } from '@mui/material';
import { AuthContext } from '../Auth_comp';
import { getAllUserProfiles } from '../../services/getUserProfile_api';
import createUser from '../../services/createUser_api';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { Formik, Field, Form } from 'formik';

import UserProfileDialog  from './userProfileDialog_comp';

function ProfilesDialog({ open, onClose }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const roles = ['Admin', 'Tech', 'Developer'];

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleCreateUserClick = () => {
    setCreateUserDialogOpen(true);
  };

  const handleCreateUserDialogClose = () => {
    setCreateUserDialogOpen(false);
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
      <DialogActions>
        <Button onClick={handleCreateUserClick}>
          <HowToRegOutlinedIcon />
        </Button>
      </DialogActions>

      <UserProfileDialog open={profileDialogOpen} onClose={handleProfileDialogClose} _id={selectedProfile?._id} profileUsername={selectedProfile?.username} />

      <Dialog open={createUserDialogOpen} onClose={handleCreateUserDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ username: '', email: '', password: '', role: '', fob: ''}}
            onSubmit={(values, { setSubmitting }) => {
              createUser(values, token)
                .then(data => {
                  console.log('User created successfully:', data);
                  setSubmitting(false);
                  handleCreateUserDialogClose();
                })
                .catch(error => {
                  console.error('Error creating user:', error);
                  setSubmitting(false);
                });
            }}
          >
            <Form>
              <Field type="text" name="username" placeholder="Username" />
              <Field type="email" name="email" placeholder="Email" />
              <Field type="password" name="password" placeholder="Password" />
              <Field type="text" name="fob" placeholder="FOB" />
              <Field as="select" name="role">
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Field>
              <Button type="submit">Create User</Button>
            </Form>
          </Formik>
        </DialogContent> 
      </Dialog>
    </Dialog>
  );
}

export default ProfilesDialog;