import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "../../../context/Auth.js";
const CreateDeliveryChallan = () => {
  const [date, setDate] = useState("");
  const [challanNo, setchallanNo] = useState("");
  const [salesType, setSalesType] = useState("GST Invoice");
  const [customerType, setCustomerType] = useState("Retailer");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const [banks, setBanks] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [cash, setCash] = useState("");
  const [transportDetails, setTransportDetails] = useState({
    receiptDocNo: "",
    dispatchedThrough: "",
    destination: "",
    carrierNameAgent: "",
    billOfLading: "",
    motorVehicleNo: "",
  });
  const [billingAddress, setBillingAddress] = useState("");
  const [reverseCharge, setReverseCharge] = useState("No");
  const [gstType, setGstType] = useState("CGST/SGST");
  const [rows, setRows] = useState([]);
  const [paymentTerm, setPaymentTerm] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);

  const [customer, setCustomer] = useState([]);
  const [company, setCompanyData] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [chooseUser, setChooseUser] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    challanNo: "",
    salesType: "",
    customerType: "",
    customerName: "",
    cash: "",
    selectedBanks: [],
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
    reverseCharge: "",
    gstType: "",

    rows: [
      {
        itemCode: "",
        productName: "",
        hsnCode: "",
        qty: null,
        uom: null,
        mrp: null,
        discount: null,
        cgst: null,
        sgst: null,
        igst: null,
        totalValue: null,
      },
    ],

    narration: "",
    otherChargesDescriptions: "",
    grossAmount: "",
    GstAmount: "",
    otherCharges: "",
    netAmount: "",
  });

  const [otherChargesDescriptions, setOtherChargesDescriptions] = useState("");

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        setUserId(auth.user._id);
      } else if (auth.user.role === 0) {
        setUserId(auth.user.admin);
      }
    }

    fetchProducts();
    fetchCustomer();
    companyData();
  }, [auth, userId]);

  const companyData = async () => {
    try {
      const response = await axios.get(`/api/v1/company/get/${userId}`);
      console.log("response", response);
      setCompanyData(response.data.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);

      setCustomer(response.data.data);
    } catch (error) {
      console.error("Error fetching Customers:", error);
    }
  };

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);

    const selectedCustomerData = customer?.find((cust) => cust._id === value);

    setChooseUser(selectedCustomerData);
    setFormData((prev) => ({
      ...prev,
      customerName: selectedCustomerData ? selectedCustomerData.name : "",
      placeOfSupply: selectedCustomerData ? selectedCustomerData.state : "",
    }));

    setPlaceOfSupply(selectedCustomerData ? selectedCustomerData.state : "");
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
    console.log(value, "cash");
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
    console.log(selectedBank, "selectedBank");

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
      otherCharges: otherCharges.toFixed(2),
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

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOtherChargesOpen, setIsModalOtherChargesOpen] = useState(false);

  const handlechallanNoChange = (e) => {
    const value = e.target.value;
    setchallanNo(value);
    setFormData((prev) => ({
      ...prev,
      challanNo: value,
    }));
  };
  const handleSalesTypeChange = (e) => {
    const value = e.target.value;
    setSalesType(value);
    setFormData((prev) => ({
      ...prev,
      salesType: value,
    }));
  };
  const handleCustomerTypeChange = (e) => {
    const value = e.target.value;
    setCustomerType(value);
    setFormData((prev) => ({
      ...prev,
      customerType: value,
    }));
  };

  const handlePlaceOfSupplyChange = (e) => {
    const value = e.target.value;
    setPlaceOfSupply(value);
    setFormData((prev) => ({
      ...prev,
      placeOfSupply: value,
    }));
  };

  const handleBillingAddressChange = (e) => {
    const value = e.target.value;
    setBillingAddress(value);
    setFormData((prev) => ({
      ...prev,
      billingAddress: value,
    }));
  };
  const handleReverseChargeChange = (e) => {
    const value = e.target.value;
    setReverseCharge(value);
    setFormData((prev) => ({
      ...prev,
      reverseCharge: value,
    }));
  };

  // Function to handle transport detail change
  const handleTransportDetailChange = (field, value) => {
    setTransportDetails((prev) => ({ ...prev, [field]: value }));
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        itemCode: "",
        productName: "",
        hsnCode: "",
        qty: 0,
        unit: "",
        mrp: 0,
        discount: 0,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
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

    rows.forEach((rows) => {
      grossAmount += Number(rows.taxableValue);
      GstAmount +=
        gstType === "CGST/SGST"
          ? Number(rows.cgstrs) + Number(rows.sgstrs)
          : Number(rows.igstrs);
    });

    let netAmount;

    // Check if otherChargesDescriptions includes "discount"

    if (salesType === "Bill of Supply") {
      if (otherChargesDescriptions.includes("discount")) {
        netAmount = grossAmount - otherCharges; // Do not add GstAmount
      } else {
        netAmount = grossAmount + otherCharges; // Do not add GstAmount
      }
    } else {
      if (otherChargesDescriptions.includes("discount")) {
        netAmount = grossAmount + GstAmount - otherCharges;
      } else {
        netAmount = grossAmount + GstAmount + otherCharges;
      }
    }
    return { grossAmount, GstAmount, netAmount };
  };

  const { grossAmount, GstAmount, netAmount } = calculateTotals();

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userId}`);

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
  const handleRowChange = (index, field, value) => {
    // Create a copy of rows
    const newRows = [...rows];

    // Update the changed field with the new value
    newRows[index] = { ...newRows[index], [field]: value };

    // Check if the product is selected
    const selectedProduct = products.find(
      (product) => product.productName === newRows[index].productName
    );

    if (selectedProduct) {
      // Calculate retail price and apply the discount if applicable
      const retailPrice = selectedProduct.maxmimunRetailPrice
        ? selectedProduct.maxmimunRetailPrice -
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.retailDiscount) /
            100
        : 0;

      // Get sales tax and GST rate
      const salesTaxInclude = selectedProduct.salesTaxInclude;
      const gstRate = selectedProduct.gstRate;

      // Extract the quantity from the updated row
      const { qty } = newRows[index];

      // Calculate taxable value

      console.log(
        salesTaxInclude,
        "salesTaxInclude",
        selectedProduct.retailPrice,
        "rtailprice",
        selectedProduct.gstRate,
        "gstrate"
      );
      const taxableValue = salesTaxInclude
        ? (selectedProduct.retailPrice * qty * 100) /
          (100 + Number(selectedProduct.gstRate))
        : retailPrice * qty;

      // Calculate GST amounts
      const cgstrs =
        gstType === "CGST/SGST" ? (taxableValue * gstRate) / 2 / 100 : 0;
      const sgstrs =
        gstType === "CGST/SGST" ? (taxableValue * gstRate) / 2 / 100 : 0;
      const igstrs = gstType === "IGST" ? (taxableValue * gstRate) / 100 : 0;

      // Calculate total value
      const totalValue = taxableValue + (taxableValue * gstRate) / 100;

      // Update the row with the calculated values
      newRows[index] = {
        ...newRows[index],
        taxableValue: taxableValue.toFixed(2),
        quantity: qty,
        cgstrs: cgstrs.toFixed(2),
        sgstrs: sgstrs.toFixed(2),
        igstrs: igstrs.toFixed(2),
        totalvalue: totalValue.toFixed(2),
      };
      // Set the updated rows state
      setRows(newRows);
      // Trigger total calculation
      calculateTotals(newRows);
    }
  };
  const handlQtyChange = (rowIndex, qty) => {
    // Parse the new quantity to ensure it's a number
    const newQty = parseFloat(qty) || 0;

    // Call handleRowChange to update the row with the new quantity
    handleRowChange(rowIndex, "qty", newQty);
  };
  const handleProductSelect = (rowIndex, selectedProductName) => {
    const selectedProduct = products.find(
      (product) => product.productName === selectedProductName
    );

    if (selectedProduct) {
      const updatedRows = [...rows];

      // Calculate retail price
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      // Determine if sales tax is included from the fetched product data
      const salesTaxInclude = selectedProduct.salesTaxInclude;

      // Calculate taxable value based on salesTaxInclude

      const taxableValue = salesTaxInclude
        ? (selectedProduct.retailPrice * selectedProduct.quantity * 100) /
          (100 + Number(selectedProduct.gstRate))
        : retailPrice * selectedProduct.quantity;
      // Update the row with the new values
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        productName: selectedProduct.productName,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        quantity: selectedProduct.quantity,
        wholesalerDiscount: selectedProduct.wholesalerDiscount,
        wholeselerDiscountRS:
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.wholesalerDiscount) /
          100,
        retailDiscount: selectedProduct.retailDiscount,
        retailDiscountRS:
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.retailDiscount) /
          100,
        expiryDate: selectedProduct.expiryDate,
        batchNo: selectedProduct.batchNo,
        // taxable value based on salesTaxInclude
        taxableValue: taxableValue,

        cgstp: selectedProduct.gstRate / 2,
        sgstp: selectedProduct.gstRate / 2,
        igstp: selectedProduct.gstRate,

        cgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstrs: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalvalue: (
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
      const updatedRows = [...rows];

      // Calculate retail price and taxable value based on the product details
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      const taxableValue = selectedProduct.salesTaxInclude
        ? (retailPrice * selectedProduct.quantity * 100) /
          (100 + selectedProduct.gstRate)
        : retailPrice * selectedProduct.quantity;

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        productName: selectedProduct.productName,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        quantity: selectedProduct.quantity,
        wholesalerDiscount: selectedProduct.wholesalerDiscount,
        wholeselerDiscountRS: (
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.wholesalerDiscount) /
          100
        ).toFixed(2),
        retailDiscount: selectedProduct.retailDiscount,
        retailDiscountRS: (
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.retailDiscount) /
          100
        ).toFixed(2),

        expiryDate: selectedProduct.expiryDate,
        batchNo: selectedProduct.batchNo,
        taxableValue: taxableValue,
        cgstp: selectedProduct.gstRate / 2,
        sgstp: selectedProduct.gstRate / 2,
        igstp: selectedProduct.gstRate,

        cgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstrs: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalvalue: (
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
      const updatedFormData = {
        ...formData,
        rows: rows?.map((row) => ({
          itemCode: row.itemCode,
          productName: row.productName,
          hsnCode: row.hsnCode,
          qty: row.quantity,
          units: row.unit,
          mrp: row.maxmimunRetailPrice,

          discountpercent:
            customerType === "Wholesaler"
              ? row.wholesalerDiscount
              : row.retailDiscount,
          discountRS:
            customerType === "Wholesaler"
              ? row.wholeselerDiscountRS
              : row.retailDiscountRS,

          taxable: row.taxableValue,
          cgstpercent: row.cgstp,
          cgstRS: row.cgstrs,
          sgstpercent: row.sgstp,
          sgstRS: row.sgstrs,
          igstpercent: row.igstp,
          igstRS: row.igstrs,
          totalValue: row.totalvalue,
        })),
        grossAmount: grossAmount,
        GstAmount: GstAmount,
        otherCharges: otherCharges.toFixed(2),
        otherChargesDescriptions: otherChargesDescriptions,
        salesType,
        customerType,
        reverseCharge,
        gstType,
        netAmount: netAmount,
        userId: userId,
      };
      const response = await axios.post(
        "/api/v1/deliveryChallanRoute/createchallan",
        updatedFormData
      );
      if (response) {
        toast.success("delivery challan created successfully...");
      }
      setFormData({
        date: "",
        challanNo: "",
        salesType: "",
        customerType: "",
        customerName: "",
        cash: "",
        selectedBanks: [],
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
        reverseCharge: "",
        gstType: "",
        rows: [
          {
            itemCode: "",
            productName: "",
            hsnCode: "",
            qty: null,
            uom: null,
            mrp: null,
            discount: null,
            cgst: null,
            sgst: null,
            igst: null,
            totalValue: null,
          },
        ],
        narration: "",
        otherChargesDescriptions: "",
        grossAmount: "",
        GstAmount: "",
        otherCharges: "",
        netAmount: "",
      });

      // Clear other independent states
      setDate("");
      setchallanNo("");
      setSalesType("GST Invoice");
      setCustomerType("Retailer");
      setPlaceOfSupply("");
      setDueDate("");
      setTransportDetails({
        receiptDocNo: "",
        dispatchedThrough: "",
        destination: "",
        carrierNameAgent: "",
        billOfLading: "",
        motorVehicleNo: "",
      });
      setBillingAddress("");
      setReverseCharge("No");
      setGstType("CGST/SGST");
      setRows([]);
      setPaymentTerm(0);
      setOtherCharges(0);
      setOtherChargesDescriptions("");

      setSelectedCustomer("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create delivery challan. Please try again.");
    }
  };

  const handlePrintOnly = () => {
    const printWindow = window.open("", "_blank");
    const renderDetails = () => {
      if (formData.cash) {
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
    const updatedFormData = {
      ...formData,
      rows: rows?.map((row) => ({
        itemCode: row.itemCode,
        productName: row.productName,
        hsnCode: row.hsnCode,
        qty: row.quantity,
        units: row.unit,
        mrp: row.maxmimunRetailPrice,
        discountpercent:
          customerType === "Wholesaler"
            ? row.wholesalerDiscount
            : row.retailDiscount,
        discountRS:
          customerType === "Wholesaler"
            ? row.wholeselerDiscountRS
            : row.retailDiscountRS,
        taxable: row.taxableValue,
        cgstpercent: row.cgstp,
        cgstRS: row.cgstrs,
        sgstpercent: row.sgstp,
        sgstRS: row.sgstrs,
        igstpercent: row.igstp,
        igstRS: row.igstrs,
        totalValue: row.totalvalue,
      })),
      grossAmount: grossAmount,
      GstAmount: GstAmount,
      otherCharges: otherCharges.toFixed(2),
      otherChargesDescriptions: otherChargesDescriptions,
      salesType,
      customerType,
      reverseCharge,
      gstType,
      netAmount: netAmount,
    };
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
            ?.map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
            <td>${row.qty}</td>
            <td>${row.units}</td>
            <td>${row.mrp}</td>
            <td>${row.discountpercent}% ${row.discountRS}</td>
            <td>${row.taxable}</td>
            <td>${row.cgstpercent}% ${row.cgstRS}</td>
            <td >${row.sgstpercent}% ${row.sgstRS}</td>
            <td>${row.totalValue}</td>
          </tr>`
            )
            .join("")
        : updatedFormData.rows
            ?.map(
              (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.itemCode}</td>
            <td>${row.productName}</td>
            <td>${row.hsnCode}</td>
            <td>${row.qty}</td>
            <td>${row.units}</td>
            <td>${row.mrp}</td>
            <td>${row.discountpercent}% ${row.discountRS}</td>
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
          
            <div class="business-name"> ${
              company?.businessName || "----------"
            } </div>
              <div> ${company?.address || "---------"} </div>
              <div>GSTIN: ${company?.gstIn || "---------"}</div>
            </div>
                <table class="table">
             <tr>
                  <th colspan="100%" style="color: blue; font-size: 24px; font-weight: bold; text-align: center;" class="heades">
                  Delivery Challan
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
                  <div class="section-header"> Challan Details</div>
                  <div class="details">Challan No: <span>${
                    updatedFormData.challanNo
                  }</span></div>
                  <div class="details">Challan Date: <span>${
                    updatedFormData.date
                  }</span></div>
                  <div class="details">Place of Supply: <span>${
                    updatedFormData.placeOfSupply || company.state
                  }</span></div>
                   <div class="details">Due Date: <span>${
                     updatedFormData.dueDate
                   }</span></div>
                </div>
              </td>
              <td style="width: 40%;">
                <div style="text-align:left;" class="transport-details">
                  <div class="section-header">Transport Details</div>
                 
                  <div class="details">Dispatch Through: <span>${
                    updatedFormData.dispatchedThrough
                  }</span></div>
                   <div class="details">Destination: <span>${
                     updatedFormData.destination
                   }</span></div>
                   <div class="details">Carrier Name/Agent : <span>${
                     updatedFormData.carrierNameAgent
                   }</span></div>
                  <div class="details">Bill of Lading/LR-RR No.: <span>${
                    updatedFormData.billOfLading
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
                <th>QTY</th>
                <th>UOM</th>
                <th>MRP</th>
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
                      company?.bank_name || "-"
                    }</div>
                    <div class="details">IFSC Code: ${
                      company?.ifce_code || "-"
                    }</div>
                    <div class="details">Account No:${
                      company?.accountNumber || "-"
                    }</div>
                    <div class="details">Account Holder Name: ${
                      company?.account_holder_name || "-"
                    }</div>
                    <div class="details">UPI ID: ${company?.upiId || "-"}</div>
                  </div>
                </td>
             
                <td style="width: 33.33%; text-align: left;">
                  <div class="amount-details">
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
                    <div class="details">Amount in Words:${numberToWords(
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
         
          
            <div>For ${company.businessName}</div>
            <div style="margin-top: 20px;">Signature</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Set the onafterprint event before calling print()
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

  const handlePrintOnlyWithoutGST = () => {
    const printWindow = window.open("", "_blank");

    const updatedFormData = {
      ...formData,
      rows: rows?.map((row) => ({
        itemCode: row.itemCode,
        productName: row.productName,
        hsnCode: row.hsnCode,
        qty: row.quantity,
        units: row.unit,
        mrp: row.maxmimunRetailPrice,
        discountpercent:
          customerType === "Wholesaler"
            ? row.wholesalerDiscount
            : row.retailDiscount,
        discountRS:
          customerType === "Wholesaler"
            ? row.wholeselerDiscountRS
            : row.retailDiscountRS,
        taxable: row.taxableValue,
        totalValue: row.totalvalue, // GST details removed
      })),
      grossAmount: grossAmount,
      otherCharges: otherCharges.toFixed(2),
      otherChargesDescriptions: otherChargesDescriptions,
      salesType,
      customerType,
      reverseCharge,
      netAmount: netAmount,
    };
    const renderDetails = () => {
      if (formData.cash) {
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
    const gstRows = updatedFormData.rows
      ?.map(
        (row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${row.itemCode}</td>
          <td>${row.productName}</td>
          <td>${row.hsnCode}</td>
          <td>${row.qty}</td>
          <td>${row.units}</td>
          <td>${row.mrp}</td>
          <td>${row.discountpercent}% ${row.discountRS}</td>
          <td>${row.taxable}</td>
          <td>${row.totalValue}</td> <!-- Removed GST related fields -->
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
          
            <div class="business-name"> ${
              company?.businessName || "---------"
            } </div>
              <div> ${company?.address || "---------"} </div>
              <div>GSTIN: ${company?.gstIn || "---------"}</div>
            </div>
          <table class="table">
            <tr>
              <th colspan="100%" style="color: blue; font-size: 24px; font-weight: bold; text-align: center;">
                Delivery Challan
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
                  <div class="section-header">Challan Details</div>
                  <div class="details">Challan No: <span>${
                    updatedFormData.challanNo
                  }</span></div>
                  <div class="details">Challan Date: <span>${
                    updatedFormData.date
                  }</span></div>
                  <div class="details">Place of Supply: <span>${
                    updatedFormData.placeOfSupply || company.state
                  }</span></div>
                  <div class="details">Due Date: <span>${
                    updatedFormData.dueDate
                  }</span></div>
                </div>
              </td>
              <td style="width: 40%;">
                <div style="text-align:left;" class="transport-details">
                  <div class="section-header">Transport Details</div>
                  <div class="details">Dispatch Through: <span>${
                    updatedFormData.dispatchedThrough
                  }</span></div>
                  <div class="details">Destination: <span>${
                    updatedFormData.destination
                  }</span></div>
                  <div class="details">Carrier Name/Agent: <span>${
                    updatedFormData.carrierNameAgent
                  }</span></div>
                  <div class="details">Bill of Lading/LR-RR No.: <span>${
                    updatedFormData.billOfLading
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
                <th>QTY</th>
                <th>UOM</th>
                <th>MRP</th>
                <th>Discount</th>
                <th>Taxable Value</th>
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
                   company?.bank_name || "-"
                 }</div>
                    <div class="details">IFSC Code: ${
                      company?.ifce_code || "-"
                    }</div>
                    <div class="details">Account No:${
                      company?.accountNumber || "-"
                    }</div>
                    <div class="details">Account Holder Name: ${
                      company?.account_holder_name || "-"
                    }</div>
                    <div class="details">UPI ID: ${company?.upiId || "-"}</div>
                </div>
              </td>
              <td style="width: 33.33%; text-align: left;">
                <div class="amount-details">
                  <div class="section-header">Amount Details</div>
                  <div class="details">Gross Total: ₹${
                    updatedFormData.grossAmount
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
  
          <div class="signature">
            <div>For ${company.businessName}</div>
            <div style="margin-top: 20px;">Signature</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Set the onafterprint event before calling print()
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
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchBanks();
  }, [auth, userId]);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageBank/${userId}`);
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching Bank data", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#FFFFFF" }}
        className="p-4 responsive-container"
      >
        {/* Top Section */}
        <h1 className="text-center font-bold text-3xl  text-black mb-5">
          Create Delivery Challan
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg::grid-cols-4 gap-4 mb-4">
          <div>
            <label className="font-bold">
              Date:
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
            <label className="font-bold">Challan No.</label>
            <input
              name="challanNo"
              type="text"
              value={challanNo} // Bind to local state
              onChange={handlechallanNoChange} // Update both local and formData states
              className="border p-2 w-full  rounded"
            />
          </div>
          <div>
            <label className="font-bold">Sales Type</label>
            <select
              value={salesType}
              onChange={handleSalesTypeChange}
              className="border p-2 w-full  rounded"
            >
              <option value="GST Invoice">GST Invoice</option>
              <option value="Bill of Supply">Bill of Supply</option>
            </select>
          </div>
          <div>
            <label className="font-bold">Customer Type</label>
            <select
              value={customerType}
              onChange={handleCustomerTypeChange}
              className="border p-2 w-full  rounded"
            >
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler</option>
            </select>
          </div>
          <div>
            <label className="font-bold">Customer Name</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedValue} // This ensures the selected value is shown in the dropdown
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedValue(selectedValue); // Update the state to reflect the selected value

                if (selectedValue === "add-new-customer") {
                  window.location.href = "/admin/CreateCustomer";
                } else if (selectedValue === "add-new-bank") {
                  window.location.href = "/admin/addbank";
                } else if (selectedValue === "cash") {
                  handleCashPayment(selectedValue); // Handle cash payment
                } else if (selectedValue.startsWith("bank-")) {
                  handleBankChange(selectedValue.replace("bank-", "")); // Handle bank change
                } else {
                  handleCustomerChange(e); // Handle customer change
                }
              }}
            >
              {/* Customer Options */}
              <optgroup label="Customers">
                {customer?.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
                <option value="add-new-customer" className="text-blue-500">
                  + Add New Customer
                </option>
              </optgroup>
              {/* Bank Options */}
              <optgroup label="Banks">
                {banks?.map((bank) => (
                  <option key={bank._id} value={`bank-${bank._id}`}>
                    {bank.name}
                  </option>
                ))}
                <option value="cash" className="text-green-500">
                  Cash
                </option>
                {/* Uncomment if you need the Add New Bank option */}
                {/* <option value="add-new-bank" className="text-blue-500">
      + Add New Bank
    </option> */}
              </optgroup>
            </select>
          </div>

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
              Payment Term (days):
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
          <div className="">
            <label className="font-bold">Billing Address</label>
            <textarea
              value={billingAddress}
              onChange={handleBillingAddressChange}
              className="border p-2 w-full  rounded"
            />
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
                        "dispatchedThrough",
                        e.target.value
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
                      handleTransportDetailChange("destination", e.target.value)
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
                        "carrierNameAgent",
                        e.target.value
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
                        "billOfLading",
                        e.target.value
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
        <div className="mb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-black p-2 rounded"
          >
            Transport Details
          </button>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

          {/* Reverse Charge Section */}

        {/* GST Type Section */}
        {/* {salesType === "GST Invoice" && (
            <div className="mb-4 w-full">
              <label className="font-bold">GST Type:</label>
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
        {/* </div>  */}

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
                <th className="border p-1">MRP</th>
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
                      value={rows[index]?.qty || ""}
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
                      value={row.unit}
                      onChange={(e) =>
                        handleRowChange(index, "unit", e.target.value)
                      }
                      className="w-full"
                    />
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
                        minWidth: "80px", // Set a small minimum width to ensure visibility
                        flexBasis: "80px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}
                    />
                  </td>

                  <td className="border">
                    {customerType === "Wholesaler" && (
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          value={row.wholesalerDiscount}
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
                          value={row.wholeselerDiscountRS}
                          onChange={(e) =>
                            handleRowChange(index, "discountRS", e.target.value)
                          }
                          className="w-full flex-grow"
                          style={{
                            minWidth: "50px", // Set a small minimum width to ensure visibility
                            flexBasis: "50px", // Allow it to shrink, but still have a base width
                            flexShrink: 1, // Allow it to shrink on mobile
                          }}                        />
                      </div>
                    )}
                    {customerType === "Retailer" && (
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          value={row.retailDiscount}
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
                          value={row.retailDiscountRS}
                          onChange={(e) =>
                            handleRowChange(index, "discountRS", e.target.value)
                          }
                          className="w-full flex-grow"
                          style={{
                            minWidth: "50px", // Set a small minimum width to ensure visibility
                            flexBasis: "50px", // Allow it to shrink, but still have a base width
                            flexShrink: 1, // Allow it to shrink on mobile
                          }}                        />
                      </div>
                    )}
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
                                minWidth: "90px",
                                flexBasis: "90px",
                                flexShrink: 1,
                              }}
                            />
                          </td>
                          <td className="border">
                            <div className="p-1 flex gap-1">
                              <input
                                type="text"
                                value={row.cgstp}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "cgstpercent",
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
                                value={row.cgstrs}
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
                                value={row.sgstp}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "sgstpercent",
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
                                value={row.sgstrs}
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
                                minWidth: "90px", // Set a small minimum width to ensure visibility
                                flexBasis: "90px", // Allow it to shrink, but still have a base width
                                flexShrink: 1, // Allow it to shrink on mobile
                              }}                            />
                          </td>
                          <td className="border p-1">
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={row.igstp}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "igstpercent",
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
                                value={row.igstrs}
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
                      value={row.totalvalue}
                      onChange={(e) =>
                        handleRowChange(index, "totalValue", e.target.value)
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "90px",
                        flexBasis: "90px",
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
        <div className="flex justify-between">
          <div>
            {" "}
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
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setIsModalOtherChargesOpen(true)}
              className=" bg-blue-500 text-black p-2 mt-2 rounded hoverbg-green-600 focusoutline-none focusring-2 focusring-green-400 focusring-opacity-50 flex items-center justify-center"
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
        </div>

        {isModalOtherChargesOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
              <h4 className="font-bold mb-4">Other Charges Details</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="other-charges">
                    Other Charges Description
                  </label>
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
                  <label>Other Charges</label>
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
              placeholder="Enter Narration"
              className="bg-white text-black border p-1 w-full  rounded"
            />
          </div>
          <div className="w-full lg:w-1/3 mt-5">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
                Gross Amount
              </label>
              <input
                value={grossAmount.toLocaleString()}
                // onChange={handleBillingAddressChange}
                className="bg-white text-black border p-1 w-full  rounded lg:w-2/3"
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
                  className="bg-white text-black border p-1 w-full  rounded lg:w-2/3"
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
                Other Charge
              </label>
              <input
                value={otherCharges.toFixed(2)}
                onChange={handleOtherChargesChange}
                className="bg-white text-black border p-1 w-full  rounded lg:w-2/3"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
              <label className="font-bold lg:w-1/2 text-nowrap">
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

        {/* Buttons for saving and printing */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-blue-500 pl-4 pr-4 hoverbg-sky-700  text-black p-2 mr-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
          {salesType === "GST Invoice" && (
            <button
              onClick={handlePrintOnly}
              className="bg-blue-700 pl-4 pr-4 hover:bg-sky-700 text-black p-2 rounded"
            >
              Save and Print
            </button>
          )}
          {salesType !== "GST Invoice" && (
            <button
              onClick={handlePrintOnlyWithoutGST}
              className="bg-blue-700 pl-4 pr-4 hover:bg-sky-700 text-black p-2 rounded"
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

export default CreateDeliveryChallan;
