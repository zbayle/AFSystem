import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Card, CardContent,CircularProgress  } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import getScannedLogs from '../../services/getScannedLoggs_api'; 
import {getProductById }from '../../services/getProductById_api';
import { AuthContext } from '../Auth_comp'; // Import AuthContext

function UserProfileDialog({ open, onClose, _id, profileUsername }) {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (open && _id) {
      getScannedLogs(_id).then(logs => {
        if (!isCancelled) {
          setLogs(logs);
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [open, _id]);

  useEffect(() => {
    let isCancelled = false;

    if (logs.length > 0) {
      setLoading(true);
      Promise.all(logs.map(log => getProductById(log.productId)))
        .then(products => {
          if (!isCancelled) {
            setProducts(products);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setLoading(false);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [logs]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
  <DialogTitle>
    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
      <CancelOutlinedIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Typography variant="h4">UserName: {profileUsername}</Typography>
    {loading ? (
      <CircularProgress />
    ) : (
      logs.map((log, index) => {
        const product = products.find(product => product._id === log.productId);
        if (product) {
          return (
            <Card key={index}>
              <CardContent>
                <Typography variant="h5">{product.displayName}</Typography>
                <Typography variant="h6">Product ID: {product._id}</Typography>
                <Typography variant="body1">Tech ID: {log.techId}</Typography>
                <Typography variant="body2">Scan Time: {new Date(log.scanTime).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          );
        }
        return null;
      })
    )}
  </DialogContent>
</Dialog>
  );
}

export default UserProfileDialog;