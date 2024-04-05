// quaggaScanner.js
import Quagga from 'quagga';
import { fetchProduct } from '../services/scanProduct_api';

export async function quaggaScanner(webcamRef, isCameraVisible, isScanning, setIsScanning, setBarcodeData, setLastScanTime, setProductData, setScannedItems, token, updateUnitsOnHand, lastScanTime) {
    if (webcamRef.current && !isScanning) {
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
            setIsScanning(true);
            Quagga.start();
        });

        Quagga.onDetected(async (data) => {
            if (isScanning) {
                return;
            }

            if (lastScanTime && Date.now() - lastScanTime < 2000) {
                return;
            }
        
            setBarcodeData(data.codeResult.code);
            setLastScanTime(Date.now());
            setIsScanning(false);
            Quagga.stop();
        
            const product = await fetchProduct(data.codeResult.code);
            setProductData(product);
        
            setScannedItems(prevItems => [...prevItems, product]);
        });
    }
}