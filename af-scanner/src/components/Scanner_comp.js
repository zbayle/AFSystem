import React, { useRef, useEffect, useState, useContext } from 'react';
import Webcam from "react-webcam";
import { useZxingScanner } from './ZxingScanner_comp';
import {jwtDecode} from 'jwt-decode';
import { stopCamera } from '../utils/camera.utl';

import ScannedList from '../components/ScannedList_comp';
import logScanActivity from '../services/logScanerActivity_api';
import { AuthContext } from '../components/Auth_comp';  
import '../App.css';

async function updateUnitsOnHand(_id, currentUnitsOnHand) {
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
  
  const [barcodeData, setBarcodeData] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [productData, setProductData] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('Scanner mounted');

    return () => {
      console.log('Scanner unmounted');
    };
  }, []);

  useZxingScanner(setScannedItems, setProductData, setBarcodeData, setLastScanTime, updateUnitsOnHand, logScanActivity, user, isCameraVisible, isScanning);

  const scannedRecently = lastScanTime && Date.now() - lastScanTime < 10000;
  
  return (
    <div>
        {scannedRecently && <p>Scanned a barcode!</p>}
        {barcodeData && <p>Barcode Data: {barcodeData}</p>}
        {productData && <p>Product Data: {JSON.stringify(productData)}</p>}
        <div className='scanner'>
        {isCameraVisible && <video id="video" style={{ width: '100%', height: '100%' }} autoPlay={true} />}
            {isCameraVisible && <div className='scanner-line'></div>}
        </div>
        <div><ScannedList items={scannedItems} user={user}/></div>
    </div>
  );
}

export default Scanner;