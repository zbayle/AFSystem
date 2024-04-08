import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth_comp';
import createProduct from '../../services/createProduct_api';
import { Formik, Field, Form } from 'formik';
import { TextField, Card, CardContent, Box, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'; 





function ProductCreate({open, onClose}) {
    console.log('handCreateClose', typeof onClose);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.perms || !user.perms.createProduct) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (values) => {
    try {
      const response = await createProduct(values);
      console.log(response);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Product</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            displayName: '',
            shortName: '',
            cost: '',
            unitsOnHand: '',
            upc: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form>
              <TextField label="Display Name" name="displayName" value={values.displayName} onChange={handleChange} fullWidth />
              <TextField label="Short Name" name="shortName" value={values.shortName} onChange={handleChange} fullWidth />
              <TextField label="Cost" name="cost" value={values.cost} onChange={handleChange} type="number" fullWidth />
              <TextField label="Units On Hand" name="unitsOnHand" value={values.unitsOnHand} onChange={handleChange} type="number" fullWidth />
              <TextField label="UPC" name="upc" value={values.upc} onChange={handleChange} fullWidth />
              <Button type="submit" variant="contained" color="primary">Submit</Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default ProductCreate;