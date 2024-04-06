import React, { useRef, useEffect, useState, useContext } from 'react';
import { handleBarcode } from './barcodeHandler_comp';
import ScannedList from '../components/ScannedList_comp';
import { AuthContext } from '../components/Auth_comp';  
import '../App.css';
import barcodeImage from '../barcode.png';

export async function updateUnitsOnHand(_id, currentUnitsOnHand) {
  console.log('updateUnitsOnHand called');
  try {
    const response = await fetch(`http://localhost:3001/api/products/${_id}`, {
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

function Scanner() {
  
  const [barcodeData, setBarcodeData] = useState("");
  const [lastScanTime, setLastScanTime] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [productData, setProductData] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const { token, username, role } = useContext(AuthContext);



  
  useEffect(() => {
    const handleBarcodeScan = async (event) => {
      if (event.key === "Enter") { // or whatever your scanner uses as the end character
        // Call handleBarcode with the scanned barcode data
        await handleBarcode(barcodeData, token, setProductData, setScannedItems);
  
        setBarcodeData("");
      } else if (!event.key.startsWith('Shift')) {
        setBarcodeData(prevData => prevData + event.key);
      }
    };
  
    window.addEventListener("keydown", handleBarcodeScan);
  
    return () => {
      window.removeEventListener("keydown", handleBarcodeScan);
    };
  }, [barcodeData, token]); // Add token to the dependency array


  const scannedRecently = lastScanTime && Date.now() - lastScanTime < 10000;
  return (
    <div>
        {scannedRecently && <p>Scanned a barcode!</p>}
        {barcodeData && <p>Barcode Data: {barcodeData}</p>}
        {productData && <p>Product Data: {JSON.stringify(productData)}</p>}
        <div className='scanner'>
        <img src={barcodeImage} alt="Barcode" style={{width: '100%', height: '100%'}} />
            {isCameraVisible && <div className='scanner-line'></div>}
        </div>
        <div><ScannedList items={scannedItems} /></div>
    </div>
  );
}

export default Scanner;