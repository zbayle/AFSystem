import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Barcode from 'react-barcode';
import fetchAllProducts from '../../services/fetchAllProducts_api';
import UpdateProductForm from './updateProductOnHand_comp';
import deleteProduct from '../../services/deleteProduct_api'; // Import the deleteProduct function
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { Formik, Field, Form } from 'formik';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for the delete confirmation dialog
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const products = await fetchAllProducts();
    setProducts(products);
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchProducts();
  };

  const handleDelete = async () => {
    await deleteProduct(selectedProduct._id);
    setDeleteDialogOpen(false);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="inventory-list">
      {products.map((product, index) => (
        <div key={product._id + '-' + index} className="tile">
          <h3 className="product-name">{product.displayName}</h3>
          <p className={`units-on-hand ${product.unitsOnHand <= 0 ? 'units-on-hand-low' : ''}`}>
            {product.unitsOnHand} Left on hand
          </p>
          <p className="short-name">Short Name: {product.shortName}</p>
          <p className="cost">Cost: {product.cost}</p>
          <p className="upc">UPC: {product.upc}</p>
          <div className='barcode-container'>
            {product.upc !== "" ? (
              <Barcode value={String(product.upc)} /> 
            ) : (
              <button>Generate Barcode</button>
            )}
          </div>
          <IconButton onClick={() => handleOpen(product)}>
            <UpdateOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }}>
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </div>
      ))}
      {selectedProduct && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Units On Hand</DialogTitle>
          <DialogContent>
            <UpdateProductForm productId={selectedProduct._id} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedProduct?.displayName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryList;