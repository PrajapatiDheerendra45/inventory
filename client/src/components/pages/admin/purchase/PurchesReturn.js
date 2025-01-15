import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "../../../context/Auth.js";

const PurchesReturn = () => {
  const [documentPath, setdocumentPath] = useState(null);

  const [date, setDate] = useState("");
  const [debitNoteNo, setdebitNoteNo] = useState("");
  const [salesType, setSalesType] = useState("GST Invoice");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [billingAddress, setBillingAddress] = useState("");
  const [selectPurchase, setselectPurchase] = useState("No");
  const [reasonForReturn, setreasonForReturn] = useState("");
  const [qty, setQty] = useState();
  const [gstRatev, setgstRatev] = useState(0);

  const [gstType, setGstType] = useState("CGST/SGST");
  const [rows, setRows] = useState([]);
  const [paymentTerm, setPaymentTerm] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [supplierdebitNoteNo, setsupplierdebitNoteNo] = useState("");

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAddress, setAddress] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [chooseUser, setChooseUser] = useState([]);
  const [company, setCompanyData] = useState([]);
  const [auth] = useAuth();
  const [banks, setBanks] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]); // Array to hold bank data
  const [cash, setCash] = useState("");
  const [userid, setUserId] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    debitNoteNo: "",
    supplierName: "",
    cash: "",
    selectedBank: [],
    paymentTerm: "",
    dueDate: "",
    billingAddress: "",
    selectPurchase: "",
    reasonForReturn: "",
    gstType: "",

    rows: [
      {
        itemCode: "", // Item Code
        productName: "", // Product Name
        hsnCode: "", // HSN Code
        qty: null, // Quantity
        unit: null, // Unit of Measure
        freeQty: null,
        maxmimunRetailPrice: null, // Maximum Retail Price
        unitCost: null, // Unit Cost
        schemeMargin: "", // Scheme Margin
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

    narration: "",
    otherChargesDescriptions: "",
    grossAmount: "",
    GstAmount: "",
    otherCharges: "",
    netAmount: "",
  });

  const [cashDetails, setCashDetails] = useState({
    Amount: "",
    Advance: "",
    Received: "",
    Balance: "",
  });
  const [bankDetails, setBankDetails] = useState({
    bank: "",
    selectBankType: "",
    transactionDate: "",
    chequeNo: "",
    transactionNo: "",
    Amount: "",
    Advance: "",
    Received: "",
    Balance: "",
  });

  const handleCashDetailsChange = (e) => {
    const { name, value } = e.target;
    setCashDetails((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchBanks();
  }, [auth, userid]);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageBank/${userid}`);
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching Bank data", error);
      toast.error(error.response.data.message);
    }
  };
  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value, // Update the corresponding field in bankDetails
    }));
  };

  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const [paymentType, setPaymentType] = useState("");
  const [subPaymentType, setSubPaymentType] = useState("");

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setSubPaymentType(""); // Reset subPaymentType when paymentType changes
  };

  const handleSubPaymentTypeChange = (e) => {
    const { value } = e.target;
    setSubPaymentType(value); // Set the subPaymentType state
    setBankDetails((prev) => ({ ...prev, selectBankType: value })); // Update bankDetails
  };

  const [otherChargesDescriptions, setOtherChargesDescriptions] = useState("");

  const fetchsupplier = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageSupplier/${userid}`);
      setCustomer(response.data.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        setUserId(auth.user._id);
      } else if (auth.user.role === 0) {
        setUserId(auth.user.admin);
      }
    }
    fetchsupplier();
  }, [auth, userid]);
  useEffect(() => {
    const companyData = async () => {
      try {
        const response = await axios.get(`/api/v1/company/get/${userid}`);
        setCompanyData(response.data.data); // Assuming setCompanyData updates the company state
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    companyData(); // Fetch company data on component mount
  }, [userid]); // Empty dependency array ensures this only runs once, on mount

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);

    const selectedCustomerData = customer.find((cust) => cust._id === value);
    setChooseUser(selectedCustomerData);
    setFormData((prev) => ({
      ...prev,
      supplierName: selectedCustomerData ? selectedCustomerData.name : "",
      billingAddress: selectedCustomerData ? selectedCustomerData.address : "",
      placeOfSupply: selectedCustomerData ? selectedCustomerData.state : "",
    }));

    setPlaceOfSupply(selectedCustomerData ? selectedCustomerData.state : "");
    setBillingAddress(selectedCustomerData ? selectedCustomerData.address : "");

    if (
      selectedCustomerData.state.trim().toLowerCase() ===
      company.state.trim().toLowerCase()
    ) {
      setGstType("CGST/SGST");
    } else {
      setGstType("IGST");
    }
  };
  const handleCashPayment = (value) => {
    setCash(value);
    setGstType("CGST/SGST");
    // Update formData with the cash value
    setFormData((prev) => ({
      ...prev,
      cash: value,
    }));
  };
  const handleBankChange = (bankId) => {
    const selectedBank = banks.find((bank) => bank._id === bankId);
    // Update the selected banks
    setSelectedBanks(selectedBank);
    // Update formData with selected bank details
    setFormData((prev) => ({
      ...prev,
      selectedBank: selectedBank ? [selectedBank] : [], // Store as an array if needed
    }));
    // Additional logic for handling bank data
    setGstType("CGST/SGST");
  };
  const handleOtherChargesChange = (event) => {
    const newCharges = parseFloat(event.target.value) || 0;
    setOtherCharges(newCharges);
    setFormData((prev) => ({
      ...prev,
      otherCharges: newCharges,
    }));
  };
  const handleOtherChargesSave = () => {
    setFormData((prev) => ({
      ...prev,
      otherCharges: otherCharges,
      otherChargesDescriptions: otherChargesDescriptions,
    }));
    setIsModalOtherChargesOpen(false);
  };

  useEffect(() => {
    if (date && paymentTerm) {
      const selectedDate = new Date(date);
      selectedDate.setDate(selectedDate.getDate() + parseInt(paymentTerm));

      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = selectedDate.toLocaleString("en-US", { month: "short" });
      const year = selectedDate.getFullYear();
      const formattedDueDate = `${day}-${month}-${year}`;

      setDueDate(formattedDueDate);
      setFormData((prev) => ({
        ...prev,
        dueDate: formattedDueDate, // Update formData with dueDate
      }));
    }
  }, [date, paymentTerm]);

  const handlePaymentTermChange = (e) => {
    const value = e.target.value;
    setPaymentTerm(value);
    setFormData((prev) => ({
      ...prev,
      paymentTerm: value,
    }));
  };

  const [isModalOtherChargesOpen, setIsModalOtherChargesOpen] = useState(false);

  const handledebitNoteNoChange = (e) => {
    const value = e.target.value;
    setdebitNoteNo(value);
    setFormData((prev) => ({
      ...prev,
      debitNoteNo: value,
    }));
  };

  const handleBillingAddressChange = (e) => {
    const value = e.target.value;
    setBillingAddress(selectedAddress);
    setFormData((prev) => ({
      ...prev,
      billingAddress: value,
    }));
  };
  const handleselectPurchaseChange = (e) => {
    const value = e.target.value;
    setselectPurchase(value);
    setFormData((prev) => ({
      ...prev,
      selectPurchase: value,
    }));
  };

  const handleReasonOfreturn = (e) => {
    const value = e.target.value;
    setreasonForReturn(value);
    setFormData((prev) => ({
      ...prev,
      reasonForReturn: value,
    }));
  };

  const handleRowChange = (rowIndex, field, value) => {
    const updatedRows = [...rows]; // Clone the existing rows array
    const currentRow = updatedRows[rowIndex]; // Get the current row
    if (field === "discountpercent") {
      // Calculate discountRs based on discountpercent and maxmimunRetailPrice
      const discountPercent = parseFloat(value) || 0; // Ensure a valid number
      const discountRs = (currentRow.unitCost * discountPercent) / 100; // Calculate discount in Rs

      // Update discount percent, discountRs, and taxable value
      currentRow.discountpercent = discountPercent;
      currentRow.discountRs = discountRs.toFixed(2);

      // Update taxable value based on MRP, discountRs, and quantity

      const unitCost = Number(currentRow.unitCost);
      const discountRS = Number(currentRow.discountRs);

      const qt = Number(qty);
      const taxableValue = (unitCost - discountRS) * qt;
      currentRow.taxableValue = taxableValue.toFixed(2); // Ensure toFixed(2) for consistent format

      // Calculate GST amounts (assuming the GST rate is split into CGST and SGST for intra-state transactions)

      const gstRate = Number(gstRatev) || 0;
      const cgstRS = (taxableValue * (gstRate / 2)) / 100;
      const sgstRS = (taxableValue * (gstRate / 2)) / 100;
      const igstRS = (taxableValue * gstRate) / 100;
      currentRow.cgstRS = cgstRS.toFixed(2);
      currentRow.sgstRS = sgstRS.toFixed(2);
      currentRow.igstRS = igstRS.toFixed(2);
      //dd
      // Update totalValue as taxableValue + GST amount (CGST + SGST or IGST)
      const totalGST =
        currentRow.cgstRS && currentRow.sgstRS ? cgstRS + sgstRS : igstRS;

      currentRow.totalValue = (taxableValue + totalGST).toFixed(2);
    } else if (field === "discountRs") {
      // Calculate discount percentage based on discountRs and maxmimunRetailPrice
      const discountRs = parseFloat(value) || 0;
      const discountPercent = (discountRs / currentRow.unitCost) * 100;

      // Update discount percent, discountRs, and taxable value
      currentRow.discountpercent = discountPercent.toFixed(2);
      currentRow.discountRs = discountRs.toFixed(2);

      // Update taxable value based on MRP, discountRs, and quantity
      const unitCost = Number(currentRow.unitCost);
      const discountRS = Number(currentRow.discountRs);
      const qt = Number(qty);
      const taxableValue = (unitCost - discountRS) * qt;
      // const taxableValue = (currentRow.maxmimunRetailPrice - discountRs) * currentRow.qty;
      currentRow.taxableValue = taxableValue.toFixed(2);
      currentRow.totalValue = (taxableValue + totalGST).toFixed(2);
      // Calculate GST amounts (assuming the GST rate is split into CGST and SGST for intra-state transactions)
      const gstRate = Number(gstRatev) || 0;

      const cgstRS = (taxableValue * (gstRate / 2)) / 100;
      const sgstRS = (taxableValue * (gstRate / 2)) / 100;
      const igstRS = (taxableValue * gstRate) / 100;
      currentRow.quantity = qt;
      currentRow.cgstRS = cgstRS.toFixed(2);
      currentRow.sgstRS = sgstRS.toFixed(2);
      currentRow.igstRS = igstRS.toFixed(2);

      // Update totalValue as taxableValue + GST amount (CGST + SGST or IGST)
      const totalGST =
        currentRow.cgstRS && currentRow.sgstRS ? cgstRS + sgstRS : igstRS;

      currentRow.totalValue = (taxableValue + totalGST).toFixed(2);
    }
    // Update the rows state
    updatedRows[rowIndex] = currentRow;
    setRows(updatedRows);
  };

  const handlQtyChange = (rowIndex, qty) => {
    const updatedRows = [...rows];

    const selectedRow = updatedRows[rowIndex];

    setQty(qty);
    updatedRows[rowIndex] = {
      ...selectedRow,
      qty: qty,
    };

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        itemCode: "",
        productName: "",
        hsnCode: "",
        qty: "",
        unit: "",
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
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    let grossAmount = 0;
    let GstAmount = 0;
    let totalOtherCharges = parseFloat(otherCharges) || 0;

    rows.forEach((row) => {
      const taxableValue = parseFloat(row.taxableValue) || 0;
      const cgstRS = parseFloat(row.cgstRS) || 0;
      const sgstRS = parseFloat(row.sgstRS) || 0;
      const igstRS = parseFloat(row.igstRS) || 0;

      grossAmount += taxableValue;
      GstAmount += cgstRS + sgstRS; // Total GST amount for each row
    });

    let netAmount;
    // Check if otherChargesDescriptions includes "discount" to decide calculation
    if (otherChargesDescriptions.toLowerCase().includes("discount")) {
      netAmount = grossAmount + GstAmount - totalOtherCharges;
    } else {
      netAmount = grossAmount + GstAmount + totalOtherCharges;
    }

    return { grossAmount, GstAmount, netAmount };
  };

  const { grossAmount, GstAmount, netAmount } = calculateTotals();

  // Function to handle Save and Print
  const handleFreeQtyChange = (rowIndex, newFreeQty) => {
    const updatedRows = [...rows];
    const selectedRow = updatedRows[rowIndex];

    // Update the free quantity in the selected row
    const freeQty = parseFloat(newFreeQty) || 0; // Ensure it's a valid number

    // Calculate total quantity using the quantity from the selected row
    const totalQuantity = Number(qty) + freeQty;

    // Calculate schemeMargin only if both freeQty and quantity exist
    const schemeMargin =
      freeQty && qty ? ((freeQty / totalQuantity) * 100).toFixed(2) : 0;

    // Update the row with the new freeQty and schemeMargin
    updatedRows[rowIndex] = {
      ...selectedRow,
      freeQty: freeQty,
      schemeMargin: schemeMargin,
    };

    // Update the state with the modified rows
    setRows(updatedRows);
  };
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userid}`);
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // toast.error("Failed to fetch products. Please try again.");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [auth, userid]);

  const handleProductSelect = (rowIndex, selectedProductName) => {
    const selectedProduct = products.find(
      (product) => product.productName === selectedProductName
    );

    if (selectedProduct) {
      setgstRatev(selectedProduct.gstRate);
      const updatedRows = [...rows];

      // Calculate retail price
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      // Determine if sales tax is included from the fetched product data
      const salesTaxInclude = selectedProduct.salesTaxInclude;

      // Calculate taxable value based on salesTaxInclude
      const taxableValue = 0;

      // Update the row with the new values, schemeMargin is excluded here since it's handled separately
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        productName: selectedProduct.productName,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        // quantity: selectedProduct.quantity,
        expiryDate: selectedProduct.expiryDate,
        batchNo: selectedProduct.batchNo,
        unitCost: selectedProduct.purchasePriceExGst,
        schemeMargin: updatedRows[rowIndex].schemeMargin || 0, // Existing or initial value

        taxableValue: taxableValue,

        cgstpercent: selectedProduct.gstRate / 2,
        sgstpercent: selectedProduct.gstRate / 2,
        igstpercent: selectedProduct.gstRate,
        expiryDate: selectedProduct.expiryDate,
        batchNo: selectedProduct.batchNo,

        cgstRS: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstRS: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstRS: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalValue: (
          taxableValue +
          (taxableValue * selectedProduct.gstRate) / 100
        ).toFixed(2),
      };

      setRows(updatedRows);
    }
  };

  const handleItemCodeSelect = (rowIndex, selectedItemCode) => {
    const selectedProduct = products.find(
      (product) => product.itemCode === selectedItemCode
    );

    if (selectedProduct) {
      setgstRatev(selectedProduct.gstRate);
      const updatedRows = [...rows];

      // Calculate retail price and taxable value based on the product details
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      const taxableValue = 0;

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        productName: selectedProduct.productName,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        // quantity: selectedProduct.quantity,
        expiryDate: selectedProduct.expiryDate,
        batchNo: selectedProduct.batchNo,
        unitCost: selectedProduct.purchasePriceExGst,
        taxableValue: taxableValue,
        cgstpercent: selectedProduct.gstRate / 2,
        sgstpercent: selectedProduct.gstRate / 2,
        igstpercent: selectedProduct.gstRate,

        cgstRS: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstRS: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstRS: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalValue: (
          taxableValue +
          (taxableValue * selectedProduct.gstRate) / 100
        ).toFixed(2),
      };

      setRows(updatedRows);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData instance
      const submissionData = new FormData();

      // Append non-file form data to formData
      const fields = {
        date,
        debitNoteNo,
        supplierdebitNoteNo,
        supplierName: formData.supplierName,
        cash: formData.cash,

        placeOfSupply,
        paymentTerm,
        dueDate,
        reasonForReturn,
        billingAddress,
        selectPurchase,
        gstType,
        otherChargesDescriptions,
        narration: formData.narration,
        grossAmount: grossAmount.toFixed(2),
        GstAmount: GstAmount.toFixed(2),
        otherCharges: otherCharges.toFixed(2),
        userId: userid,
        netAmount: netAmount.toFixed(2),
      };

      // Append all fields to formData
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          submissionData.append(key, fields[key]);
        }
      });

      // Append each row individually
      rows.forEach((row, index) => {
        Object.keys(row).forEach((key) => {
          submissionData.append(`rows[${index}][${key}]`, row[key]);
        });
      });

      if (formData.selectedBank && formData.selectedBank.length > 0) {
        formData.selectedBank.forEach((selectedBank, index) => {
          Object.keys(selectedBank).forEach((key) => {
            submissionData.append(
              `selectedBank[${index}][${key}]`,
              selectedBank[key]
            );
          });
        });
      }

      // If a document file has been selected, append it to the FormData
      if (documentPath) {
        submissionData.append("documentPath", documentPath);
      }

      // Send the formData using axios
      const response = await axios.post(
        "/api/v1/purchesReturnRoute/createpurchasereturn",
        submissionData
      );
      if (response) {
        toast.success("Purchase invoice created successfully...");
      }

      // Reset your form data and state
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create sales estimate. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      debitNoteNo: "",
      supplierdebitNoteNo: "",
      salesType: "GST Invoice",
      supplierName: "",
      placeOfSupply: "",
      paymentTerm: "",
      dueDate: "",
      receiptDocNo: "",
      dispatchedThrough: "",
      destination: "",
      carrierNameAgent: "",
      billOfLading: "",
      motorVehicleNo: "",
      billingAddress: "",
      selectPurchase: "No",
      gstType: "CGST/SGST",
      rows: [
        {
          itemCode: "",
          productName: "",
          hsnCode: "",
          qty: null,
          unit: "",
          mrp: null,
          discount: null,
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalValue: 0,
        },
      ],
      narration: "",
      otherChargesDescriptions: "",
      grossAmount: "",
      GstAmount: "",
      otherCharges: "",
      netAmount: "",
      cash: {},
      bank: {},
    });

    setCashDetails({ amount: "", advance: "", received: "", balance: "" });
    setBankDetails({
      selectBankType: "",
      transactionDate: "",
      chequeNo: "",
      transactionNo: "",
      amount: "",
      advance: "",
      received: "",
      balance: "",
    });

    // Reset additional states as needed...
    setDate("");
    setSelectedCustomer("");
    // Add any other state resets...
  };

  const handlePrintOnly = () => {
    const printWindow = window.open("", "_blank");

    const updatedFormData = {
      ...formData,
      rows: rows?.map((row) => ({
        itemCode: row.itemCode,
        productName: row.productName,
        hsnCode: row.hsnCode,
        qty: row.qty,
        freeQuantity: row.freeQty,
        unit: row.unit,
        mrp: row.maxmimunRetailPrice,
        discountRs: row.discountRs,
        discountpercent: row.discountpercent,

        unitCost: row.unitCost,
        schemeMargin: row.schemeMargin,

        taxable: row.taxableValue,
        cgstpercent: row.cgstpercent,
        cgstRS: row.cgstRS,
        sgstpercent: row.sgstpercent,
        sgstRS: row.sgstRS,
        igstpercent: row.igstpercent,
        igstRS: row.igstRS,
        totalValue: row.totalValue,
      })),
      grossAmount: grossAmount,
      GstAmount: GstAmount,
      otherCharges: otherCharges,
      otherChargesDescriptions: otherChargesDescriptions,
      salesType,

      gstType,
      netAmount: netAmount,
    };
    const renderDetails = () => {
      if (formData?.cash === "cash") {
        return `
         <div class="customer-details">
            <div class="section-header">Customer Details</div>
              <div class="details"> Cash</div>
         </div>
        `;
      } else if (formData?.selectedBank?.length > 0) {
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
      return "";
    };
    // Determine the table headers and the corresponding data based on gstType
    function numberToWords(num) {
      const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];

      function convertToWords(n) {
        if (n < 20) return ones[n];
        if (n < 100)
          return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        if (n < 1000)
          return (
            ones[Math.floor(n / 100)] +
            " Hundred" +
            (n % 100 ? " " + convertToWords(n % 100) : "")
          );
        if (n < 100000)
          return (
            convertToWords(Math.floor(n / 1000)) +
            " Thousand" +
            (n % 1000 ? " " + convertToWords(n % 1000) : "")
          );
        return "";
      }

      // Split the number into integer and decimal parts
      const parts = num.toString().split(".");

      const integerPart = parseInt(parts[0], 10);
      const decimalPart = parts[1] ? parseInt(parts[1], 10) : 0;

      let words = convertToWords(integerPart) + " Rupees";

      // Handle the decimal part (paise)
      if (decimalPart > 0) {
        words += " and " + convertToWords(decimalPart) + " Paise";
      }

      return words;
    }
    const gstHeaders =
      updatedFormData.gstType === "CGST/SGST"
        ? `<th>CGST</th><th>SGST</th>`
        : `<th>IGST</th>`;

    const gstRows =
      updatedFormData.gstType === "CGST/SGST"
        ? updatedFormData.rows
            .map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
              <td>${row.unit}</td>
            <td>${row.qty}</td>
             <td>${row.freeQuantity}</td>
            <td>${row.mrp}</td>
            <td>${row.unitCost}</td>
            <td>${row.schemeMargin}</td>    
            <td>${row.discountpercent}% ${row.discountRS}</td>
            <td>${row.taxable}</td>
            <td>${row.cgstpercent}% ${row.cgstRS}</td>
            <td >${row.sgstpercent}% ${row.sgstRS}</td>
            <td>${row.totalValue}</td>
          </tr>`
            )
            .join("")
        : updatedFormData.rows
            .map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
            <td>${row.unit}</td>
            <td>${row.qty}</td>
             <td>${row.freeQuantity}</td>
            <td>${row.mrp}</td>
            <td>${row.unitCost}</td>
            <td>${row.schemeMargin}</td>
            <td>${row.discountpercent}% ${row.discountRs}</td>
            <td>${row.taxable}</td>
            <td>${row.igstpercent}% ${row.igstRS}</td>
            <td>${row.totalValue}</td>
          </tr>`
            )
            .join("");

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
                  Purchase Return
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
                  <div class="section-header"> Return Details</div>
                  <div class="details"> Note No: <span>${
                    updatedFormData.debitNoteNo
                  }</span></div>
                  <div class="details"> Date: <span>${
                    updatedFormData.date
                  }</span></div>
                  
                  <div class="details">Place of Supply: <span>${
                    updatedFormData?.placeOfSupply || company?.state
                  }</span></div>
                   <div class="details">Reason For Return: <span>${
                     updatedFormData.reasonForReturn
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
       
          <table class="" style="width: 100%;">
              <tr style="height: 100%;">
                <td style="width: 33.33%; vertical-align: bottom; height: 100%; align-item: right;">
                  <div class="amount-details" style="margin-top: 50px; float: right; text-align: left;">
                    <div class="section-header">Amount Details</div>
                    <div class="details">Gross Total: ₹${
                      updatedFormData.grossAmount
                    }</div>
                    <div class="details">GST Amount: ₹${
                      updatedFormData.GstAmount
                    }</div>
                    <div class="details">Additional Charges: ₹${
                      updatedFormData.otherCharges
                    }</div>
                    <div class="details">Net Total: ₹${
                      updatedFormData.netAmount
                    }</div>
                    <div class="details">Amount in Words: ${numberToWords(
                      updatedFormData.netAmount
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
         
          
            <div>For (Business Name)</div>
            <div style="margin-top: 20px;">Signature</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onafterprint = () => {
      printWindow.close(); // Close the print window after printing

      // Create a fake event object (optional)
      const dummyEvent = {
        preventDefault: () => {},
      };

      handleSubmit(dummyEvent); // Call handleSubmit with the dummy event
    };

    // Trigger the print dialog
    printWindow.print();
  };

  return (
    <>
      <div
        style={{ backgroundColor: "##FFFFFF" }}
        className="p-4 responsive-container"
      >
        {/* Top Section */}
        <h1 className="text-center font-bold text-3xl  text-black mb-5">
          Purchase Return
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg::grid-cols-4 gap-4 mb-4">
          <div>
            <label className="font-bold">Supplier Name</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedValue} // Ensure the selected value is shown in the dropdown
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedValue(selectedValue); // Update the state to reflect the selected value

                if (selectedValue === "add-new-supplier") {
                  window.location.href = "/admin/CreateSupplier";
                } else if (selectedValue === "add-new-bank") {
                  window.location.href = "/admin/addbank";
                } else if (selectedValue === "cash") {
                  handleCashPayment(selectedValue); // Handle cash payment
                } else if (selectedValue.startsWith("bank-")) {
                  handleBankChange(selectedValue.replace("bank-", "")); // Handle bank change
                } else {
                  handleCustomerChange(e); // Handle supplier change
                }
              }}
            >
              {/* Supplier options */}
              <optgroup label="Suppliers">
                {customer?.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
                <option value="add-new-supplier" className="text-blue-500">
                  + Add New Supplier
                </option>
              </optgroup>

              {/* Bank options */}
              <optgroup label="Banks">
                {banks?.map((bank) => (
                  <option key={bank._id} value={`bank-${bank._id}`}>
                    {bank.name}
                  </option>
                ))}
                <option value="cash" className="text-green-500">
                  Cash
                </option>
                {/* <option value="add-new-bank" className="text-blue-500">
                  + Add New Bank
                </option> */}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="font-bold">
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => {
                  setDate(e.target.value);
                  handleChange(e);
                }}
                className="border p-2 w-full   rounded"
              />
            </label>
          </div>
          <div>
            <label className="font-bold">Debit Note No.</label>
            <input
              name="debitNoteNo"
              type="text"
              value={debitNoteNo} // Bind to local state
              onChange={handledebitNoteNoChange} // Update both local and formData states
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
          <div className="mb-4 w-full">
            <label className="font-bold">Select Purchase</label>
            <select
              value={selectPurchase}
              onChange={handleselectPurchaseChange}
              className="border p-2 w-full  rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

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

          <div className="mb-4">
            <label className="font-bold">Reason of Return</label>
            <textarea
              name="reasonForReturn"
              value={reasonForReturn}
              onChange={handleReasonOfreturn}
              className="border p-2 w-full  rounded"
            />
          </div>

          {/* GST Type Section
          {salesType === "GST Invoice" && (
            <div className="mb-4 w-full">
              <label className="font-bold">Tax Type:</label>
              <select
                value={gstType}
                onChange={handleGstTypeChange}
                className="border p-2 w-full  rounded"
              >
                <option value="CGST/SGST">CGST/SGST</option>
                <option value="IGST">IGST</option>
              </select>
            </div>
          )} */}
        </div>

        {/* Items Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-x-auto">
            <thead>
              <tr>
                <th className="border p-1">#</th>
                <th className="border text-bold text-sm ">Item Code</th>
                <th className="border ">Product Name</th>
                <th className="border p-1 text-nowrap">HSN Code</th>
                <th className="border p-1">Qty</th>
                <th className="border p-1">unit</th>
                <th className="border p-1">Free Qty</th>
                <th className="border p-1">MRP</th>
                <th className="border p-1">Unit Cost</th>
                <th className="border p-1">Scheme Margin</th>

                <th className="border p-1">
                  Discount
                  <div className="flex justify-between">
                    <span className="">%</span> <span>RS</span>
                  </div>
                </th>

                {salesType === "GST Invoice" && (
                  <>
                    <th className="border p-2">Taxable Value</th>
                    {gstType === "CGST/SGST" && (
                      <>
                        <th className="border p-2">
                          CGST{" "}
                          <div className="flex justify-between">
                            <span className="">%</span> <span>RS</span>
                          </div>
                        </th>
                        <th className="border p-2">
                          SGST{" "}
                          <div className="flex justify-between">
                            <span className="">%</span> <span>RS</span>
                          </div>
                        </th>
                      </>
                    )}
                    {gstType === "IGST" && (
                      <th className="border p-2">
                        IGST{" "}
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
              {rows?.map((row, index) => (
                <tr key={index}>
                  <td className="border p-1">{index + 1}</td>
                  <td className="border">
                    <Select
                      id="itemcode-select"
                      value={
                        rows[index].itemCode
                          ? {
                              label: rows[index].itemCode,
                              value: rows[index].itemCode,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleItemCodeSelect(index, selectedOption.value)
                      }
                      options={products?.map((product) => ({
                        label: product.itemCode,
                        value: product.itemCode,
                      }))}
                      isSearchable={true}
                      placeholder="Select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minWidth: "120px",
                          maxWidth: "300px",
                          fontSize: "14px",
                          minHeight: "34px",
                          height: "34px",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </td>
                  <td className="border ">
                    <Select
                      id="product-select"
                      value={
                        rows[index].productName
                          ? {
                              label: rows[index].productName,
                              value: rows[index].productName,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleProductSelect(index, selectedOption.value)
                      }
                      options={products?.map((product) => ({
                        label: product.productName,
                        value: product.productName,
                      }))}
                      isSearchable={true}
                      placeholder="Select a Product"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minWidth: "200px",
                          maxWidth: "500px",
                          fontSize: "14px",
                          minHeight: "34px",
                          height: "34px",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                    <div style={{ marginTop: "10px", fontSize: "12px" }}>
                      {row.expiryDate && <div>Exp Dt: {row.expiryDate}</div>}
                      {row.batchNo && <div>Batch No: {row.batchNo}</div>}
                    </div>
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.hsnCode}
                      onChange={(e) =>
                        handleRowChange(index, "hsnCode", e.target.value)
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
                      }}
                         />                    
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.unit}
                      onChange={(e) =>
                        handleRowChange(index, "unit", e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "40px", // Set a small minimum width to ensure visibility
                        flexBasis: "40px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.freeQty || ""} // Display freeQty or empty string if undefined
                      onChange={(e) =>
                        handleFreeQtyChange(index, e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "40px", // Set a small minimum width to ensure visibility
                        flexBasis: "40px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.maxmimunRetailPrice}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "maxmimunRetailPrice",
                          e.target.value
                        )
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "80px",
                        flexBasis: "80px",
                        flexShrink: 1,
                      }}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.unitCost}
                      onChange={(e) =>
                        handleRowChange(index, "unitCost", e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "70px", // Set a small minimum width to ensure visibility
                        flexBasis: "70px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}                    />
                  </td>{" "}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.schemeMargin}
                      onChange={(e) =>
                        handleRowChange(index, "schemeMargin", e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "50px", // Set a small minimum width to ensure visibility
                        flexBasis: "50px", // Allow it to shrink, but still have a base width
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
                            "discountpercent",
                            e.target.value
                          )
                        }
                        className="w-full flex-grow"
                        style={{
                          minWidth: "20px", // Set a small minimum width to ensure visibility
                          flexBasis: "20px", // Allow it to shrink, but still have a base width
                          flexShrink: 1, // Allow it to shrink on mobile
                        }}
                      />
                      <input
                        type="text"
                        value={row.discountRs}
                        onChange={
                          (e) =>
                            handleRowChange(index, "discountRs", e.target.value) // Fix here
                        }
                        className="w-full flex-grow"
                        style={{
                          minWidth: "80px", // Set a small minimum width to ensure visibility
                          flexBasis: "80px", // Allow it to shrink, but still have a base width
                          flexShrink: 1, // Allow it to shrink on mobile
                        }}                      />
                    </div>
                  </td>
                  {salesType === "GST Invoice" && (
                    <>
                      {gstType === "CGST/SGST" && (
                        <>
                          <td className="border p-1">
                            <input
                              type="text"
                              value={row.taxableValue}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "taxableValue",
                                  e.target.value
                                )
                              }
                              className="w-full flex-grow"
                              style={{
                                minWidth: "100px",
                                flexBasis: "100px",
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
                                    "cgstpercentercent",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "20px", // Set a small minimum width to ensure visibility
                                  flexBasis: "20px", // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.cgstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "cgstRS",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "90px", // Set a small minimum width to ensure visibility
                                  flexBasis: "90px", // Allow it to shrink, but still have a base width
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
                                    "sgstpercentercent",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "20px", // Set a small minimum width to ensure visibility
                                  flexBasis: "20px", // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.sgstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "sgstRS",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "90px", // Set a small minimum width to ensure visibility
                                  flexBasis: "90px", // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {gstType === "IGST" && (
                        <>
                          <td className="border p-1">
                            <input
                              type="text"
                              value={row.taxableValue}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "taxableValue",
                                  e.target.value
                                )
                              }
                              className="w-full flex-grow"
                              style={{
                                minWidth: "100px", // Set a small minimum width to ensure visibility
                                flexBasis: "100px", // Allow it to shrink, but still have a base width
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
                                    "igstpercentercent",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "20px", // Set a small minimum width to ensure visibility
                                  flexBasis: "20px", // Allow it to shrink, but still have a base width
                                  flexShrink: 1, // Allow it to shrink on mobile
                                }}
                              />
                              <input
                                type="text"
                                value={row.igstRS}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "igstRS",
                                    e.target.value
                                  )
                                }
                                className="w-full flex-grow"
                                style={{
                                  minWidth: "90px", // Set a small minimum width to ensure visibility
                                  flexBasis: "90px", // Allow it to shrink, but still have a base width
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
                        handleRowChange(index, "totalValue", e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "100px",
                        flexBasis: "100px",
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

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <div>
            <button
              onClick={() => setIsModalOtherChargesOpen(true)}
              className="w-1/2 text-white text-md p-2 rounded bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
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
          </div>

          <div className="gap-2">
            <label className="w-1/2 text-white text-md p-2 rounded bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center">
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
                }));
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
                value={grossAmount}
                // onChange={handleBillingAddressChange}
                className=" text-black border p-1 w-full  rounded lg:w-2/3"
              />
            </div>
            {salesType === "GST Invoice" && (
              <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
                <label className="font-bold lg:w-1/2 text-nowrap">
                  GST Amount
                </label>
                <input
                  value={GstAmount}
                  // onChange={handleBillingAddressChange}
                  className=" text-black border p-1 w-full  rounded lg:w-2/3"
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
                {otherChargesDescriptions}
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
                value={Math.round(netAmount)}
                // onChange={handleBillingAddressChange}
                className=" text-black border p-1 text-2xl w-full font-bold  rounded lg:w-2/3"
              />
            </div>
          </div>
        </div>
        {/* Buttons for saving and printing */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-blue-500 pl-4 pr-4 hoverbg-sky-700  text-black p-2 mr-2"
            onClick={handleSubmit}
          >
            Save
          </button>
          {salesType === "GST Invoice" && (
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
  );
};

export default PurchesReturn;
