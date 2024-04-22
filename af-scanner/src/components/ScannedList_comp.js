import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth_comp';




function ScannedList({ items }) {
  const {user} = useContext(AuthContext);


  // //TESTING SCANNED ITEM REMOVE THE item. from user and role in the title
  // const mockScannedItem = {
  //   _id: '1234',
  //   displayName: 'Test Item',
  //   unitsOnHand: 10,
  //   user: {
  //     _id: {
  //       "$oid": "65ff25150d9d6b6dc01641c1"
  //     },
  //     username: "zbayle",
  //     email: "zack@airfiber.cc",
  //     password: "$2a$10$csaOx/AnhmdTXnImRKI8IOx6dwpdSTPkO9qoxsRi5OJPAIpsP0guy",
  //     role: "Developer",
  //     fob: "02833812",
  //     createdAt: {
  //       "$date": "2024-03-23T18:53:09.323Z"
  //     },
  //     updatedAt: {
  //       "$date": "2024-03-23T18:53:09.324Z"
  //     },
  //     "__v": 0
  //   },
  //   newItem: {
  //     timestamp: new Date(),
  //   },
  // };
  
  // items = [mockScannedItem,mockScannedItem,mockScannedItem,mockScannedItem,mockScannedItem,mockScannedItem,mockScannedItem];






  return (
    <div className='scanned-list'>
      <h2 className='container-title'>Recently Scanned Items</h2>
      <div className="tile-container">
        {[...items].reverse().map((item, index) => {
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