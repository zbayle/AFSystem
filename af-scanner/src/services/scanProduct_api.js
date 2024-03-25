export function fetchProduct(barcodeData) {
    return fetch(`http://localhost:3001/api/products/${barcodeData}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }