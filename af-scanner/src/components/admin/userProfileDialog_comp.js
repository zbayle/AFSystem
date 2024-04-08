import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Card, CardContent,CircularProgress  } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import getScannedLogs from '../../services/getScannedLoggs_api'; 
import {getProductById }from '../../services/getProductById_api';
import { AuthContext } from '../Auth_comp'; // Import AuthContext

function UserProfileDialog({ open, onClose, _id }) {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && _id) {
        getScannedLogs(_id).then(setLogs);
    }
  }, [open, _id]);

  useEffect(() => {
    if (logs.length > 0) {
      setLoading(true);
      Promise.all(logs.map(log => getProductById(log.productId)))
        .then(setProducts)
        .finally(() => setLoading(false));
    }
  }, [logs]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h4">UserName: {user.username}</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          products.map((product, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant="h5">{product.displayName}</Typography>
                <Typography variant="h6">Product ID: {product._id}</Typography>
                <Typography variant="body1">Tech ID: {logs[index].techId}</Typography>
                <Typography variant="body2">Scan Time: {new Date(logs[index].scanTime).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserProfileDialog;