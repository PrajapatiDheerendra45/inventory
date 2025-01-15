import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../../context/Auth.js';

const CurrentPlan = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth] = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const response = await axios.get('/api/v1/subscription/allplan/66e131af8cef5fa88caa7891');
        const latestPlan = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setCurrentPlan(latestPlan);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentPlan();
  }, []);

  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const expirationDate = new Date(endDate);
    const difference = expirationDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(auth.user.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [auth.user.endDate]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!currentPlan) return <Typography>No active plan found.</Typography>;

  return (
    <div style={{ padding: '20px' }} className='responsive-container'>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ color: '#4A90E2', textAlign: 'center', marginBottom: '20px', fontSize: '2.5rem' }}
      >
        Current Subscription Plan
      </Typography>

      {/* Centering the top text */}
      <Box textAlign="center" marginBottom="20px">
        <Typography 
          variant="h6" 
          sx={{ color: '#FF6B6B', textAlign: 'center', fontSize: '1.5rem' }}
        >
          Plan expires on: <span style={{ color: '#2ECC71', fontSize: '1.5rem' }}>{new Date(auth.user.endDate).toLocaleDateString()}</span>
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ color: '#FF6B6B', textAlign: 'center', fontSize: '1.5rem' }}
        >
          Time left: <span style={{ color: '#F39C12', fontSize: '1.5rem' }}>{`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}</span>
        </Typography>
      </Box>

      <Card style={{ backgroundColor: '#F3F4F6', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ color: '#34495E', marginBottom: '10px', textAlign: 'center', fontSize: '1.5rem' }}
          >
            Invoice No: <span style={{ color: '#2980B9', fontSize: '1.5rem' }}>{currentPlan.invoiceNo}</span>
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
          >
            Amount: <span style={{ color: '#27AE60', fontSize: '1.2rem' }}>₹{currentPlan.amount}</span>
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
          >
            Payment Mode: <span style={{ color: '#9B59B6', fontSize: '1.2rem' }}>{currentPlan.paymentMode ? 'Online' : 'Offline'}</span>
          </Typography>
          {currentPlan.plan.map((plan) => (
            <div key={plan._id} style={{ marginTop: '20px', textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                component="div" 
                gutterBottom 
                sx={{ color: '#8E44AD', textAlign: 'center', fontSize: '1.5rem' }}
              >
                Plan: <span style={{ color: '#3498DB', fontSize: '1.5rem' }}>{plan.planName}</span>
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
              >
                Description: <span style={{ color: '#95A5A6', fontSize: '1.2rem' }}>{plan.description}</span>
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
              >
                Duration: <span style={{ color: '#E67E22', fontSize: '1.2rem' }}>{plan.duration} days</span>
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
              >
                Price: <span style={{ color: '#F39C12', fontSize: '1.2rem' }}>₹{plan.price}</span>
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ marginBottom: '10px', textAlign: 'center', fontSize: '1.2rem' }}
              >
                Status: <span style={{ color: '#C0392B', fontSize: '1.2rem' }}>{plan.planStatus}</span>
              </Typography>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentPlan;
