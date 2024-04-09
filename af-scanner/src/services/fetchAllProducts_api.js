import axios from 'axios';

const fetchAllProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/products');
    
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export default fetchAllProducts;