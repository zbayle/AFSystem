export async function updateUnitsOnHand(_id, currentUnitsOnHand) {
    try {
      const response = await fetch(`http://192.168.1.60:3001/api/products/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitsOnHand: currentUnitsOnHand - 1,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error:', error);
    }
  }