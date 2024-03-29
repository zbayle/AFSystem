import React from 'react';
import { AuthContext } from '../Auth_comp'; // Import AuthContext

class AdminDashboard extends React.Component {
  render() {
    return (
      <AuthContext.Consumer>
        {({ user }) => {
          // Check if the user has the required permission
          if (user && user.perms && user.perms.dashBoardAccess) {
            return (
              <div>
                <h1>Admin Dashboard</h1>
                {/* Rest of your dashboard components go here */}
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
        }}
      </AuthContext.Consumer>
    );
  }
}

export default AdminDashboard;