// logScanerActivity_api.js
function logScanActivity(productId, userId) {
    return fetch('http://localhost:3001/api/logScan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, userId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  export default logScanActivity;