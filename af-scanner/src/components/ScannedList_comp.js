import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth_comp';

function ScannedList({ items }) {
  const {user} = useContext(AuthContext);
  return (
    <div className='scanned-list'>
      <h2 className='container-title'>Recently Scanned Items</h2>
      <div className="tile-container">
        {items.map((item, index) => {
          if (!item) {
            return null; // Skip this iteration if item is undefined
          }

          return (
            <div key={item._id + '-' + index} className="tile">
              <h3 className="product-name">{item.displayName}</h3>
              <p className={`units-on-hand ${item.unitsOnHand <= 0 ? 'units-on-hand-low' : ''}`}>
                {item.unitsOnHand} Left on hand
              </p>
              <p className='user-name'>scanned by user: {user.username}({user.role})</p>
              <sub className='timestamp'>{item.newItem.timestamp.toLocaleString()}</sub>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScannedList;