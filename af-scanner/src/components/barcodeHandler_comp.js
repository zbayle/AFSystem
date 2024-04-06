// barcodeHandler_comp.js

import {jwtDecode} from 'jwt-decode';
import { fetchProduct } from '../services/scanProduct_api';
import logScanActivity from '../services/logScanerActivity_api';
import { updateUnitsOnHand } from '../components/Scanner_comp';

export async function handleBarcode(barcode, token, setProductData, setScannedItems) {
  console.log('handleBarcode called');
  let product = await fetchProduct(barcode);
  if (!token || typeof token !== 'string') {
    console.error('Invalid JWT token');
    return;
  }
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  if (product._id && userId) {
    try {
      await logScanActivity(product._id, userId);
    } catch (error) {
      console.error('Error logging scan activity:', error);
    }
  } else {
    console.error('Invalid product._id or userId', product._id, userId);
  }
  try {
    const updatedProduct = await updateUnitsOnHand(product._id, product.unitsOnHand - 1);
    product = updatedProduct;
    setProductData(product);

    // Add the new scanned item to the scannedItems array
    setScannedItems(prevItems => [...prevItems, product]);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};