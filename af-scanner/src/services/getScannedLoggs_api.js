export default async function getScannedLogs(userId) {
    const response = await fetch(`http://localhost:3001/api/getUserLogs/${userId}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }