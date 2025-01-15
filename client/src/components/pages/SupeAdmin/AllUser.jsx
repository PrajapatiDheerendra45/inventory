import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { CircularProgress, Typography, Box } from '@mui/material';
import axios from 'axios';

const AllUser = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/super/all-users');
      console.log(response)

        // Extracting users from the response data
        const users = response.data.users;
      

        // Mapping users to include businessType
        const mappedRows = users?.map(user => ({
          id: user._id,
          userName: user.userName, // Updated to 'userName'
          businessName: user.businessName,
          address: user.address,
          contact: user.contact,
          email: user.email,
          status: user.status,
          businessType: user.businessType, // Added businessType
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
    { field: 'userName', headerName: 'Name', width: 120  },
    { field: 'businessName', headerName: 'Business Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 100 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'status', headerName: 'Status', width: 90 },
    { field: 'businessType', headerName: 'Business Type', width: 150 }, // Added businessType column
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} >
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
    <div className="responsive-container" data-aos="zoom-in-up">
  

  <Typography 
  variant="h6" 
  sx={{ 
    textAlign: 'center',  // Center-aligns the content of the Typography
  }}
>
  <span style={{
    display: 'inline-block',  // Allows the background to only cover the text
    background: 'purple',
    color: 'white',
    borderRadius: '5px',
    padding: '2px 6px',
    marginBottom:'4px'
  }}>
    All User's
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

export default AllUser;
