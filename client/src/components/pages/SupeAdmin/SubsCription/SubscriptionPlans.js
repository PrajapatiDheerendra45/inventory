
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, TextField, Switch, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, Cancel } from '@mui/icons-material'; // Import icons
import { fontFamily } from '@mui/system';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    duration: '',
    price: '',
    planStatus: 'Active',  // Default to 'Active'
  });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/v1/subscription/all');
     
      setPlans(response.data.plan);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSwitchChange = (event) => {
    const newStatus = event.target.checked ? 'Active' : 'Inactive';
    setFormData((prevData) => ({
      ...prevData,
      planStatus: newStatus,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        const ed = await axios.put(`/api/v1/subscription/update/${editingId}`, formData);
        if (ed.data.success) {
          toast.success(ed.data.message);
        } else {
          toast.error(ed.data.message);
        }
      } else {
        const cd = await axios.post('/api/v1/subscription/create', formData);
        if (cd.data.success) {
          toast.success(cd.data.message);
        } else {
          toast.error(cd.data.message);
        }
      }
      handleClose(); 
      fetchPlans();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      planName: plan.planName,
      description: plan.description,
      duration: plan.duration,
      price: plan.price,
      planStatus: plan.planStatus, 
    });
    setEditingId(plan._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const userConfirmation = window.prompt(
      'Are you sure you want to delete this plan? Type "yes" to confirm.'
    );
  
    if (userConfirmation === 'yes' || userConfirmation === 'Yes') {
      try {
        const dt = await axios.delete(`/api/v1/subscription/delete/${id}`);
        if (dt.data.success) {
          toast.success(dt.data.message);
        } else {
          toast.error(dt.data.message);
        }
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    } else {
      toast.error('Deletion canceled.');
    }
  };
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      planName: '',
      description: '',
      duration: '',
      price: '',
      planStatus: 'Active', 
    });
    setEditingId(null);
  };

  return (
    <div className=" responsive-container  px-4 py-1 max-w-7xl" data-aos="zoom-in-up">
      <div className=" mx-auto  p-8 border border-gray-300 shadow-lg rounded-lg bg-white ">
    <Box>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create New Plan
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Plan Name"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Box mt={2} display="flex" alignItems="center">
              <Switch
                checked={formData.planStatus === 'Active'} 
                onChange={handleSwitchChange}
                name="planStatus"
                color="primary"
              />
              <Typography>{formData.planStatus}</Typography> 
            </Box>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {editingId ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Box mt={2}>
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={plan._id}  >
              <Card variant="outlined" sx={{ mb: 2, pt: 0.2, pl: 2 ,borderTopLeftRadius:50, borderBottomRightRadius:50 }} >
                <CardContent align="left">
                  <Typography variant="h6" pb={1} sx={{ pb: 1, background: 'purple', textAlign:"center", color: 'white' ,borderRadius: '5px',  padding: '2px 6px'}}>
                   {plan.planName}  Plan 
                  </Typography>
                  <Typography  variant ="h6" sx={{  textAlign:"cetner", fontFamily: "Merriweather" ,fontStyle:"bold"}} >Duration: {plan.duration} days</Typography>
                  <Typography  variant="h5"   sx={{textAlign:"center", color:"tomato",fontFamily:"Kings",fontWeight:"40px"}}> Price ₹{plan.price}</Typography>
                  <Typography>Status: {plan.planStatus} {plan.planStatus === 'Active' ? (
                      <CheckCircle sx={{ color: 'green', mr: 1 }} />
                    ) : (
                      <Cancel sx={{ color: 'red', mr: 1 }} />
                    )}  </Typography>
                  <Typography>{plan.description}</Typography>
                  <Box mt={2} display="flex" alignItems="center">
                   
                    <Button onClick={() => handleEdit(plan)} variant="outlined" color="primary" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(plan._id)} variant="outlined" color="secondary">
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Toaster />
    </Box>
    </div>
    </div>

  );
};


export default SubscriptionPlans;
