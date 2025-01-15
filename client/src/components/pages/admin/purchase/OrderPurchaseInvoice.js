import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import Select from 'react-select'
import { useAuth } from '../../../context/Auth.js'

import Modal from 'react-modal'

import { useLocation } from 'react-router-dom'

const OrderPurchaseInvoice = () => {
  const { _id } = useParams()
  const [documentPath, setdocumentPath] = useState(null)
  const [date, setDate] = useState('')
  const [invoiceNo, setinvoiceNo] = useState('')
  const [salesType, setSalesType] = useState('GST Invoice')
  const [customerType, setCustomerType] = useState('Retailer')
  const [placeOfSupply, setPlaceOfSupply] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [company, setCompanyData] = useState([])
  const [chooseUser, setChooseUser] = useState([])
  const [freeQty, setFreeQty] = useState(0)
  const [qty, setQty] = useState(0)
  const [margin, setMargin] = useState(0)
  const [gstRatev, setgstRatev] = useState(0)
  const [auth] = useAuth()
  const [userId, setuserId] = useState('')
  const [salesEstimates, setSalesEstimates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [transportDetails, setTransportDetails] = useState({
    receiptDocNo: '',
    dispatchedThrough: '',
    destination: '',
    carrierNameAgent: '',
    billOfLading: '',
    motorVehicleNo: '',
  })
  const [billingAddress, setBillingAddress] = useState('')
  const [reverseCharge, setReverseCharge] = useState('No')
  const [gstType, setGstType] = useState('CGST/SGST')
  const [rows, setRows] = useState([])
  const [paymentTerm, setPaymentTerm] = useState(0)
  const [otherCharges, setOtherCharges] = useState(0)
  const [supplierInvoiceNo, setsupplierInvoiceNo] = useState('')
  const [customer, setCustomer] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedAddress, setAddress] = useState('')
  const [viewModal, setViewModal] = useState(false)
  const [selectedBanks, setSelectedBanks] = useState([])
  const [selctedcash, setSelectedCash] = useState('')
  const [banks, setBanks] = useState([])
  const [filteredInvoiceData, setFilteredInvoiceData] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    invoiceNo: '',
    salesType: '',
    customerType: '',
    supplierName: '',
    selectedcash: '',
    selectedBank: [],
    placeOfSupply: '',
    paymentTerm: '',
    dueDate: '',
    receiptDocNo: '',
    dispatchedThrough: '',
    destination: '',
    carrierNameAgent: '',
    billOfLading: '',
    motorVehicleNo: '',
    billingAddress: '',
    reverseCharge: '',
    gstType: '',

    rows: [
      {
        itemCode: '', // Item Code
        productName: '', // Product Name
        hsnCode: '', // HSN Code
        qty: null, // Quantity
        uom: null, // Unit of Measure
        freeQty: null,
        mrp: null, // Maximum Retail Price
        unitCost: null, // Unit Cost
        schemeMargin: '', // Scheme Margin
        discountpercent: null, // Discount Percentage
        discountRs: null, // Discount in Rs
        taxableValue: null, // Taxable Amount
        cgstpercentercent: null, // CGST Percentage
        cgstRS: null, // CGST Amount
        sgstpercentercent: null, // SGST Percentage
        sgstRS: null, // SGST Amount
        igstpercentercent: null, // IGST Percentage
        igstRS: null, // IGST Amount
        totalValue: null, // Total Value
      },
    ],

    narration: '',
    otherChargesDescriptions: '',
    grossAmount: '',
    GstAmount: '',
    otherCharges: '',
    netAmount: '',
  })

  const [cashDetails, setCashDetails] = useState({
    Amount: '',
    Advance: '',
    Received: '',
    Balance: '',
  })
 



  useEffect(() => {
    if (selectedCustomer) {
      handleCustomerChange(selectedCustomer)
    }
  }, [])

  useEffect(() => {
    if (auth.user.role === 1) {
      setuserId(auth.user._id)
    }
    if (auth.user.role === 0) {
      setuserId(auth.user.admin)
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
  useEffect(() => {
    if (selctedcash) {
      handleCashPayment(selctedcash)
    }
  }, [selctedcash])

  useEffect(() => {
    if (selectedCustomer) {
      handleCustomerChange(selectedCustomer)
    }
  }, [])
  
  useEffect(() => {
    // Check if selectedBanks has data before running the effect
    if (selectedBanks) {
      const timer = setTimeout(() => {
        handleBankChange(selectedBanks)
      }, 3000) // 2-second delay

      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timer)
    }
  }, [selectedBanks]) // Empty dependency array ensures this runs only once after initial render


  const [paymentMethod, setPaymentMethod] = useState("");
  useEffect(() => {
    if (auth.user.role === 1) {
      setuserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setuserId(auth.user.admin);
    }
    fetchInvoiceData();
  }, [auth,userId]);
  const fetchInvoiceData = async () => {
    setLoading(true)
    setError(null)
    try {
 
      const response = await axios.get(
        `/api/v1/purchesOrderRoute/getAllpurchesorder/${userId}`
      );

      setSalesEstimates(response.data.invoices);
    } catch (error) {
      setError('Error fetching sales order.')
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (_id && salesEstimates?.length > 0) {
      const match = salesEstimates?.find((item) => item._id === _id)
      if (match) {
        setFilteredInvoiceData(match); // Set the matching data to the new state
      }
    }
  }, [_id, salesEstimates]);

  // Call this function when filteredInvoiceData changes
  useEffect(() => {
    if (filteredInvoiceData) {
      // Call the function to generate rows based on filteredInvoiceData
      generateRowsFromFilteredData(filteredInvoiceData)
    }
  }, [filteredInvoiceData])

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }
  const [subPaymentType, setSubPaymentType] = useState('')
  const handleSubPaymentTypeChange = (e) => {
    const { value } = e.target
    setSubPaymentType(value) // Set the subPaymentType state
    setBankDetails((prev) => ({ ...prev, selectBankType: value })) // Update bankDetails
  }

  const [otherChargesDescriptions, setOtherChargesDescriptions] = useState('')

  const fetchsupplier = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageSupplier/${userId}`)
      setCustomer(response.data.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        setuserId(auth.user._id)
      } else if (auth.user.role === 0) {
        setuserId(auth.user.admin)
      }
    }
    fetchsupplier()
  }, [auth, userId])

  useEffect(() => {
    const companyData = async () => {
      try {
        const response = await axios.get(`/api/v1/company/get/${userId}`)
        setCompanyData(response.data.data) // Assuming setCompanyData updates the company state
      } catch (error) {
        console.error('Error fetching company data:', error)
      }
    }

    companyData() // Fetch company data on component mount
  }, [userId]) // Empty dependency array ensures this only runs once, on mount

  const handleCustomerChange = (supplierName) => {
    const value = supplierName
    setSelectedCustomer(value)
    const selectedCustomerData = customer?.find((cust) => cust?.name === value)
    setChooseUser(selectedCustomerData)
    setFormData((prev) => ({
      ...prev,
      supplierName: selectedCustomerData ? selectedCustomerData.name : "",
      billingAddress: selectedCustomerData ? selectedCustomerData.address : "",
      placeOfSupply: selectedCustomerData ? selectedCustomerData.state : "",
    }));

    // setPlaceOfSupply(selectedCustomerData ? selectedCustomerData.state : "");
    // setBillingAddress(selectedCustomerData ? selectedCustomerData.address : "");
    // if (
    //   selectedCustomerData.state.trim().toLowerCase() ===
    //   company.state.trim().toLowerCase()
    // ) {
    //   setGstType("CGST/SGST");
    // } else {
    //   setGstType("IGST");
    // }
  };
  const handleBankChange = (bank) => {

    const _id = bank[0]?._id
    // Assuming you have a way to find the bank by its name
    const selectedBank = banks?.find((bank) => bank._id === _id)
    if (selectedBank) {
      // Update the selected bank in the state
      setSelectedBanks([selectedBank]) // Store as an array if needed

      // Update formData with selected bank details
      setFormData((prev) => ({
        ...prev,
        selectedBank: [selectedBank], // Store as an array if needed
      }))
    } else {
      // Handle case where bank is not found
      setSelectedBanks([]) // Clear selected banks if not found
    }

    // Additional logic for handling bank data
    setGstType('CGST/SGST')
  }

  const handleCashPayment = (selctedcash) => {
    setGstType('CGST/SGST')
    setSelectedCash(selctedcash)
    setFormData((prev) => ({
      ...prev,
      selectedcash: selctedcash,
    }))
  }
  const handleOtherChargesChange = (event) => {
    const newCharges = parseFloat(event.target.value) || 0
    setOtherCharges(newCharges)

    setFormData((prev) => ({
      ...prev,
      otherCharges: newCharges,
    }))
  }
  const handleOtherChargesSave = () => {
    setFormData((prev) => ({
      ...prev,
      otherCharges: otherCharges,
      otherChargesDescriptions: otherChargesDescriptions,
    }))
    setIsModalOtherChargesOpen(false)
  }

  useEffect(() => {
    if (date && paymentTerm) {
      const selectedDate = new Date(date)
      selectedDate.setDate(selectedDate.getDate() + parseInt(paymentTerm))

      const day = String(selectedDate.getDate()).padStart(2, '0')
      const month = selectedDate.toLocaleString('en-US', { month: 'short' })
      const year = selectedDate.getFullYear()
      const formattedDueDate = `${day}-${month}-${year}`

      setDueDate(formattedDueDate)
      setFormData((prev) => ({
        ...prev,
        dueDate: formattedDueDate, // Update formData with dueDate
      }))
    }
  }, [date, paymentTerm])

  const handlePaymentTermChange = (e) => {
    const value = e.target.value
    setPaymentTerm(value)
    setFormData((prev) => ({
      ...prev,
      paymentTerm: value,
    }))
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOtherChargesOpen, setIsModalOtherChargesOpen] = useState(false)

  const handleinvoiceNoChange = (e) => {
    const value = e.target.value
    setinvoiceNo(value)
    setFormData((prev) => ({
      ...prev,
      invoiceNo: value,
    }))
  }

  const handlesupplierInvoiceNoChange = (e) => {
    const value = e.target.value
    setsupplierInvoiceNo(value)
    setFormData((prev) => ({
      ...prev,
      supplierInvoiceNo: value,
    }))
  }
  const handlePlaceOfSupplyChange = (e) => {
    const value = e.target.value
    setPlaceOfSupply(value)
    setFormData((prev) => ({
      ...prev,
      placeOfSupply: value,
    }))
  }

  const handleBillingAddressChange = (e) => {
    const value = e.target.value
    setBillingAddress(selectedAddress)
    setFormData((prev) => ({
      ...prev,
      billingAddress: value,
    }))
  }
  const handleReverseChargeChange = (e) => {
    const value = e.target.value
    setReverseCharge(value)
    setFormData((prev) => ({
      ...prev,
      reverseCharge: value,
    }))
  }

  // Function to handle transport detail change

  const handleTransportDetailChange = (field, value) => {
    setTransportDetails((prev) => ({ ...prev, [field]: value }))
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleRowChange = (rowIndex, field, value) => {
    const updatedRows = [...rows] // Clone the existing rows array
    const currentRow = updatedRows[rowIndex] // Get the current row
    if (field === 'discountpercent') {
      // Calculate discountRs based on discountpercent and maxmimunRetailPrice
      const discountPercent = parseFloat(value) || 0 // Ensure a valid number
      const discountRs = (currentRow.unitCost * discountPercent) / 100 // Calculate discount in Rs
      // Update discount percent, discountRs, and taxable value
      currentRow.discountpercent = discountPercent
      currentRow.discountRs = discountRs.toFixed(2)
      // Update taxable value based on MRP, discountRs, and quantity
      const unitCost = Number(currentRow.unitCost)
      const discountRS = Number(currentRow.discountRs)
      const qt = Number(qty)
      const taxableValue = (unitCost - discountRS) * qt
      currentRow.taxableValue = taxableValue.toFixed(2) // Ensure toFixed(2) for consistent format
      // Calculate GST amounts (assuming the GST rate is split into CGST and SGST for intra-state transactions)
      const gstRate = Number(gstRatev) || 0
      const cgstRS = (taxableValue * (gstRate / 2)) / 100
      const sgstRS = (taxableValue * (gstRate / 2)) / 100
      const igstRS = (taxableValue * gstRate) / 100
      currentRow.cgstRS = cgstRS.toFixed(2)
      currentRow.sgstRS = sgstRS.toFixed(2)
      currentRow.igstRS = igstRS.toFixed(2)
      //dd
      // Update totalValue as taxableValue + GST amount (CGST + SGST or IGST)
      const totalGST =
        currentRow.cgstRS && currentRow.sgstRS ? cgstRS + sgstRS : igstRS
      currentRow.totalValue = (taxableValue + totalGST).toFixed(2)
    } else if (field === 'discountRs') {
      // Calculate discount percentage based on discountRs and maxmimunRetailPrice
      const discountRs = parseFloat(value) || 0
      const discountPercent = (discountRs / currentRow.unitCost) * 100
      // Update discount percent, discountRs, and taxable value
      currentRow.discountpercent = discountPercent.toFixed(2)
      currentRow.discountRs = discountRs.toFixed(2)
      // Update taxable value based on MRP, discountRs, and quantity
      const unitCost = Number(currentRow.unitCost)
      const discountRS = Number(currentRow.discountRs)
      const qt = Number(qty)
      const taxableValue = (unitCost - discountRS) * qt
      // const taxableValue = (currentRow.maxmimunRetailPrice - discountRs) * currentRow.qty;
      currentRow.taxableValue = taxableValue.toFixed(2)
      currentRow.totalValue = (taxableValue + totalGST).toFixed(2)
      // Calculate GST amounts (assuming the GST rate is split into CGST and SGST for intra-state transactions)
      const gstRate = Number(gstRatev) || 0
      const cgstRS = (taxableValue * (gstRate / 2)) / 100
      const sgstRS = (taxableValue * (gstRate / 2)) / 100
      const igstRS = (taxableValue * gstRate) / 100
      currentRow.quantity = qt
      currentRow.cgstRS = cgstRS.toFixed(2)
      currentRow.sgstRS = sgstRS.toFixed(2)
      currentRow.igstRS = igstRS.toFixed(2)

      // Update totalValue as taxableValue + GST amount (CGST + SGST or IGST)
      const totalGST =
        currentRow.cgstRS && currentRow.sgstRS ? cgstRS + sgstRS : igstRS

      currentRow.totalValue = (taxableValue + totalGST).toFixed(2)
    }
    // Update the rows state
    updatedRows[rowIndex] = currentRow
    setRows(updatedRows)
  }

  const handlQtyChange = (rowIndex, qty) => {
    const updatedRows = [...rows]

    const selectedRow = updatedRows[rowIndex]

    setQty(qty)
    updatedRows[rowIndex] = {
      ...selectedRow,
      qty: qty,
    }

    setRows(updatedRows)
  }

  const addRow = () => {
    setRows([
      ...rows,
      {
        itemCode: '',
        productName: '',
        hsnCode: '',
        qty: 0,
        units: '',
        maxmimunRetailPrice: 0,
        discountpercent: 0,
        discountRs: 0,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        unitCost: 0,
        totalValue: 0,
      },
    ])
  }

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    let grossAmount = 0
    let GstAmount = 0
    let totalOtherCharges = parseFloat(otherCharges) || 0

    rows.forEach((row) => {
      const taxableValue = parseFloat(row.taxableValue) || 0
      const cgstRS = parseFloat(row.cgstRS) || 0
      const sgstRS = parseFloat(row.sgstRS) || 0
      const igstRS = parseFloat(row.igstRS) || 0

      grossAmount += taxableValue
      GstAmount += cgstRS + sgstRS // Total GST amount for each row
    })

    let netAmount
    // Check if otherChargesDescriptions includes "discount" to decide calculation
    if (otherChargesDescriptions.toLowerCase().includes('discount')) {
      netAmount = grossAmount + GstAmount - totalOtherCharges
    } else {
      netAmount = grossAmount + GstAmount + totalOtherCharges
    }

    return { grossAmount, GstAmount, netAmount }
  }
  const { grossAmount, GstAmount, netAmount } = calculateTotals()
  // Function to handle Save and Print
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userId}`)
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data)
      } else {
        console.error('Unexpected response structure:', response.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // toast.error("Failed to fetch products. Please try again.");
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [auth, userId])

  const handleFreeQtyChange = (rowIndex, newFreeQty) => {
    const updatedRows = [...rows]
    const selectedRow = updatedRows[rowIndex]

    // Update the free quantity in the selected row
    const freeQty = parseFloat(newFreeQty) || 0 // Ensure it's a valid number

    // Calculate total quantity using the quantity from the selected row
    const totalQuantity = Number(qty) + freeQty

    // Calculate schemeMargin only if both freeQty and quantity exist
    const schemeMargin =
      freeQty && qty ? ((freeQty / totalQuantity) * 100).toFixed(2) : 0

    // Update the row with the new freeQty and schemeMargin
    updatedRows[rowIndex] = {
      ...selectedRow,
      freeQty: freeQty,
      schemeMargin: schemeMargin,
    }

    // Update the state with the modified rows
    setRows(updatedRows)
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const generateRowsFromFilteredData = (filteredData) => {



    setGstType(filteredData.gstType);
    setSelectedCustomer(filteredData.supplierName);
    setPlaceOfSupply(filteredData.placeOfSupply);
    setBillingAddress(filteredData.billingAddress);
    setSelectedCash(filteredData.cash);
    setSelectedBanks(filteredData.selectedBank || [])
    setTransportDetails({
      dispatchedThrough: filteredData.dispatchedThrough,
      destination: filteredData.destination,
      carrierNameAgent: filteredData.carrierNameAgent,
      billOfLading: filteredData.billOfLading,
    })
    filteredData.rows.map((row) => {
      const { igstpercent, ...rest } = row
      setgstRatev(igstpercent)
    })
    // Assuming otherCharges is a property in your filteredData
    const generatedRows = filteredData.rows.map((row) => {
      // Existing logic for calculating taxable values and GSTs
      const taxableValue = row.taxable || 0
      const cgstRS = parseFloat(
        ((taxableValue * row.cgstpercent) / 100).toFixed(2),
      )
      const sgstRS = parseFloat(
        ((taxableValue * row.sgstpercent) / 100).toFixed(2),
      )
      const igstRS = parseFloat(
        ((taxableValue * row.igstpercent) / 100).toFixed(2),
      )

      return {
        itemCode: row.itemCode,
        productName: row.productName,
        hsnCode: row.hsnCode,
        qty: row.qty,
        units: row.units,
        maxmimunRetailPrice: row.mrp ? parseFloat(row.mrp).toFixed(2) : '0.00',
        expiryDate: row.expiryDate,
        batchNo: row.batchNo,
        unitCost: row.unitCost || row.mrp,
        taxableValue: taxableValue,
        cgstpercent: row.cgstpercent,
        sgstpercent: row.sgstpercent,
        igstpercent: row.igstpercent,
        cgstRS: cgstRS,
        sgstRS: sgstRS,
        igstRS: igstRS,
        totalValue: (
          taxableValue +
          (taxableValue * row.igstpercent) / 100
        ).toFixed(2),
      }
    })
    // Set the generated rows in the state
    setRows(generatedRows)

    

    // Update otherCharges based on the selectedFilteredData
    const totalOtherCharges = filteredData.otherCharges || 0 // Adjust according to your data structure
    setOtherCharges(totalOtherCharges) // Update state for otherCharges

    // Call calculateTotals to update totals after rows and otherCharges are set
    const totals = calculateTotals();
    handleCustomerChange(filteredData.supplierName);
  };
  cashDetails.Amount=netAmount;

  const [bankDetails, setBankDetails] = useState({
    Amount: "",
    selectBankType: "",
    transactionDate: "",
    chequeNo: "",
    transactionNo: "",
    Amount: "",
    Advance: "",
    Received: "",
    Balance: "",
  });
  bankDetails.Amount=netAmount

  const calculateBalance = (advance, received, Amount) => {
    const totalAdvanceReceived = parseFloat(advance) + parseFloat(received);
    return (Amount) - totalAdvanceReceived || 0;
  };

  const handleCashDetailsChange = (e) => {
    const { name, value } = e.target;
    const updatedCashDetails = { ...cashDetails, [name]: value };
  
    // If Advance or Received is updated, calculate the Balance
    if (name === "Advance" || name === "Received") {
      updatedCashDetails.Balance = calculateBalance(
        updatedCashDetails.Advance,
        updatedCashDetails.Received,
        updatedCashDetails.Amount
      );
    }
  
    setCashDetails(updatedCashDetails);
  };


  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    const updatedBankDetails = { ...bankDetails, [name]: value };
  
    // If Advance or Received is updated, calculate the Balance
    if (name === "Advance" || name === "Received") {
      updatedBankDetails.Balance = calculateBalance(
        updatedBankDetails.Advance,
        updatedBankDetails.Received,
        updatedBankDetails.Amount
      );
    }
  
    setBankDetails(updatedBankDetails);
  };



  const updateGstType = () => {
    if (company?.state && placeOfSupply) {
      const newGstType = company.state === placeOfSupply ? "CGST/SGST" : "IGST";
      if (gstType !== newGstType) {
        setGstType(newGstType);
        console.log("Updated GST Type to:", newGstType);
      }
    }
  };

  useEffect(() => {
    updateGstType()
  }, [company?.state, placeOfSupply, gstType]);



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create a FormData instance
      const submissionData = new FormData()

      // Append non-file form data to formData
      const fields = {
        date,
        invoiceNo,
        supplierInvoiceNo,
        customerType,
        supplierName: formData.supplierName,
        selectedcash:formData.selectedcash,
        placeOfSupply,
        paymentTerm,
        dueDate,
        receiptDocNo: transportDetails.receiptDocNo,
        dispatchedThrough: transportDetails.dispatchedThrough,
        destination: transportDetails.destination,
        carrierNameAgent: transportDetails.carrierNameAgent,
        billOfLading: transportDetails.billOfLading,
        motorVehicleNo: transportDetails.motorVehicleNo,
        billingAddress,
        reverseCharge,
        gstType,
        otherChargesDescriptions,
        narration: formData.narration,
        grossAmount: grossAmount,
        GstAmount: GstAmount,
        otherCharges: otherCharges,
        netAmount: netAmount,
        userId: userId,
      };

      // Append all fields to formData
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          submissionData.append(key, fields[key])
        }
      })

      // Append each row individually
      rows.forEach((row, index) => {
        Object.keys(row).forEach((key) => {
          submissionData.append(`rows[${index}][${key}]`, row[key])
        })
      })
         // Check if selectedBank exists and append it
         if (formData.selectedBank && formData.selectedBank.length > 0) {
          formData.selectedBank.forEach((selectedBank, index) => {
            Object.keys(selectedBank).forEach((key) => {
              submissionData.append(`selectedBank[${index}][${key}]`, selectedBank[key]);
            });
          });
        }

      if (paymentMethod === 'Cash') {
        submissionData.append('cash', JSON.stringify(cashDetails))
      } else if (paymentMethod === 'Bank') {
        submissionData.append('bank', JSON.stringify(bankDetails))
      }

      // If a document file has been selected, append it to the FormData
      if (documentPath) {
        submissionData.append('documentPath', documentPath)
      }

      // Send the formData using axios
      const response = await axios.post(
        '/api/v1/purchaseInvoiceRoute/createpurchaseinvoice',
        submissionData,
      )

      if (response) {
        toast.success('Purchase invoice created successfully...')
      }

      // Reset your form data and state
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to create sales estimate. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      date: '',
      invoiceNo: '',
      supplierInvoiceNo: '',
      salesType: 'GST Invoice',
      customerType: 'Retailer',
      supplierName: '',
      placeOfSupply: '',
      paymentTerm: '',
      dueDate: '',
      receiptDocNo: '',
      dispatchedThrough: '',
      destination: '',
      carrierNameAgent: '',
      billOfLading: '',
      motorVehicleNo: '',
      billingAddress: '',
      reverseCharge: 'No',
      gstType: 'CGST/SGST',
      rows: [
        {
          itemCode: '',
          productName: '',
          hsnCode: '',
          qty: null,
          units: '',
          mrp: null,
          discount: null,
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalValue: 0,
        },
      ],
      narration: '',
      otherChargesDescriptions: '',
      grossAmount: '',
      GstAmount: '',
      otherCharges: '',
      netAmount: '',
      cash: {},
      bank: {},
    })

    setCashDetails({ amount: '', advance: '', received: '', balance: '' })
    setBankDetails({
      selectBankType: '',
      transactionDate: '',
      chequeNo: '',
      transactionNo: '',
      amount: '',
      advance: '',
      received: '',
      balance: '',
    })

    // Reset additional states as needed...
    setDate('')
    setSelectedCustomer('')
    // Add any other state resets...
  }

  const openViewModal = (suppliers) => {
    setViewModal(true)
  }
  const closeModal = () => {
    setViewModal(false)
  }

  const handlePrintOnly = () => {
    const printWindow = window.open('', '_blank')

    const submissionData = {
      ...formData,
      rows: rows.map((row) => ({
        itemCode: row.itemCode,
        productName: row.productName,
        hsnCode: row.hsnCode,
        qty: row.qty,
        freeQuantity: row.freeQty,
        units: row.units,
        mrp: row.maxmimunRetailPrice,
        discountRs: row.discountRs,
        discountpercent: row.discountpercent,

        UnitsCost: row.unitCost,
        schemeMargin: row.schemeMargin,

        taxableValue: row.taxableValue,
        cgstpercent: row.cgstpercent,
        cgstRS: row.cgstRS,
        sgstpercent: row.sgstpercent,
        sgstRS: row.sgstRS,
        igstpercent: row.igstpercent,
        igstRS: row.igstRS,
        totalValue: row.totalValue,
      })),
      grossAmount: grossAmount.toFixed(2),
      GstAmount: GstAmount.toFixed(2),
      otherCharges: otherCharges,
      otherChargesDescriptions: otherChargesDescriptions,
      salesType,
      customerType,
      reverseCharge,
      gstType,
      netAmount: netAmount,
      cash: paymentMethod === 'Cash' ? cashDetails : {},
      bank: paymentMethod === 'Bank' ? bankDetails : {},
    }
    const renderDetails = () => {
      console.log(formData,"")
      if (formData.selectedcash) {
        return `
         <div class="customer-details">
            <div class="section-header">Customer Details</div>
              <div class="details"> Cash</div>
         </div>
        `;
      } else if (formData?.selectedBank?.length > 0) {
        console.log(formData?.selectedBank,"rahul")
        return `
          <div class="customer-details">
            <div class="section-header">Bank Details</div>
            <div class="details">Bank Name: ${formData.selectedBank[0]?.name}</div>
            <div class="details">IFSC Code: ${formData.selectedBank[0]?.ifscCode}</div>
            <div class="details">Account No: ${formData.selectedBank[0]?.accountNumber}</div>
          </div>
        `;
      } else if (chooseUser) {
        return `
          <div class="customer-details">
            <div class="section-header">Customer Details</div>
            <div class="details">Name: ${chooseUser?.name}</div>
            <div class="details">Address: ${chooseUser?.address}</div>
            <div class="details">Contact: ${chooseUser?.contact}</div>
            <div class="details">GSTIN: ${chooseUser?.gstin}</div>
          </div>
        `;
      }
      return '';
    };
    // Determine the table headers and the corresponding data based on gstType
    function numberToWords(num) {
      const ones = [
        '',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
      ]
      const tens = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
      ]

      function convertToWords(n) {
        if (n < 20) return ones[n]
        if (n < 100)
          return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
        if (n < 1000)
          return (
            ones[Math.floor(n / 100)] +
            ' Hundred' +
            (n % 100 ? ' ' + convertToWords(n % 100) : '')
          )
        if (n < 100000)
          return (
            convertToWords(Math.floor(n / 1000)) +
            ' Thousand' +
            (n % 1000 ? ' ' + convertToWords(n % 1000) : '')
          )
        return ''
      }

      // Split the number into integer and decimal parts
      const parts = num.toString().split('.')

      const integerPart = parseInt(parts[0], 10)
      const decimalPart = parts[1] ? parseInt(parts[1], 10) : 0

      let words = convertToWords(integerPart) + ' Rupees'

      // Handle the decimal part (paise)
      if (decimalPart > 0) {
        words += ' and ' + convertToWords(decimalPart) + ' Paise'
      }

      return words
    }
    const gstHeaders =
      submissionData.gstType === 'CGST/SGST'
        ? `<th>CGST</th><th>SGST</th>`
        : `<th>IGST</th>`

    const paymentModeHTML = submissionData.cash.Amount
      ? `
            <td style="width: 33.33%; text-align: left;">
                <div class="receipt-details">
                    <div class="section-header">Receipt Mode: Cash</div>
                    <div class="details">Total Amount: ₹${submissionData.cash.Amount}</div>
                    <div class="details">Advance Received: ₹${submissionData.cash.Advance}</div>
                    <div class="details">Amount Received: ₹${submissionData.cash.Received}</div>
                    <div class="details">Balance Amount: ₹${submissionData.cash.Balance}</div>
                </div>
            </td>`
      : `
            <td style="width: 33.33%; text-align: left;">
                <div class="receipt-details">
                    <div class="section-header">Receipt Mode: Bank - ${
                      submissionData.bank.selectBankType
                    }</div>
                    <div class="details">Bank Name: ${
                      submissionData.bank.bank
                    }</div>
                    <div class="details">Transaction Date: ${
                      submissionData.bank.transactionDate
                    }</div>
                    <div class="details">Transaction / Cheque No: ${
                      submissionData.bank.transactionNo ||
                      submissionData.bank.chequeNo
                    }</div>
                    <div class="details">Total Amount: ₹${
                      submissionData.bank.Amount
                    }</div>
                    <div class="details">Advance Received: ₹${
                      submissionData.bank.Advance
                    }</div>
                    <div class="details">Amount Received: ₹${
                      submissionData.bank.Received
                    }</div>
                    <div class="details">Balance Amount: ₹${
                      submissionData.bank.Balance
                    }</div>
                </div>
            </td>`

    const gstRows =
      submissionData.gstType === 'CGST/SGST'
        ? submissionData.rows
            .map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
            <td>${row.units}</td>
            <td>${row.qty}</td>
            <td>${row.freeQuantity}</td>
            <td>${row.mrp}</td>
            <td>${row.UnitsCost}</td>
            <td>${row.schemeMargin}</td>
            <td>${row.discountpercent}% ${row.discountRs}</td>
            <td>${row.taxableValue}</td>
            <td>${row.cgstpercent}% ${row.cgstRS}</td>
            <td >${row.sgstpercent}% ${row.sgstRS}</td>
            <td>${row.totalValue}</td>
          </tr>`,
            )
            .join('')
        : submissionData.rows
            .map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
            <td>${row.units}</td>
            <td>${row.qty}</td>
            <td>${row.freeQuantity}</td>
            <td>${row.mrp}</td>
            <td>${row.UnitsCost}</td>
            <td>${row.schemeMargin}</td>
            <td>${row.discountpercent}% ${row.discountRs}</td>
            <td>${row.taxableValue}</td>
            <td>${row.igstpercent}% ${row.igstRS}</td>
            <td>${row.totalValue}</td>
          </tr>`,
            )
            .join('')

    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
            }
            .header, .section-header, .table th {
              color: red;
              font-weight: bold;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              font-size: 24px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              border: 1px solid black;
              padding: 5px;
              text-align: center;
              font-size: 12px;
            }
            .table th {
              background-color: #ff0000; /* Red header */
              color: black;
            }
            .signature {
              text-align: right;
              margin-top: 50px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
        <div class="header">
          
            <div class="business-name"> ${company?.businessName} </div>
              <div> ${company?.address} </div>
              <div>GSTIN: ${company?.gstIn}</div>
            </div>
                <table class="table">
             <tr>
                  <th colspan="100%" style="color: blue; font-size: 24px; font-weight: bold; text-align: center;" class="heades">
                  Gst Invoice
                  </th>
              </tr>


         
            <tr>
              <td style="width: 30%;">
                <div style="text-align:left;" class="customer-details">
                  ${renderDetails()}
                </div>
              </td>
              <td style="width: 30%;">
                <div style="text-align:left;" class="sales-estimate">
                  <div class="section-header"> Invoice Details</div>
                  <div class="details">Invoice No: <span>${
                    submissionData?.invoiceNo
                  }</span></div>
                  <div class="details">Invoice Date: <span>${
                    submissionData?.date
                  }</span></div>
                     <div class="details">Supplier Invoice: <span>${
                       submissionData?.supplierInvoiceNo
                     }</span></div>
                  <div class="details">Place of Supply: <span>${
                    submissionData?.placeOfSupply || company.state
                  }</span></div>
                   <div class="details">Due Date: <span>${
                     submissionData?.dueDate
                   }</span></div>
                 
                </div>
              </td>
              <td style="width: 40%;">
                <div style="text-align:left;" class="transport-details">
                  <div class="section-header">Transport Details</div>
                 
                   

                  <div class="details">Dispatch Through: <span>${
                    submissionData?.dispatchedThrough
                  }</span></div>
                   <div class="details">Destination: <span>${
                     submissionData?.destination
                   }</span></div>
                   <div class="details">Carrier Name/Agent : <span>${
                     submissionData?.carrierNameAgent
                   }</span></div>
                  <div class="details">Bill of Lading/LR-RR No.: <span>${
                    submissionData?.billOfLading
                  }</span></div>
                  
                </div>
              </td>
            </tr>
          </table>
  
          <table class="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Item Code</th>
                <th>Product Name</th>
                <th>HSN Code</th>
                <th>UOM</th>
                <th>QTY</th>
                <th>Free QTY</th>
                <th>MRP</th>
                <th>Unit Cost</th>
                <th>Scheme Margin %</th>
                <th>Disccount</th>
                <th>Taxable Value</th>
                ${gstHeaders}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${gstRows}
            </tbody>
          </table>
       
           <table class="table">
              <tr>
                <td style="width: 33.33%; text-align: left;">
                  <div class="banking-details">
                    <div class="section-header">Banking Details</div>
                      <div class="details">Bank Name: ${
                        company?.bank_name || '-'
                      }</div>
                    <div class="details">IFSC Code: ${
                      company?.ifce_code || '-'
                    }</div>
                    <div class="details">Account No:${
                      company?.accountNumber || '-'
                    }</div>
                    <div class="details">Account Holder Name: ${
                      company?.account_holder_name || '-'
                    }</div>
                    <div class="details">UPI ID: ${company?.upiId || '-'}</div>
                </div>
                  </div>
                </td>
                
                 
                 ${paymentModeHTML}
               
                
               
                <td style="width: 33.33%; text-align: left;">
                  <div class="amount-details">
                    <div class="section-header">Amount Details</div>
                    <div class="details">Gross Total: ₹${
                      submissionData.grossAmount
                    }</div>
                    <div class="details">GST Amount: ₹${
                      submissionData.GstAmount
                    }</div>
                    <div class="details">Additional Charges: ₹${
                      submissionData.otherCharges
                    }</div>
                    <div class="details">Net Total: ₹${
                      submissionData.netAmount
                    }</div>
                    <div class="details">Amount in Words:${numberToWords(
                      submissionData.netAmount,
                    )}</div>
                  </div>
                </td>
              </tr>
            </table>
  
            <div style="margin-top:100px" class="mt-10">
                  <div class="section-header">Terms & Condition</div>
                  <div class="details">Your terms and conditions go here...</div>
                </div>
  
          <div  class="signature">
         
          
            <div>For ${company.businessName}</div>
            <div style="margin-top: 20px;">Signature</div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    printWindow.onafterprint = () => {
      printWindow.close() // Close the print window after printing

      // Create a fake event object (optional)
      const dummyEvent = {
        preventDefault: () => {},
      }

      handleSubmit(dummyEvent) // Call handleSubmit with the dummy event
    }

    // Trigger the print dialog
    printWindow.print()
  }

  return (
    <>
      <div
        style={{ backgroundColor: '##FFFFFF' }}
        className="p-4 responsive-container"
      >
        {/* Top Section */}
        <h1 className="text-center font-bold text-3xl  text-black mb-5">
          Purchase Invoice
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg::grid-cols-4 gap-4 mb-4">
          <div>
            <label className="font-bold">
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => {
                  setDate(e.target.value)
                  handleChange(e)
                }}
                className="border p-2 w-full   rounded"
              />
            </label>
          </div>
          <div>
            <label className="font-bold">Invoice No.</label>
            <input
              name="invoiceNo"
              type="text"
              value={invoiceNo} // Bind to local state
              onChange={handleinvoiceNoChange} // Update both local and formData states
              className="border p-2 w-full  rounded"
            />
          </div>

          <div>
            <label className="font-bold">Supplier Invoice No.</label>
            <input
              name="supplierInvoiceNo"
              type="text"
              value={supplierInvoiceNo}
              onChange={handlesupplierInvoiceNoChange}
              className="border p-2 w-full  rounded"
            />
          </div>
        {selectedCustomer&&(
           <div>
           <label className="font-bold">Supplier Name</label>
           <input
             type="text"
             className="w-full p-2 border border-gray-300 rounded"
             value={selectedCustomer}
             onChange={(e) => {
               handleCustomerChange(selectedCustomer)
             }}
             placeholder="Select Supplier or type to add"
           />
         </div>
        )}
          
          {selctedcash && (
            <div>
              <label className="font-bold"> cash</label>

              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={selctedcash}
                onChange={(e) => {
                  // handleCashPayment(selctedcash);
                  handleCashPayment(e.target.value)
                }}
                placeholder="Select Supplier or type to add"
              />
            </div>
          )}

          {selectedBanks[0]?.name && (
            <div>
              <label className="font-bold">Bank</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedBanks[0]?.name}
                onChange={(e) => handleBankChange(selectedBanks[0]?._id)} // Pass the value instead
                placeholder="Select Supplier or type to add"
              />
            </div>
          )}

          <div>
            <label className="font-bold">Place of Supply</label>
            <input
              type="text"
              name="placeOfSupply"
              value={placeOfSupply}
              onChange={handlePlaceOfSupplyChange}
              className="border p-2 w-full  rounded"
            />
          </div>
          <div>
            <label className="font-bold">
              Payment Term (days)
              <input
                type="text"
                name="paymentTerm"
                value={paymentTerm}
                onChange={handlePaymentTermChange}
                className="border p-2 w-full  rounded"
              />
            </label>
          </div>

          <div>
            <label className="font-bold">
              Due Date
              <input
                name="dueDate"
                type="text"
                value={dueDate}
                className="border p-2 w-full text-black rounded"
              />
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-black p-2"
            >
              Transport Details
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
              <h4 className="font-bold mb-4">Transport Details</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label>Dispatched Through</label>
                  <input
                    type="text"
                    value={transportDetails.dispatchedThrough}
                    onChange={(e) =>
                      handleTransportDetailChange(
                        'dispatchedThrough',
                        e.target.value,
                      )
                    }
                    className="border p-2 w-full  rounded"
                  />
                </div>
                <div>
                  <label>Destination</label>
                  <input
                    type="text"
                    value={transportDetails.destination}
                    onChange={(e) =>
                      handleTransportDetailChange('destination', e.target.value)
                    }
                    className="border p-2 w-full  rounded"
                  />
                </div>
                <div>
                  <label>Carrier Name/Agent</label>
                  <input
                    type="text"
                    value={transportDetails.carrierNameAgent}
                    onChange={(e) =>
                      handleTransportDetailChange(
                        'carrierNameAgent',
                        e.target.value,
                      )
                    }
                    className="border p-2 w-full  rounded"
                  />
                </div>
                <div>
                  <label>Bill of Lading/LR-RR No.</label>
                  <input
                    type="text"
                    value={transportDetails.billOfLading}
                    onChange={(e) =>
                      handleTransportDetailChange(
                        'billOfLading',
                        e.target.value,
                      )
                    }
                    className="border p-2 w-full  rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-black p-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-500 text-black p-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="mb-4">
            <label className="font-bold">Billing Address</label>
            <textarea
              name="billingAddress"
              value={billingAddress}
              onChange={handleBillingAddressChange}
              className="border p-2 w-full  rounded"
            />
          </div>
          {/* Reverse Charge Section */}
          <div className="mb-4 w-full">
            <label className="font-bold">Reverse Charge</label>
            <select
              value={reverseCharge}
              onChange={handleReverseChargeChange}
              className="border p-2 w-full  rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Items Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-x-auto">
            <thead>
              <tr>
                <th className="border p-1">#</th>
                <th className="border text-bold text-sm   text-nowrap">
                  Item Code
                </th>
                <th className="border  text-nowrap">Product Name</th>
                <th className="border p-1 text-nowrap">HSN Code</th>
                <th className="border p-1">Qty</th>
                <th className="border p-1">Units</th>
                <th className="border p-1  text-nowrap">Free Qty</th>
                <th className="border p-1">MRP</th>
                <th className="border p-1 text-nowrap">Unit Cost</th>
                <th className="border p-1  text-nowrap">Scheme Margin</th>

                <th className="border p-1  text-nowrap">
                  Discount
                  <div className="flex justify-between">
                    <span className="">%</span> <span>RS</span>
                  </div>
                </th>

                {salesType === 'GST Invoice' && (
                  <>
                    <th className="border p-2  text-nowrap">Taxable Value</th>
                    {gstType === 'CGST/SGST' && (
                      <>
                        <th className="border p-2">
                          CGST{' '}
                          <div className="flex justify-between">
                            <span className="">%</span> <span>RS</span>
                          </div>
                        </th>
                        <th className="border p-2">
                          SGST{' '}
                          <div className="flex justify-between">
                            <span className="">%</span> <span>RS</span>
                          </div>
                        </th>
                      </>
                    )}
                    {gstType === 'IGST' && (
                      <th className="border p-2">
                        IGST{' '}
                        <div className="flex justify-between">
                          <span className="">%</span> <span>RS</span>
                        </div>
                      </th>
                    )}
                  </>
                )}
                <th className="border p-2">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="border p-1">{index + 1}</td>
                  <td className="border">
                    <td className="border p-1">
                      <input
                        type="text"
                        value={rows[index].itemCode} // Bind the input value to itemCode
                        onChange={
                          (e) =>
                            handleRowChange(index, 'itemCode', e.target.value) // Update itemCode in the row
                        }
                        className="w-full" // Full width of the cell
                        placeholder="Enter Item Code" // Optional placeholder
                      />
                    </td>
                  </td>
                  <td className="border ">
                    <td className="border p-1">
                      <input
                        type="text"
                        value={rows[index].productName} // Set the value based on the row's productName
                        onChange={
                          (e) =>
                            handleRowChange(
                              index,
                              'productName',
                              e.target.value,
                            ) // Update the productName using handleRowChange
                        }
                        className="w-full" // Keeping the same class for styling
                        placeholder="Enter Product Name" // Optional placeholder
                      />
                    </td>
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.hsnCode}
                      onChange={(e) =>
                        handleRowChange(index, 'hsnCode', e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.qty}
                      onChange={(e) => handlQtyChange(index, e.target.value)}
                      className="w-full flex-grow"
                      style={{
                        minWidth: "50px", // Set a small minimum width to ensure visibility
                        flexBasis: "50px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.units}
                      onChange={(e) =>
                        handleRowChange(index, 'units', e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.freeQty || ''} // Display freeQty or empty string if undefined
                      onChange={(e) =>
                        handleFreeQtyChange(index, e.target.value)
                      } // Call your handler
                      className="w-full flex-grow"
                      style={{
                        minWidth: '20px',
                        flexBasis: '20px',
                        flexShrink: 1,
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.maxmimunRetailPrice}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          'maxmimunRetailPrice',
                          e.target.value,
                        )
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: '80px',
                        flexBasis: '80px',
                        flexShrink: 1,
                      }}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.unitCost}
                      onChange={(e) =>
                        handleRowChange(index, 'unitCost', e.target.value)
                      }
                      className="w-full"
                    />
                  </td>{' '}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.schemeMargin}
                      onChange={(e) =>
                        handleRowChange(index, 'schemeMargin', e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "20px", // Set a small minimum width to ensure visibility
                        flexBasis: "20px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}                    />
                  </td>
                  <td className="border">
                    <div className="p-1 flex gap-1">
                      <input
                        type="text"
                        value={row.discountpercent}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            'discountpercent',
                            e.target.value,
                          )
                        }
                        className="w-full flex-grow"
                        style={{
                          minWidth: '20px', // Set a small minimum width to ensure visibility
                          flexBasis: '20px', // Allow it to shrink, but still have a base width
                          flexShrink: 1, // Allow it to shrink on mobile
                        }}
                      />
                      <input
                        type="text"
                        value={row.discountRs}
                        onChange={
                          (e) =>
                            handleRowChange(index, 'discountRs', e.target.value) // Fix here
                        }
                        className="w-full flex-grow"
                        style={{
                          minWidth: "70px", // Set a small minimum width to ensure visibility
                          flexBasis: "70px", // Allow it to shrink, but still have a base width
                          flexShrink: 1, // Allow it to shrink on mobile
                        }}                      />
                    </div>
                  </td>
                  {salesType === 'GST Invoice' && (
                    <>
                      {gstType === 'CGST/SGST' && (
                        <>
                          <td className="border p-1">
                            <input
                              type="text"
                              value={row.taxableValue}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  'taxableValue',
                                  e.target.value,
                                )
                              }
                              className="w-full flex-grow"
                              style={{
                                minWidth: '90px',
                                flexBasis: '90px',
                                flexShrink: 1,
                              }}
                            />
                          </td>
                          <td className="border">
                            <div className="p-1 flex gap-1">
                              <input
                                type="text"
                                value={row.cgstpercent}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'cgstpercentercent',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '20px', // Set a small minimum width to ensure visibility
                                  flexBasis: '20px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.cgstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'cgstRS',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '90px', // Set a small minimum width to ensure visibility
                                  flexBasis: '90px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                            </div>
                          </td>
                          <td className="border">
                            <div className="p-1 flex gap-1">
                              <input
                                type="text"
                                value={row.sgstpercent}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'sgstpercentercent',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '20px', // Set a small minimum width to ensure visibility
                                  flexBasis: '20px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.sgstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'sgstRS',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '90px', // Set a small minimum width to ensure visibility
                                  flexBasis: '90px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {gstType === 'IGST' && (
                        <>
                          <td className="border p-1">
                            <input
                              type="text"
                              value={row.taxableValue}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  'taxableValue',
                                  e.target.value,
                                )
                              }
                              className="w-full flex-grow"
                              style={{
                                minWidth: "90px", // Set a small minimum width to ensure visibility
                                flexBasis: "90px", // Allow it to shrink, but still have a base width
                                flexShrink: 1, // Allow it to shrink on mobile
                              }}                            />
                          </td>
                          <td className="border p-1">
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={row.igstpercent}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'igstpercentercent',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '20px', // Set a small minimum width to ensure visibility
                                  flexBasis: '20px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.igstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    'igstRS',
                                    e.target.value,
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: '90px', // Set a small minimum width to ensure visibility
                                  flexBasis: '90px', // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </>
                  )}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.totalValue}
                      onChange={(e) =>
                        handleRowChange(index, 'totalValue', e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: '90px',
                        flexBasis: '90px',
                        flexShrink: 1,
                      }}
                    />
                  </td>
                  <td className="p-1 gap-2 flex">
                    <button
                      onClick={() => removeRow(index)}
                      className="bg-red-500 text-black p-1 mt-2 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addRow}
          className="bg-green-500 text-black p-2 mt-2 rounded hoverbg-green-600 focusoutline-none focusring-2 focusring-green-400 focusring-opacity-50 flex items-center justify-center"
        >
          <svg
            xmlns="http//www.w3.org/2000/svg"
            className="h-4 w-4 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Row
        </button>
        {/* 
        <button
          onClick={() => setIsModalOtherChargesOpen(true)}
          className=" text-blue-800 mt-8 text-md p-2 mt-2 p-2 mt-2 rounded hoverbg-orange-600 focusoutline-none focusring-2 focusring-green-400 focusring-opacity-50 flex items-center justify-center"
        >
          <svg
            xmlns="http//www.w3.org/2000/svg"
            className="h-4 w-4 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Other Charges
        </button>

        <div className="gap-2">
          <label className=" w-1/3 mb-2 text-white mt-8 text-md p-2 mt-2 rounded bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>{" "}
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={(e) => setdocumentPath(e.target.files[0])} // Assuming you have setdocumentPath in your state
            />
          </label>
        </div> */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {/* First button in a div */}
          <div>
            <button
              onClick={() => setIsModalOtherChargesOpen(true)}
              className="w-1/2 text-white text-md p-2 rounded bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Other Charges
            </button>
          </div>

          {/* Second button in a div */}
          <div>
            <label className="w-1/2 text-white text-md p-2 rounded bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>{' '}
              Upload Document
              <input
                type="file"
                className="hidden"
                onChange={(e) => setdocumentPath(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {isModalOtherChargesOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
              <h4 className="font-bold mb-4">Other Charges Details</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="other-charges">Description</label>
                  <input
                    type="text"
                    id="other-charges"
                    value={otherChargesDescriptions} // Ensure this is controlled
                    onChange={(e) =>
                      setOtherChargesDescriptions(e.target.value)
                    } // Ensure change handler updates state
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type="text"
                    value={otherCharges}
                    onChange={(e) => handleOtherChargesChange(e)}
                    placeholder="Enter other charges"
                    className="border p-2 w-full rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOtherChargesOpen(false)}
                  className="bg-gray-500 text-black p-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtherChargesSave}
                  className="bg-gray-500 text-black p-2 mr-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <label className="font-bold">Narration</label>
            <br />
            <textarea
              name="narration"
              value={formData.narration}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  narration: e.target.value,
                }))
              }}
              className=" text-black border p-1 w-full  rounded"
            />
          </div>
          <div className="w-full lg:w-1/3 mt-5">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
                Gross Amount
              </label>
              <input
                value={grossAmount.toFixed(2)}
                // onChange={handleBillingAddressChange}
                className=" text-black border p-1 w-full  rounded lg:w-2/3"
              />
            </div>
            {salesType === 'GST Invoice' && (
              <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
                <label className="font-bold lg:w-1/2 text-nowrap">
                  GST Amount
                </label>
                <input
                  value={GstAmount.toFixed(2)}
                  // onChange={handleBillingAddressChange}
                  className=" text-black border p-1 w-full  rounded lg:w-2/3"
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
                {otherChargesDescriptions || 'Other Charges'}
              </label>
              <input
                value={otherCharges}
                onChange={handleOtherChargesChange}
                className=" text-black border p-1 w-full  rounded lg:w-2/3"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold  lg:w-1/2 text-nowrap">
                Net Amount
              </label>
              <input
                value={Math.round(netAmount).toFixed(2)}
                // onChange={handleBillingAddressChange}
                className=" text-black border p-1 text-2xl w-full font-bold  rounded lg:w-2/3"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => openViewModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Payment
          </button>

          <Modal
            isOpen={viewModal}
            onRequestClose={closeModal}
            contentLabel="View Item Modal"
            style={{
              content: {
                width: '80%',
                height: '90%',
                maxWidth: '800px',
                margin: 'auto',
                padding: '5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
              },
            }}
          >
            <div className="bg-white p-4 rounded shadow-lg w-full relative">
              <button
                onClick={closeModal}
                className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4 text-black">Receipt</h2>

              {/* Radio buttons to select payment method */}
              <div className="gap-5 mb-4">
                <label className="font-bold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    onChange={handlePaymentMethodChange}
                  />
                  Cash
                </label>
                <label className="ml-5 font-bold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank"
                    onChange={handlePaymentMethodChange}
                  />
                  Bank
                </label>
              </div>

              {/* Conditional form rendering based on payment method */}
              <form onSubmit={handleSubmit}>
                {paymentMethod === 'Cash' && (
                  <>
                    <label className="font-bold">Amount</label>
                    <input
                      type="text"
                      name="Amount"
                      value={cashDetails.Amount || netAmount} // Show netAmount as default
                      onChange={handleCashDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                    <label className="font-bold">Advance</label>
                    <input
                      type="text"
                      name="Advance"
                      value={cashDetails.Advance}
                      onChange={handleCashDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                    <label className="font-bold">Received</label>
                    <input
                      type="text"
                      name="Received"
                      value={cashDetails.Received}
                      onChange={handleCashDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                    <label className="font-bold">Balance</label>
                    <input
                      type="text"
                      name="Balance"
                      value={
                        cashDetails.Amount
                          ? cashDetails.Amount -
                            cashDetails.Advance -
                            cashDetails.Received
                          : netAmount -
                            cashDetails.Advance -
                            cashDetails.Received // Balance = Amount - (Advance + Received)
                      }
                      onChange={handleCashDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                  </>
                )}

                {paymentMethod === 'Bank' && (
                  <>
                    <label className="font-bold">Select Bank</label>
                    <select
                      name="bank"
                      value={bankDetails.bank}
                      onChange={handleBankDetailsChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value="">Select Bank</option>
                      <option value="Bank 1">Bank 1</option>
                      <option value="Bank 2">Bank 2</option>
                    </select>
                    <select
                      name="subPaymentType"
                      value={subPaymentType}
                      onChange={handleSubPaymentTypeChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value="">Select Payment Type</option>
                      <option value="Online">Online</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                    {subPaymentType === 'Online' && (
                      <>
                        <label className="font-bold">Transaction Date</label>
                        <input
                          type="date"
                          name="transactionDate"
                          value={bankDetails.transactionDate}
                          onChange={handleBankDetailsChange}
                          className="border p-2 mb-2 w-full"
                        />
                        <label className="font-bold">Transaction No</label>
                        <input
                          type="text"
                          name="transactionNo"
                          value={bankDetails.transactionNo}
                          onChange={handleBankDetailsChange}
                          className="border p-2 mb-2 w-full"
                        />
                      </>
                    )}
                    {subPaymentType === 'Cheque' && (
                      <>
                        <label className="font-bold">Transaction Date</label>
                        <input
                          type="date"
                          name="transactionDate"
                          value={bankDetails.transactionDate}
                          onChange={handleBankDetailsChange}
                          className="border p-2 mb-2 w-full"
                        />
                        <label className="font-bold">Cheque No</label>
                        <input
                          type="text"
                          name="chequeNo"
                          value={bankDetails.chequeNo}
                          onChange={handleBankDetailsChange}
                          className="border p-2 mb-2 w-full"
                        />
                      </>
                    )}
                    <label className="font-bold">Amount</label>
                    <input
                      type="text"
                      name="Amount"
                      value={bankDetails.Amount || netAmount} // Show netAmount as default
                      onChange={handleBankDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                    <label className="font-bold">Advance</label>
                    <input
                      type="text"
                      name="Advance"
                      value={bankDetails.Advance}
                      onChange={handleBankDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />
                    <label className="font-bold">Received</label>
                    <input
                      type="text"
                      name="Received"
                      value={bankDetails.Received}
                      onChange={handleBankDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />{' '}
                    <label className="font-bold">Balance</label>
                    <input
                      type="text"
                      name="Balance"
                      value={
                        bankDetails.Amount
                          ? bankDetails.Amount -
                            bankDetails.Advance -
                            bankDetails.Received
                          : netAmount -
                            bankDetails.Advance -
                            bankDetails.Received
                      }
                      onChange={handleBankDetailsChange}
                      className="border p-2 mb-2 w-full"
                    />{' '}
                  </>
                )}

                {/* Submit button */}
                <div className="flex justify-center items-center">
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 h-10"
                    onClick={closeModal}
                  >
                    save
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>

        {/* Buttons for saving and printing */}
        <div className="mt-8 flex justify-center">
          <button
            // onClick={}
            className="bg-blue-500 pl-4 pr-4 hoverbg-sky-700  text-black p-2 mr-2"
            onClick={handleSubmit}
          >
            Save
          </button>
          {salesType === 'GST Invoice' && (
            <button
              onClick={handlePrintOnly}
              className="bg-blue-700 pl-4 pr-4 hover:bg-sky-700 text-black p-2"
            >
              Save and Print
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default OrderPurchaseInvoice
