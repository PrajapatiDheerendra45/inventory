import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, CardActions, Button } from '@mui/material';
import { useAuth } from '../../../context/Auth.js';

const PlanHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth] = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/subscription/allplan/66e131af8cef5fa88caa7891');
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const calculateLastDate = (createdAt, duration) => {
    const createdDate = new Date(createdAt);
    const lastDate = new Date(createdDate.setDate(createdDate.getDate() + duration));
    return lastDate.toLocaleDateString();
  };

  const formatPurchaseDate = (createdAt) => {
    const purchaseDate = new Date(createdAt);
    return purchaseDate.toLocaleDateString();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className='responsive-container'>
      <Typography variant="h4" gutterBottom style={{ color: '#4A90E2', textAlign: 'center', marginBottom: '20px' }}>
        Subscription Plan History
      </Typography>

      <Box textAlign="center" marginBottom="20px">
        <Typography variant="h6" style={{ color: '#FF6B6B' }}>
          Plan expires on: <span style={{ color: '#2ECC71' }}>{new Date(auth.user.endDate).toLocaleDateString()}</span>
        </Typography>
        <Typography variant="h6" style={{ color: '#FF6B6B' }}>
          Time left: <span style={{ color: '#F39C12' }}>{`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}</span>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {data.map((subscription) => (
          <Grid item xs={12} sm={6} md={4} key={subscription._id}>
            <Card
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" style={{ color: '#34495E', marginBottom: '10px' }}>
                  Invoice No: <span style={{ color: '#2980B9' }}>{subscription.invoiceNo}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                  Amount: <span style={{ color: '#27AE60' }}>₹{subscription.amount}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                  Payment Mode: <span style={{ color: '#9B59B6' }}>{subscription.paymentMode ? 'Online' : 'Offline'}</span>
                </Typography>
                {subscription.plan.map((plan) => (
                  <div key={plan._id} style={{ marginTop: '20px' }}>
                    <Typography variant="h6" component="div" gutterBottom style={{ color: '#8E44AD' }}>
                      Plan: <span style={{ color: '#3498DB' }}>{plan.planName}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Description: <span style={{ color: '#95A5A6' }}>{plan.description}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Duration: <span style={{ color: '#E67E22' }}>{plan.duration} days</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Price: <span style={{ color: '#F39C12' }}>₹{plan.price}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Status: <span style={{ color: '#C0392B' }}>{plan.planStatus}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Purchase Date: <span style={{ color: '#1ABC9C' }}>{formatPurchaseDate(plan.createdAt)}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                      Last Date: <span style={{ color: '#E74C3C' }}>{calculateLastDate(plan.createdAt, plan.duration)}</span>
                    </Typography>
                  </div>
                ))}
              </CardContent>
            
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PlanHistory;
