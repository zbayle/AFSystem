import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Barcode from 'react-barcode';
import fetchAllProducts from '../../services/fetchAllProducts_api';

const InventoryList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchAllProducts();
      setProducts(products);
    };

    getProducts();
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
        </div>
      ))}
    </div>
  );
};

export default InventoryList;