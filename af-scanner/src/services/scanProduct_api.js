export function fetchProduct(barcodeData) {
    return fetch(`http://192.168.1.60:3001/api/products/${barcodeData}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }