import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const ManageBrand = () => {
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
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
    fetchBrand();
  }, [auth,userId]);

  const fetchBrand = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getBrand/${userId}`);
      setBrand(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openViewModal = (brand) => {
    setSelectedBrand(brand);
    setViewModal(true);
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setEditModal(true);
  };

  const closeModals = () => {
    setViewModal(false);
    setEditModal(false);
    setSelectedBrand(null);
  };

  const deleteBrand = async (id) => {
    try {
      await axios.delete(`/api/v1/auth/deleteBrand/${id}`);
      toast.success("Brand deleted successfully");
      fetchBrand();
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log(`/api/v1/auth/updateBrand/${selectedBrand._id}`)
    try {
      await axios.put(`/api/v1/auth/updtaeBrand/${selectedBrand._id}`, {
        BrandName: selectedBrand.BrandName,
        manufacturerName: selectedBrand.manufacturerName
      });
      toast.success("Brand updated successfully");
      fetchBrand();
      closeModals();
    } catch (error) {
      toast.error("Failed to update brand");
    }
  };

  return (
    <div className="responsive-container w-full movie-container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold text-purple-600 mb-4 underline">
        Manage Brand
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">S.No</th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">Manufacturer Name</th>
              <th className="px-6 py-2 border-r text-left text-sm font-medium text-gray-600">Brand Name</th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {brand?.length > 0 ? (
              brand.map((brand, index) => (
                <tr key={brand._id} className="border-b">
                  <td className="px-6 py-2 border-r text-sm">{index + 1}</td>
                  <td className="px-6 py-2 border-r text-sm">{brand.manufacturerName || "NA"}</td>
                  <td className="px-6 py-2 border-r text-sm">{brand.BrandName}</td>
                  <td className="px-6 py-2 border-r text-sm">
                    <button className="mx-1 text-blue-600" onClick={() => openViewModal(brand)}>View</button> /
                    <button className="mx-1 text-blue-600" onClick={() => openEditModal(brand)}>Edit</button> /
                    <button className="mx-1 text-blue-600" onClick={() => deleteBrand(brand._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-2 text-center text-sm">No brand found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />

      {/* View Modal */}
      <Modal isOpen={viewModal} onRequestClose={closeModals} contentLabel="View Brand Modal" style={{ content: { width: "50%", height: "50%", margin: "auto", padding: "20px", borderRadius: "8px" } }}>
        <div>
          <h2 className="text-xl font-bold mb-4">View Brand</h2>
          {selectedBrand && (
            <div>
              <p><strong>Brand Name:</strong> {selectedBrand.BrandName}</p>
              <p><strong>Manufacturer Name:</strong> {selectedBrand.manufacturerName}</p>
            </div>
          )}
          <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded" onClick={closeModals}>Close</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onRequestClose={closeModals} contentLabel="Edit Brand Modal" style={{ content: { width: "50%", height: "50%", margin: "auto", padding: "20px", borderRadius: "8px" } }}>
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Brand</h2>
          {selectedBrand && (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border rounded-md" value={selectedBrand.BrandName} onChange={(e) => setSelectedBrand({ ...selectedBrand, BrandName: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Manufacturer Name</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border rounded-md" value={selectedBrand.manufacturerName} onChange={(e) => setSelectedBrand({ ...selectedBrand, manufacturerName: e.target.value })} required />
              </div>
              <div className="flex justify-end mt-4">
                <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded mr-2" onClick={closeModals}>Close</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageBrand;
