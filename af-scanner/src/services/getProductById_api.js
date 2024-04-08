export async function getProductById(productId) {
    try {
      const response = await fetch(`http://localhost:3001/api/products/search/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }