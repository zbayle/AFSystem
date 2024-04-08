import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryList from './inventoryList_comp';
import { AuthContext } from '../Auth_comp'; // Import AuthContext
import DialogContext from '../../utils/DialogContext';
import ProductCreate from './createProduct_comp';
import ProfilesDialog from './ProfilesDialog_comp';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { createDialogOpen, setCreateDialogOpen, profilesDialogOpen, setProfilesDialogOpen } = useContext(DialogContext);

  function handleCreateClose() {
    setCreateDialogOpen(false);
  };

  function handleProfilesClose() {
    setProfilesDialogOpen(false);
  }

  useEffect(() => {
    if (!user || !user.perms || !user.perms.dashBoardAccess) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check if the user has the required permission
  if (user && user.perms && user.perms.dashBoardAccess) {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        {createDialogOpen && <ProductCreate open={createDialogOpen} onClose={handleCreateClose} />}
        {profilesDialogOpen && <ProfilesDialog open={profilesDialogOpen} onClose={handleProfilesClose} />}

        <InventoryList/>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have the necessary permissions to view this page.</p>
      </div>
    );
  }
}

export default AdminDashboard;