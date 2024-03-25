import React from 'react';

function ScannedList({ items }) {
  return (
    <div>
      <h2>Scanned Items</h2>
      <ul>
        {items.map(item => (
          <li key={item._id}>{item.name} - {item.unitsOnHand} left</li>
        ))}
      </ul>
    </div>
  );
}

export default ScannedList;