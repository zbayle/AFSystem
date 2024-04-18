import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import Barcode from 'react-barcode';
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import fetchAllProducts from '../../services/fetchAllProducts_api';

function BarcodePdfGenerator({ open, onClose }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchAllProducts();
      setProducts(products);
    };

    fetchProducts();
  }, []);

  const generatePdf = () => {
    const doc = new jsPDF();
    let y = 10; // vertical position of the barcode
  
    doc.setFontSize(10); // reduce the font size
  
    for (const product of products) {
      if (y > 260) { // if the current position is close to the end of the page
        doc.addPage(); // add a new page
        y = 10; // reset the position to the top of the new page
      }
  
      // Calculate the width of the text
      const textWidth = doc.getStringUnitWidth(product.displayName) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
      // Calculate the position of the text to center it
      const textPosition = (doc.internal.pageSize.width - textWidth) / 2;
  
      // Add the product name 5 units above the barcode
      doc.text(product.displayName, textPosition, y + 10);
  
      // Generate a barcode using the JsBarcode library
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, product.upc, { format: 'CODE128', displayValue: false, width: 1 });
  
      // Calculate the position of the barcode to center it
      const barcodePosition = (doc.internal.pageSize.width - 64) / 2; // 128 is the width of the barcode
  
      // Add the barcode to the PDF
      doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', barcodePosition, y + 15, 64, 25); // reduce the size of the barcode
  
      // Add the UPC below the barcode
      doc.text(product.upc, textPosition, y + 45);
  
      y += 65; // reduce the space between each product
    }
  
    doc.save('barcodes.pdf');
  };

  return (
    <>
      <IconButton onClick={generatePdf}>
        <PrintOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>Product Barcodes</DialogTitle>
        <DialogContent>
          {products.map((product, index) => (
            <div key={product._id + '-' + index} className="tile inventory_tile">
              <h3 className="product-name">{product.displayName}</h3>
              <div className='barcode-container'>
                {product.upc !== "" && (
                  <Barcode value={String(product.upc)} />
                )}
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BarcodePdfGenerator;