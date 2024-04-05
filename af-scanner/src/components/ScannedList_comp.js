import React from 'react';

function ScannedList({ items, user }) {
  return (
    <div>
      <h2>Scanned Items</h2>
      <div className="tile-container">
        {items.map((item, index) => (
          <div key={item._id + '-' + index} className="tile">
            <h3>{item.displayName}</h3>
            <p>{item.unitsOnHand <= 0 ? 0 : item.unitsOnHand} Left on hand</p>
            <p>scanned by user: {user.username}({user.role})</p>
            <sub>{new Date().toLocaleString()}</sub>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScannedList;