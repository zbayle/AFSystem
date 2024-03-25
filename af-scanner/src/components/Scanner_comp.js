import React, { useRef, useEffect, useState, useContext } from 'react';
import Webcam from "react-webcam";
import Quagga from 'quagga';
import { jwtDecode } from 'jwt-decode';
import { stopCamera } from '../utils/camera.utl';
import { fetchProduct } from '../services/scanProduct_api';
import ScannedList from '../components/ScannedList_comp';
import logScanActivity from '../services/logScanerActivity_api';
import { AuthContext } from '../components/Auth_comp';  
import '../App.css';

async function updateUnitsOnHand(_id, currentUnitsOnHand) {
  const newUnitsOnHand = currentUnitsOnHand - 1;
  console.log('New units on hand:', newUnitsOnHand);

  const response = await fetch(`http://localhost:3001/api/products/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ unitsOnHand: newUnitsOnHand }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const product = await response.json();
  return product;
}

function Scanner() {
  const webcamRef = useRef(null);
  const [barcodeData, setBarcodeData] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [productData, setProductData] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleBarcode(barcodeInput);
        setBarcodeInput("");
      } else {
        setBarcodeInput((input) => input + e.key);
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [barcodeInput]);

  const handleBarcode = async (barcode) => {
    const product = await fetchProduct(barcode);
    if (!token) {
      console.error('No JWT token found');
      return;
    }
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    logScanActivity(product._id, userId);
    setProductData(product);
    console.log(userId);
    setScannedItems((prevItems) => [...prevItems, product]);
    try {
      const updatedProduct = await updateUnitsOnHand(product._id, product.unitsOnHand);
      console.log("Updated product:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    if (webcamRef.current && isCameraVisible && !isScanning) {
      setIsScanning(true);
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: webcamRef.current.video,
        },
        decoder: {
          readers: ['code_128_reader', 'upc_reader'], 
        },
      }, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      });
  
      Quagga.onDetected(async (data) => {
        setBarcodeData(data.codeResult.code);
        setLastScanTime(Date.now());
        Quagga.stop();
        setIsCameraVisible(false);
      
        const product = await fetchProduct(data.codeResult.code);
        setProductData(product);
      
        // Add the scanned product to the scannedItems array
        setScannedItems(prevItems => [...prevItems, product]);
      
        // Get JWT from local storage
        const token = localStorage.getItem('jwtToken');
        // Decode JWT to get userId
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        // Log scan activity
        logScanActivity(product._id, userId); 
      
        try {
          const updatedProduct = await updateUnitsOnHand(product._id, product.unitsOnHand);
          //console.log('Updated product:', updatedProduct);
        } catch (error) {
          console.error('Error updating product:', error);
        }
      
        setIsScanning(false);
      
        setTimeout(() => {
          setIsCameraVisible(true);
        }, 4000);
      });
    }
  
    return () => {
      Quagga.stop();
      if (webcamRef.current && webcamRef.current.stream) {
        stopCamera(webcamRef.current.stream);
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, [isCameraVisible, isScanning]); // Update this line

  const scannedRecently = lastScanTime && Date.now() - lastScanTime < 10000;

  return (
    <div>
        {scannedRecently && <p>Scanned a barcode!</p>}
        {barcodeData && <p>Barcode Data: {barcodeData}</p>}
        {productData && <p>Product Data: {JSON.stringify(productData)}</p>}
        <div className='scanner'>
            {isCameraVisible && <Webcam ref={webcamRef} />}
            {isCameraVisible && <div className='scanner-line'></div>}
        </div>
        <div><ScannedList items={scannedItems} /></div>
    </div>
  );
}

export default Scanner;