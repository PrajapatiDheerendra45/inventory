import React, { useState, useEffect } from "react";
import ViewSalesInvoiceModal from "../modals/ViewSalesInvoiceModal";
import EditSalesInvoiceModal from "../modals/EditSalesInvoiceModal";
import Modal from "react-modal";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdRateReview, MdDelete } from "react-icons/md";
import { useAuth } from "../../../context/Auth";
const ManageSalesInvoice = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [salesEstimates, setSalesEstimates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchEstimate();
    fetchCustomers();
  }, [auth,userId]);

  const fetchEstimate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`
      );
      setSalesEstimates(response.data.response);

    } catch (error) {
      setError("Error fetching sales estimates.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (estimate) => {
    setSelectedEstimate(estimate);
    setViewModalOpen(true);
  };

  const handleEdit = (estimate) => {
    setSelectedEstimate(estimate);
    setEditModalOpen(true);
  };

  const handleDelete = async (estimateId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setLoading(true);
      try {
        await axios.delete(
          `/api/v1/salesInvoiceRoute/deletesalesinvoice/${estimateId}`
        );
        fetchEstimate();
      } catch (error) {
        setError("Error deleting the sales invoice.");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers?.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  const closeModal = () => {
    setEditModalOpen(false);
    setViewModalOpen(false);
    fetchEstimate();
  };

  // Filter sales estimates based on search term
  const filteredEstimates = salesEstimates?.filter((estimate) => {
    const invoiceNo = estimate.InvoiceNo
      ? estimate.InvoiceNo.toLowerCase()
      : "";
    const customerName = estimate.customerName
      ? estimate.customerName.toLowerCase()
      : "";
    return (
      invoiceNo.includes(searchTerm.toLowerCase()) ||
      customerName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="responsive-container p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Invoice number, Customer Name"
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300 bg-gray-100 text-black rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                {[
                  "No.",
                  "Date",
                  "Invoice No.",
                  "Sales Type",
                  "Customer Name",
                  "Place of Supply",
                
                  "GST Type",
                  "Product Name",

                  "UOM",
                  "MRP",
                  "QTY",
                  // "Rate",
                  "Net Amount",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEstimates?.length > 0 ? (
                filteredEstimates?.map((estimate, index) => (
                  <tr
                    key={estimate._id}
                    className="hover:bg-gray-200 transition-all"
                  >
                    <td className="border border-gray-300 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2 text-center whitespace-nowrap">
                      {estimate.date}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.InvoiceNo}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.salesType}
                    </td>
                
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.customerName || estimate?.selctedcash || estimate.selectedBank[0]?.name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.placeOfSupply || "N/A"}
                    </td>
                 

                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.gstType}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.rows?.[0]?.productName || "-"}
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.rows?.[0]?.units || "-"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.rows?.[0]?.mrp || "-"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.rows?.[0]?.qty || "-"}
                    </td>

                    {/* <td className="border border-gray-300 p-2 text-center">
            {estimate.rows?.[0]?.rate || "-"}
          </td> */}
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.netAmount || "-"}
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-blue-500 hover:underline focus:outline-none"
                          onClick={() => handleView(estimate)}
                        >
                           <MdRateReview className="text-xl" />
                        </button>
                        <button
                          className="text-yellow-500 hover:underline focus:outline-none "
                          onClick={() => handleEdit(estimate)}
                        >
                         <FiEdit className="text-xl" />
                        </button>
                        <button
                          className="text-red-500 hover:underline focus:outline-none"
                          onClick={() => handleDelete(estimate._id)}
                        >
                           <MdDelete className="text-xl" />
                        </button>
                      
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="17"
                    className="text-center p-4 border border-gray-300"
                  >
                    No sales invoice found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Estimate Modal */}
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Estimate Modal"
        style={{
          content: {
            width: "90%",
            height: "100%",
            maxWidth: "1400px",
            margin: "auto",
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
          },
        }}
      >
        <ViewSalesInvoiceModal
          isOpen={viewModalOpen}
          closeModal={closeModal}
          estimate={selectedEstimate}
         
        />
      </Modal>

      {/* Edit Estimate Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Estimate Modal"
        style={{
          content: {
            width: "90%",
            height: "100%",
            maxWidth: "1400px",
            margin: "auto",
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
          },
        }}
      >
        <EditSalesInvoiceModal
          isOpen={editModalOpen}
          estimate={selectedEstimate}
          closeModal={closeModal}
          getCustomerName={getCustomerName}
        />
      </Modal>
    </div>
  );
};

export default ManageSalesInvoice;
