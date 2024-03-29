import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth_comp';


export async function fetchRoleDetails(role, token) {
    //console.trace('getPerms called');
    const response = await fetch(`http://localhost:3001/api/perms/getPerms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }