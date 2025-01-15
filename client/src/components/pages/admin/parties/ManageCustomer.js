import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import CustomerViewModal from "../../admin/modals/CustomerViewModal";
import CustomerEditModal from "../../admin/modals/CustomerEditModal";
   
  const ManageCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [auth]=useAuth();
  const [userId,setUserId]=useState("")

  const navigate = useNavigate();

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      console.log("res",response)
      setCustomer(response?.data?.data);
    } catch (error) {
      console.error("Error fetching Customer data", error);
    }
  };

  useEffect(() => {
    if(auth.user.role===1){
      setUserId(auth.user._id)
    
    }
    if(auth.user.role===0){
      setUserId(auth.user.admin)
     
    }
    fetchCustomer();
  }, [auth,userId]);

  const deleteCustomer = async (_id) => {
    try {
      const response = await axios.delete(`/api/v1/auth/deleteCustomer/${_id}`);
      setCustomer(customer?.filter((supplier) => supplier._id !== _id));

      if (response) {
        toast.success(" delete all data Successfully...");
      } else {
        toast.error("error while deleting...");
      }
    } catch (error) {
      console.log("Error deleting supplier data", error);
    }
  };

  const openViewModal = (Customer) => {
    setViewModal(true);
    setModalData(Customer);
  };

  const openEditModal = (Customer) => {
    setEditModal(true);
    setModalData(Customer);
  };

  const closeModal = () => {
    fetchCustomer();
    setViewModal(false);
    setEditModal(false);
  };

  // Filter Customer based on search query
  const filteredCustomer = customer?.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="container mx-auto p-4 responsive-container">
      <h1 className="text-center text-2xl font-bold text-purple-600 mb-4 underline">
        Manage Customer
      </h1>
      {/* Search input */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border border-gray-300 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/CreateCustomer")}
        >
          Add Customer
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                S.No
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Name
              </th>

              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                State
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Contact
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Registration Type
              </th>

              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                GSTIN
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Opening Balance
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomer?.length > 0 ? (
              filteredCustomer?.map((supplier, index) => (
                <tr key={supplier.id} className="border-b">
                  <td className="px-6 py-2 border-r text-sm">{index + 1}</td>
                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.name}
                  </td>

                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.address}
                  </td>
                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.state}
                  </td>
                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.contact}
                  </td>

                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.registrationType}
                  </td>
                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.gstin}
                  </td>
                  <td className="px-6 py-2 border-r text-sm">
                    {supplier.openingBalance}
                  </td>
                  <td className="px-6 py-2 border-r text-sm">
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => openViewModal(supplier)}
                    >
                      View
                    </button>{" "}
                    /
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => openEditModal(supplier)}
                    >
                      Edit
                    </button>{" "}
                    /
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => deleteCustomer(supplier._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-2 text-center text-sm">
                  No Customer found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Modal
          isOpen={viewModal}
          onRequestClose={closeModal}
          contentLabel="View Item Modal"
          style={{
            content: {
              width: "80%",
              height: "80%",
              maxWidth: "800px",
              margin: "auto",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
            },
          }}
        >
          <CustomerViewModal closeModal={closeModal} CustomerData={modalData} />
        </Modal>

        <Modal
          isOpen={editModal}
          onRequestClose={closeModal}
          contentLabel="View Item Modal"
          style={{
            content: {
              width: "80%",
              height: "80%",
              maxWidth: "800px",
              margin: "auto",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
            },
          }}
        >
          <CustomerEditModal closeModal={closeModal} CustomerData={modalData} />
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageCustomer;
