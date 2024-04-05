// logScanerActivity_api.js
function logScanActivity(productId, techId) {
  console.log('ProductId:', productId);
  console.log('TechId:', techId);
    return fetch('http://localhost:3001/api/logScan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, techId }),
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