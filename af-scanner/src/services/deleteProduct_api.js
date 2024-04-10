import axios from 'axios';

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
};

export default deleteProduct;