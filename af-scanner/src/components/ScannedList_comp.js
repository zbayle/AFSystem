import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth_comp';

function ScannedList({ items }) {
  const {user} = useContext(AuthContext);
  return (
    <div>
      <h2>Scanned Items</h2>
      <div className="tile-container">
        {items.map((item, index) => {
          if (!item) {
            return null; // Skip this iteration if item is undefined
          }

          return (
            <div key={item._id + '-' + index} className="tile">
              <h3>{item.product.displayName}</h3>
              <p>{item.product.unitsOnHand } Left on hand</p>
              <p>scanned by user: {user.username}({user.role})</p>
              <sub>{new Date().toLocaleString()}</sub>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScannedList;