import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../../../context/Auth'
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material'

function BankToBankTransfer() {
  const [bank, setBanks] = useState([])
  const [formData, setFormData] = useState({
    date: '',
    contraNo: '',
    fromAccount: '',
    amount: '',
    toAccount: '',
    ToAmount: '',
  })
  const [auth] = useAuth()
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
    fetchBanks()
  }, [auth, userId])

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageBank/${userId}`)
      setBanks(response.data.data)
    } catch (error) {
      console.error('Error fetching Bank data', error)
      toast.error(error.response.data.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = [
      'date',
      'contraNo',
      'fromAccount',
      'amount',
      'toAccount',
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`)
        return
      }
    }

    try {
      if (formData.amount !== formData.ToAmount) {
        alert('Both amount shoud be equal')
        return
      }
      const updatedFormData = {
        ...formData,

        userId: userId,
      }
      console.log(updatedFormData,"sakdjfkj")
      const response = await axios.post(
        '/api/v1/auth/banktoBankTransfer',
        updatedFormData,
      )
      console.log(response, 'ajhjahs')
      if (response) {
        toast.success(response.data.message)
      }

      clearData()
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('Error submitting form:', error.response.data.message)
    }
  }

  const clearData = () => {
    setFormData({
      date: '',

      contraNo: '',
      fromAccount: '',
      amount: '',
      toAccount: '',
      ToAmount: '',
    })
  }

  return (
    <Container
      maxWidth="lg"
      className="responsive-container"
      data-aos="fade-up"
    >
      <Box p={4} bgcolor="white" borderRadius={2} boxShadow={2}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Bank To Bank Transfer
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contra No"
                type="text"
                name="contraNo"
                value={formData.contraNo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ background: 'white' }}>
                  From Account
                </InputLabel>
                <Select
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        top: 56,
                      },
                    },
                  }}
                >
                  <MenuItem value="">Select Bank</MenuItem>
                  {bank?.map((bankItem) => (
                    <MenuItem key={bankItem._id} value={bankItem.name}>
                      {bankItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ background: 'white' }}>To Account</InputLabel>
                <Select
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        top: 56,
                      },
                    },
                  }}
                >
                  <MenuItem value="">Select Bank</MenuItem>
                  {bank?.map((bankItem) => (
                    <MenuItem key={bankItem._id} value={bankItem.name}>
                      {bankItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Amount"
                type="number"
                name="ToAmount"
                value={formData.ToAmount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </Box>
    </Container>
  )
}

export default BankToBankTransfer
