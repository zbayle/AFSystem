import React from 'react';
import { Formik, Field, Form } from 'formik';
import updateProductOnHand from '../../services/updateProduct_api';

const UpdateProductForm = ({ productId, handleClose }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedProduct = await updateProductOnHand(productId, values.unitsOnHand);
    if (updatedProduct) {
      console.log('Product updated:', updatedProduct);
      handleClose();
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ unitsOnHand: '' }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field type="number" name="unitsOnHand" />
        <button type="submit">Update</button>
      </Form>
    </Formik>
  );
};

export default UpdateProductForm;