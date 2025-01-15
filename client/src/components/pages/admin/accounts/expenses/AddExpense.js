import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../context/Auth.js";

const AddExpense = () => {
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
   admin:userId,
    date: "",
    paymentType: "",
    expenseNo: "",
    expenseType: "",
    gstType: "",
    vendor: "",
    expense: "",
    amount: 0,
    gstRate: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    total: 0,
    narration: "",
  });

  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [company, setCompanyData] = useState([]);
  const [chooseUser, setChooseUser] = useState([]);
  const [gstType, setGstType] = useState("CGST/SGST");

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        setUserId(auth.user._id);
      } else if (auth.user.role === 0) {
        setUserId(auth.user.admin);
      }
    }
    fetchVendor();
    companyData();
  }, [auth, userId]);

  const companyData = async () => {
    try {
      const response = await axios.get(`/api/v1/company/get/${userId}`);
      setCompanyData(response.data.data);
      console.log(response, "jsdkjf");
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageVendor/${userId}`);
      setVendor(response.data.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleVendorChange = (e) => {
    const value = e.target.value;
    setSelectedVendor(value);

    const selectedVendorData = vendor.find((cust) => cust._id === value);
    setChooseUser(selectedVendorData);

    if (
      selectedVendorData?.state?.trim().toLowerCase() ===
      company?.state?.trim().toLowerCase()
    ) {
      setGstType("CGST/SGST"); // Set to CGST/SGST when states match
      setFormData({ ...formData, gstType: "cgst-sgst" });
    } else {
      setGstType("IGST"); // Set to IGST when states don't match
      setFormData({ ...formData, gstType: "igst" });
    }
  };

  const calculateGSTAndTotal = (gstType, amount, gstRate) => {
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let total = amount;

    if (gstType === "cgst-sgst") {
      cgstAmount = (amount * gstRate) / 200; // Half of GST rate
      sgstAmount = (amount * gstRate) / 200;
      total = amount + cgstAmount + sgstAmount;
    } else if (gstType === "igst") {
      igstAmount = (amount * gstRate) / 100;
      total = amount + igstAmount;
    }

    return { cgstAmount, sgstAmount, igstAmount, total };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    // Recalculate GST and Total when amount, gstRate, or gstType changes
    if (name === "amount" || name === "gstRate" || name === "gstType") {
      if (formData.expenseType === "GST") {
        const { cgstAmount, sgstAmount, igstAmount, total } =
          calculateGSTAndTotal(
            updatedData.gstType,
            parseFloat(updatedData.amount),
            parseFloat(updatedData.gstRate)
          );
        updatedData.cgstAmount = cgstAmount;
        updatedData.sgstAmount = sgstAmount;
        updatedData.igstAmount = igstAmount;
        updatedData.total = total;
      } else {
        // For Non-GST expenses
        updatedData.cgstAmount = 0;
        updatedData.sgstAmount = 0;
        updatedData.igstAmount = 0;
        updatedData.total = parseFloat(updatedData.amount);
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mock API call to save expense data
      const updatedFormData = {
        ...formData,
       
        userId: userId,
      
      }
      console.log(updatedFormData,"updatedFormData deeru")
      const response = await axios.post(
        "/api/v1/expensesRoute/create",
        updatedFormData,
      
      );
      console.log(response,"res")

      // Reset form after submission
      setFormData({
        date: "",
        expenseNo: "",
        paymentType: "",
        expenseType: "",
        gstType: "",
        vendor: "",
        expense: "",
        amount: 0,
        gstRate: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        total: 0,
        narration: "",
      });

      toast.success("expense created successfully");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Error saving expense");
    }
  };

  return (
    <div className="p-2 flex justify-center responsive-container">
      <div className="p-2 rounded-lg shadow-lg w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Expense</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Expense No.</label>
              <input
                type="text"
                name="expenseNo"
                value={formData.expenseNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Expense Type</label>
              <select
                name="expenseType"
                value={formData.expenseType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Expense Type</option>
                <option value="GST">GST</option>
                <option value="Non GST">Non GST</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Type</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value=""> Payment Type</option>
                <option value="cash">cash</option>
                <option value="bank">bank</option>
              </select>
            </div>
              <div>
                <label className="block font-semibold mb-1">
                  Select Vendor
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedVendor}
                  onChange={handleVendorChange}
                >
                  <option value="">Select Vendor</option>
                  {vendor?.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

            <div>
              <label className="block font-semibold mb-1">Expense</label>
              <input
                type="text"
                name="expense"
                value={formData.expense}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {formData.expenseType === "GST" && (
              <>
                <div>
                  <label className="block font-semibold mb-1">GST Rate</label>
                  <select
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option>Select Gst Rate</option>

                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>

                {formData.gstType === "cgst-sgst" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">
                        CGST Amount
                      </label>
                      <input
                        type="number"
                        name="cgstAmount"
                        value={formData.cgstAmount}
                        className="w-full p-2 border border-gray-300 rounded"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        SGST Amount
                      </label>
                      <input
                        type="number"
                        name="sgstAmount"
                        value={formData.sgstAmount}
                        className="w-full p-2 border border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                  </>
                )}

                {formData.gstType === "igst" && (
                  <div>
                    <label className="block font-semibold mb-1">
                      IGST Amount
                    </label>
                    <input
                      type="number"
                      name="igstAmount"
                      value={formData.igstAmount}
                      className="w-full p-2 border border-gray-300 rounded"
                      readOnly
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block font-semibold mb-1">Total</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                className="w-full p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Narration</label>
              <textarea
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddExpense;
