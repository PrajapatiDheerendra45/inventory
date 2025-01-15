import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { CircularProgress, Typography, Box } from '@mui/material';
import axios from 'axios';

const ActiveUser = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/super/active-users'); 
        
        
        const activeUsers = response.data.users;

       
        const mappedRows = activeUsers?.map(user => ({
          id: user._id,
          userName: user.userName,
          businessName: user.businessName,
          address: user.address,
          contact: user.contact,
          email: user.email,
          status: user.status,
          businessType: user.businessType,
        }));

        setRows(mappedRows);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns including businessType
  const columns = [
    { field: 'userName', headerName: 'Name', width: 120 },
    { field: 'businessName', headerName: 'Business Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 100 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'status', headerName: 'Status', width: 90 },
    { field: 'businessType', headerName: 'Business Type', width: 150 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="responsive-container"  data-aos="zoom-in-up">
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 2,
        }}
      >
        <span style={{
          display: 'inline-block', 
          background: 'purple',
          color: 'white',
          borderRadius: '5px',
          padding: '2px 6px',
        }}>
          Active Users
        </span>
      </Typography>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
};

export default ActiveUser;
