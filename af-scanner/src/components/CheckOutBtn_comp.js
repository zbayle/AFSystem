import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth_comp'; // Import AuthContext

function ScanProductButton() {
  const { user } = useContext(AuthContext); // Use useContext to get user

  console.log('ScanProductButton user:', user);

  if (!user || !user.perms || !user.perms[0]) {
    return null;
  }

  const hasScanOutProductPermission = user.perms[0].scanOutProduct;

  console.log('hasScanOutProductPermission:', hasScanOutProductPermission);

  if (!hasScanOutProductPermission) {
    return null;
  }

  const handleClick = () => {
    console.log('Scan Out Product button clicked');
    // Add your logic here
  };

  return <button onClick={handleClick}>Scan Out Product</button>;
}

export default ScanProductButton;