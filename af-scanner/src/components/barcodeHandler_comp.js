// barcodeHandler_comp.js

import {jwtDecode} from 'jwt-decode';
import { fetchProduct } from '../services/scanProduct_api';
import logScanActivity from '../services/logScanerActivity_api';
import { updateUnitsOnHand } from './updateUnitsOnHand_comp';

export async function handleBarcode(barcode, token, setProductData, setScannedItems, scannedItem, newItem) {

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
    const updatedProduct = await updateUnitsOnHand(product._id, product.unitsOnHand);
    product = updatedProduct.product;
    //setProductData(product);

    // Add the new scanned item to the scannedItems array
    // Add a timestamp to the scanned item
    const newItem = {
      ...scannedItem,
      timestamp: new Date(),
    };
    setScannedItems(prevItems => [...prevItems, {...product, newItem}]); //changes product for newItem
  } catch (error) {
    console.error("Error updating product:", error);
  }
};