import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null); // Track loading state for each plan

  useEffect(() => {
    fetchPlans();
  }, []);
  
  
  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/v1/subscription/all');
      setPlans(response?.data?.plan);
      
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };
 

 



  return (
    <div className="responsive-container  px-4 py-1 max-w-48xl">
      <div className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg bg-white">
        <Box>
          {/* Welcome Message */}
        

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                mr: 2,
                textShadow: '2px 2px 4px rgba(160, 32, 40, 0.5)', // Add box shadow to text
              }}
            >
              Subscribe Now to Continue Our Service
            </Typography>
          </Box>
       

          {/* Subscription Plans Section */}
          <Box mt={2}>
            <Grid container spacing={2}>
              {plans?.map((plan) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={plan._id}>
                  <Card variant="outlined" sx={{ mb: 2, pt: 0.2,  borderTopLeftRadius: 50, borderBottomRightRadius: 50 }}>
                    <CardContent align="center">
                      <Typography style={{borderTopLeftRadius:50,borderBottomRightRadius:50,}} variant="h6" pb={1} sx={{  pb: 1, background: 'purple', textAlign: "center", color: 'white', borderRadius: '5px', padding: '2px 6px' }}>
                        {plan.planName} 
                      </Typography>
                      <Typography variant="h6" sx={{ textAlign: "center", fontFamily: "Merriweather", fontStyle: "bold" }}>
                        Duration: {plan.duration} days
                      </Typography>
                      <Typography variant="h5" sx={{ textAlign: "center", color: "tomato", fontFamily: "Kings", fontWeight: "40px" }}>
                        Price ₹{plan.price}
                      </Typography>
                      <Typography>
                        Status: {plan.planStatus} {plan.planStatus === 'Active' ? (
                          <CheckCircle sx={{ color: 'green', mr: 1 }} />
                        ) : (
                          <Cancel sx={{ color: 'red', mr: 1 }} />
                        )}
                      </Typography>
                      <Typography>{plan.description}</Typography>
                      <Box mt={2} display="flex" justifyContent="center">
                        {/* <Button style={{borderTopLeftRadius:40,borderBottomRightRadius:40,  textShadow: '2px 2px 4px rgba(160, 32, 40, 0.9)',}}
                          variant="contained"
                          sx={{ textAlign: 'center', borderRadius: '1px' }}
                          color="primary"
                         
                        >
                          {loadingPlan === plan._id ? 'Processing ...' : 'Subscribe'}
                        </Button> */}
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

export default Subscription;