import axios from 'axios';

const updateProductOnHand = async (productId, unitsOnHand) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/products/${productId}`, {
      unitsOnHand
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating product: ${error}`);
    return null;
  }
};

export default updateProductOnHand;