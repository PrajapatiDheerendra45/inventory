import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
import{
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TablePagination,
  Typography,
  Grid,
} from "@mui/material";

const initialFormData = {
  name: "",
  ifscCode: "",
  accountNumber: "",
  openingBalance: "",
  drCr: "",
  date: "", // Added date field
};

const AddBank = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [banks, setBanks] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [auth]=useAuth();
  const [userId,setUserId]=useState("")
   
  useEffect(() => {
    if(auth.user.role===1){
      setUserId(auth.user._id)
    
    }
    if(auth.user.role===0){
      setUserId(auth.user.admin)
     
    }
    fetchBanks();
  }, [auth,userId]);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageBank/${userId}`);
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching Bank data", error);
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "ifscCode", "accountNumber", "openingBalance", "drCr", "date"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {
      const updatedFormData = { ...formData, userId };
      const response = await axios.post("/api/v1/auth/createBank", updatedFormData);
      if (response) {
        toast.success(response.data.message);
        fetchBanks();
        clearData();
      }
    } catch (error) {
      console.error("Error creating bank:", error);
      toast.error(`Error creating bank: ${error.message}`);
    }
  };

  const clearData = () => {
    setFormData(initialFormData);
    setIsCreateModalOpen(false);
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`/api/v1/auth/deleteBank/${_id}`);
      setBanks(banks.filter((bank) => bank._id !== _id));
      toast.success("Bank entry deleted successfully");
    } catch (error) {
      console.error("Error deleting bank entry:", error);
      toast.error("Error deleting bank entry");
    }
  };

  const openViewModal = (bank) => {
    setModalData(bank);
    setViewModal(true);
  };

  const openEditModal = (bank) => {
    setModalData(bank);
    setEditModal(true);
  };

  const closeModal = () => {
    setViewModal(false);
    setEditModal(false);
    fetchBanks();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="container mx-auto p-4 responsive-container uppercase " data-aos="flip-up">
      <h1 className="text-center text-2xl font-bold text-purple-600 mb-4 underline">
        Manage Bank
      </h1>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Add Bank
      </Button>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bank Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>IFSC Code</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Account No</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Opening Balance</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.2rem" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((bank, index) => (
                <TableRow key={bank._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{bank.name}</TableCell>
                  <TableCell>{bank.ifscCode}</TableCell>
                  <TableCell>{bank.accountNumber}</TableCell>
                  <TableCell>{bank.openingBalance}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => openViewModal(bank)}>View</Button>
                    <Button color="secondary" onClick={() => openEditModal(bank)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(bank._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={banks?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[7, 14, 21]}
      />

      <ToastContainer />

      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <DialogTitle>Add Bank</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="dense"
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Opening Balance"
            name="openingBalance"
            value={formData.openingBalance}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Select
            label="Dr/Cr"
            name="drCr"
            value={formData.drCr}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Dr">Dr</MenuItem>
            <MenuItem value="Cr">Cr</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {viewModal && (
        <Dialog open={viewModal} onClose={closeModal}>
          <DialogTitle>View Bank</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>Date:</strong> {modalData.date}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {modalData.name}</Typography>
            <Typography variant="body1"><strong>IFSC Code:</strong> {modalData.ifscCode}</Typography>
            <Typography variant="body1"><strong>Account Number:</strong> {modalData.accountNumber}</Typography>
            <Typography variant="body1"><strong>Opening Balance:</strong> {modalData.openingBalance}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {editModal && (
        <Dialog open={editModal} onClose={closeModal}>
          <DialogTitle>Edit Bank</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={modalData.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
            <TextField
              label="Name"
              name="name"
              value={modalData.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={modalData.ifscCode}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Account Number"
              name="accountNumber"
              value={modalData.accountNumber}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Opening Balance"
              name="openingBalance"
              value={modalData.openingBalance}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <Select
              label="Dr/Cr"
              name="drCr"
              value={modalData.drCr}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
              <MenuItem value="Cr">Cr</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="secondary">Cancel</Button>
            <Button onClick={() => {/* handle edit logic */}} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AddBank;
