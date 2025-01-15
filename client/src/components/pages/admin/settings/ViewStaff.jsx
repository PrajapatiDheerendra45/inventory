import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { CircularProgress, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ViewStaff = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/all-staff');

        // Extract staff from response data
        const staffMembers = response.data.staff;
        console.log(staffMembers);

        // Map staff members to rows for DataGrid
        const mappedRows = staffMembers?.map((staff) => ({
          id: staff._id,
          name: staff.userName,
          address: staff.address,
          fatherName: staff.fatherName,
          contact: staff.contact,
          email: staff.email,
          pincode: staff.pincode,
          state: staff.state,
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

  // Function to handle delete action
  const handleDelete = async (id) => {
    const confirmation = prompt('Type "yes" to confirm deletion');
    if (confirmation === 'yes') {
      try {
        // Perform the delete operation
      const res =   await axios.delete(`/api/v1/auth//delete-staff/${id}`);
      if(res.data.success){
        toast.success(res.data.message)
      }
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    } else {
      alert('Delete action canceled');
    }
  };

  // Define columns for the staff DataGrid, aligned with mapped rows
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'fatherName', headerName: 'Father\'s Name', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Address', flex: 2, minWidth: 100 },
    { field: 'contact', headerName: 'Contact', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 2, minWidth: 250 },
    { field: 'pincode', headerName: 'Pincode', flex: 1, minWidth: 100 },
    { field: 'state', headerName: 'State', flex: 1, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.id)}
          color="secondary"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 1 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="responsive-container">
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: 'purple',
            color: 'white',
            borderRadius: '5px',
            padding: '2px 4px',
            marginBottom: '4px',
          }}
        >
          All Staff
        </span>
      </Typography>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          autoHeight
          disableColumnMenu
          sx={{ border: 0 }}
        />
      </Paper>
      <Toaster/>
    </div>
  );
};

export default ViewStaff;
