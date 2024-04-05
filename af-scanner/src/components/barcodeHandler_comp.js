// barcodeHandler_comp.js

import jwtDecode from 'jwt-decode';
import { fetchProduct } from '../services/scanProduct_api';
import logScanActivity from '../services/logScanActivity_api';
import { updateUnitsOnHand } from './updateUnitsOnHand';

export async function handleBarcode(barcode, token, setProductData, setScannedItems) {
    const product = await fetchProduct(barcode);
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
      console.error('Invalid product._id or userId');
    }
    setProductData(product);
    console.log(userId);
    setScannedItems((prevItems) => {
      if (!prevItems.find((item) => item._id === product._id)) {
        return [...prevItems, product];
      } else {
        return prevItems;
      }
    });
    try {
      const updatedProduct = await updateUnitsOnHand(product._id, product.unitsOnHand);
      console.log("Updated product:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
};