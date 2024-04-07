import React, { useRef, useEffect, useState, useContext } from 'react';
import { handleBarcode } from './barcodeHandler_comp';
import ScannedList from '../components/ScannedList_comp';
import { AuthContext } from '../components/Auth_comp';  
import '../App.css';
import barcodeImage from '../barcode.png';

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
        const scannedItem = await handleBarcode(barcodeData, token, setProductData, setScannedItems);
  

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
    <div className='scanner-comp'>

        <div className='scanner'>
        <img src={barcodeImage} alt="Barcode" style={{width: '100%', height: '100%'}} />
            {isCameraVisible && <div className='scanner-line'></div>}
        </div>
        <div className='scannedlist-comp'><ScannedList items={scannedItems} /></div>
    </div>
  );
}

export default Scanner;