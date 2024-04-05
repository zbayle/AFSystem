import { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { fetchProduct } from '../services/scanProduct_api';

export function useZxingScanner(setScannedItems, setProductData, setBarcodeData, setLastScanTime, updateUnitsOnHand, logScanActivity, user, isCameraVisible) {
    const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);
    const [isScanning, setIsScanning] = useState(false);

    const startScanning = useCallback(async () => {
        if (isScanning) {
            // A scan is already in progress, so don't start a new one
            return;
        }

        setIsScanning(true);
        try {
            await codeReader.decodeFromInputVideoDevice(undefined, 'video')
                .then(async (result) => {
                    console.log('Scanned result:', result.text);
                    const product = await fetchProduct(result.text);
                    console.log('Fetched product:', product);
                    setProductData(product);
                    setScannedItems(prevItems => [...prevItems, product]);
                    if (product && product._id && product.unitsOnHand) {
                        await updateUnitsOnHand(product._id, product.unitsOnHand);
                    }
                    if (product && product._id && user) {
                        await logScanActivity(product._id, user._id);
                    }
                    setIsScanning(false);
                });
        } catch (err) {
            console.error('Error in scanning:', err);
            setIsScanning(false);
        }
    }, [isScanning, codeReader, setProductData, setScannedItems, updateUnitsOnHand, logScanActivity, user]);

    useEffect(() => {
        startScanning();
    }, [startScanning]);
}