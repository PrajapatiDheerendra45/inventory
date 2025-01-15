import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const ManageStockUnit = () => {
  const [stockUnits, setStockUnits] = useState([]);
  const [selectedStockUnit, setSelectedStockUnit] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");

  useEffect(() => {
     if (auth.user.role === 1) {
       setUserId(auth.user._id);
     }
     if (auth.user.role === 0) {
       setUserId(auth.user.admin);
     }
    fetchStockUnits();
  }, [auth,userId]);

  const fetchStockUnits = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getStockUnit/${userId}`);
      setStockUnits(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openViewModal = (stockUnit) => {
    setSelectedStockUnit(stockUnit);
    setViewModal(true);
  };

  const openEditModal = (stockUnit) => {
    setSelectedStockUnit(stockUnit);
    setEditModal(true);
  };

  const closeModals = () => {
    setViewModal(false);
    setEditModal(false);
    setSelectedStockUnit(null);
  };

  const deleteStockUnit = async (_id) => {
    try {
      await axios.delete(`/api/v1/auth/deleteStockUnit/${_id}`);
      toast.success("Stock Unit deleted successfully");
      fetchStockUnits();
    } catch (error) {
      toast.error("Failed to delete Stock Unit");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/v1/auth/updtaeStockUnit/${selectedStockUnit._id}`,
        selectedStockUnit
      );
      toast.success("Stock Unit updated successfully");
      fetchStockUnits();
      closeModals();
    } catch (error) {
      toast.error("Failed to update Stock Unit");
    }
  };

  return (
    <div className="container mx-auto p-4 responsive-container">
      <h1 className="text-center text-2xl font-bold text-purple-600 mb-4 underline">
        Manage Stock Units
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                S.No
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Unit of Quantity
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Symbol
              </th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">
                Formal Name
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stockUnits?.length > 0 ? (
              stockUnits?.map((stockUnit, index) => (
                <tr key={stockUnit._id} className="border-b">
                  <td className="px-6 py-2 border-r text-sm">{index + 1}</td>
                  <td className="px-6 py-2 border-r text-sm text-nowrap">
                    {stockUnit.unitofquantity}
                  </td>
                  <td className="px-6 py-2 border-r text-sm text-nowrap">
                    {stockUnit.symbol}
                  </td>
                  
                  <td className="px-6 py-2 border-r text-sm text-nowrap">
                    {stockUnit.formalName}
                  </td>
                  <td className="px-6 py-2 border-r text-sm text-nowrap">
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => openViewModal(stockUnit)}
                    >
                      View
                    </button>{" "}
                    /
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => openEditModal(stockUnit)}
                    >
                      Edit
                    </button>{" "}
                    /
                    <button
                      className="mx-1 text-blue-600"
                      onClick={() => deleteStockUnit(stockUnit._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-2 text-center text-sm">
                  No Stock Units found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />

      {/* View Modal */}
      <Modal
        isOpen={viewModal}
        onRequestClose={closeModals}
        contentLabel="View Stock Unit Modal"
        style={{
          content: {
            width: "50%",
            height: "60%",
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">View Stock Unit</h2>
          {selectedStockUnit && (
            <div>
              <p>
                <strong className="block text-sm font-medium text-gray-700">
                  Symbol
                </strong>
                <span className="mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {selectedStockUnit.symbol}
                </span>
              </p>
              <p>
                <strong className="block text-sm font-medium text-gray-700">
                  Formal Name
                </strong>{" "}
                <span className="mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {selectedStockUnit.formalName}
                </span>
              </p>
              {selectedStockUnit.compoundedType === "compounded" && (
                <>
                  <p>
                    <strong className="block text-sm font-medium text-gray-700">
                      Primary Unit:
                    </strong>{" "}
                    <span className="mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {" "}
                      {selectedStockUnit.primaryUnit}
                    </span>
                  </p>
                  <p>
                    <strong className="block text-sm font-medium text-gray-700">
                      Conversion Of:
                    </strong>{" "}
                    <span className="mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {" "}
                      {selectedStockUnit.conversionOf}
                    </span>
                  </p>
                  <p>
                    <strong className="block text-sm font-medium text-gray-700">
                      Secondary Unit:
                    </strong>{" "}
                    <span className="mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {" "}
                      {selectedStockUnit.secondaryUnit}
                    </span>
                  </p>
                </>
              )}
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={closeModals}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onRequestClose={closeModals}
        contentLabel="Edit Stock Unit Modal"
        style={{
          content: {
            width: "50%",
            height: "65%",
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Stock Unit</h2>
          {selectedStockUnit && (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Symbol
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedStockUnit.symbol}
                  onChange={(e) =>
                    setSelectedStockUnit({
                      ...selectedStockUnit,
                      symbol: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Formal Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedStockUnit.formalName}
                  onChange={(e) =>
                    setSelectedStockUnit({
                      ...selectedStockUnit,
                      formalName: e.target.value,
                    })
                  }
                />
              </div>
              {selectedStockUnit.compoundedType === "compounded" && <>
                <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  primary Unit
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedStockUnit.primaryUnit}
                  onChange={(e) =>
                    setSelectedStockUnit({
                      ...selectedStockUnit,
                      primaryUnit: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Conversion Of
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedStockUnit.conversionOf}
                  onChange={(e) =>
                    setSelectedStockUnit({
                      ...selectedStockUnit,
                      conversionOf: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                 Secondary Unit 
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedStockUnit.secondaryUnit}
                  onChange={(e) =>
                    setSelectedStockUnit({
                      ...selectedStockUnit,
                      secondaryUnit: e.target.value,
                    })
                  }
                />
              </div>
              </>}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded mr-2"
                  onClick={closeModals}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageStockUnit;
