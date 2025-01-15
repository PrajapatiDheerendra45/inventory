import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Grid,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // for animation

const LoaderHand = () => (
  <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
    <CircularProgress />
  </Grid>
);

// Styled component for the table container
const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  overflowX: 'auto',
  transition: 'transform 0.5s ease',
}));

const DemoContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('/api/v1/contact/allList');
      setContacts(res.data.contactList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact list:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" className="responsive-container" direction="column">
      {/* Header with title */}
    
      {loading ? (
        <LoaderHand />
      ) : (
        <ResponsiveTableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TransitionGroup component={null}>
                {contacts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((contact, index) => (
                    <CSSTransition key={contact._id} timeout={500} classNames="row">
                      <TableRow hover>
                        {/* Show serial number based on index */}
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.business}</TableCell>
                        <TableCell>{contact.contact}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.city}</TableCell>
                        <TableCell>{contact.state}</TableCell>
                        <TableCell>{new Date(contact.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={contacts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ResponsiveTableContainer>
      )}
    </Grid>
  );
};

export default DemoContactList;
