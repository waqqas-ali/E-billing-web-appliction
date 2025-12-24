// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import { toast } from "react-toastify";
// import "./Category.css";

// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>{title}</h3>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>
//         <div className="modal-body">{children}</div>
//       </div>
//     </div>
//   );
// };

// const Category = () => {
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [categoryName, setCategoryName] = useState("");

//   // Fetch all categories
//   const fetchCategories = async () => {
//     if (!companyId || !token) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/categories`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCategories(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [companyId, token]);

//   const openModal = (category = null) => {
//     if (category) {
//       setEditingId(category.categoryId);
//       setCategoryName(category.categoryName);
//     } else {
//       setEditingId(null);
//       setCategoryName("");
//     }
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingId(null);
//     setCategoryName("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!categoryName.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (editingId) {
//         await axios.put(
//           `${config.BASE_URL}/category/${editingId}?categoryName=${encodeURIComponent(
//             categoryName.trim()
//           )}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Category updated!");
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/create/category?categoryName=${encodeURIComponent(
//             categoryName.trim()
//           )}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Category created!");
//       }
//       closeModal();
//       fetchCategories();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     setLoading(true);
//     try {
//       await axios.delete(`${config.BASE_URL}/category/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Category deleted!");
//       fetchCategories();
//     } catch (err) {
//       toast.error("Failed to delete category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter categories
//   const filteredCategories = categories.filter((cat) =>
//     cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (!companyId || !token) {
//     return (
//       <div className="category-container">
//         <p className="error-message">Please login and select a company.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="category-container">
//       <div className="category-header">
//         <h1>Manage Categories</h1>
//         <p>Organize your items by categories</p>
//       </div>

//       {/* Search & Add */}
//       <div className="category-actions-bar">
//         <div className="search-input-group">
//           {/* <span className="search-icon">Search</span> */}
//           <input
//             type="text"
//             placeholder="Search categories..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             aria-label="Search categories"
//           />
//         </div>
//         <button
//           className="btn-primary add-category-btn"
//           onClick={() => openModal()}
//         >
//           <span>+ Add Category</span>
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && <div className="loading-spinner"></div>}

//       {/* Table */}
//       <div className="category-table-wrapper">
//         {filteredCategories.length > 0 ? (
//           <table className="category-table">
//             <thead>
//               <tr>
//                 {/* Serial Number Header */}
//                 <th>No.</th>
//                 <th>Category Name</th>
//                 <th className="table-actions-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCategories.map((cat, index) => (
//                 <tr key={cat.categoryId}>
//                   {/* Serial Number (1-based) */}
//                   <td>{index + 1}</td>

//                   <td>{cat.categoryName}</td>

//                   <td className="actions-cell">
//                     <button
//                       className="btn-action btn-edit"
//                       onClick={() => openModal(cat)}
//                       disabled={loading}
//                       aria-label={`Edit category ${cat.categoryName}`}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn-action btn-delete"
//                       onClick={() => handleDelete(cat.categoryId)}
//                       disabled={loading}
//                       aria-label={`Delete category ${cat.categoryName}`}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="no-data-message">
//             {searchTerm
//               ? "No categories found matching your search."
//               : "No categories yet. Click '+ Add Category' to create one."}
//           </p>
//         )}
//       </div>

//       {/* Modal Form */}
//       <Modal
//         isOpen={modalOpen}
//         onClose={closeModal}
//         title={editingId ? "Edit Category" : "Add New Category"}
//       >
//         <form onSubmit={handleSubmit} className="category-form">
//           <div className="form-group">
//             <label htmlFor="catName">Category Name</label>
//             <input
//               id="catName"
//               type="text"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="e.g., Electronics"
//               required
//               autoFocus
//               aria-required="true"
//             />
//           </div>
//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn-secondary"
//               onClick={closeModal}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : editingId ? "Update" : "Create"}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Category;










"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // Shared API with interceptors
import { toast } from "react-toastify";
import "./Category.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const Category = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Sync userData
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auth check
  useEffect(() => {
    if (!token) {
      toast.info("Please log in to continue.");
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.info("Please select a company first.");
      navigate("/company-list");
      return;
    }
  }, [token, companyId, navigate]);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/company/${companyId}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && companyId) fetchCategories();
  }, [token, companyId]);

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.categoryId);
      setCategoryName(category.categoryName);
    } else {
      setEditingId(null);
      setCategoryName("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setCategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // UPDATE – PUT with query param
        const url = `/category/${editingId}?categoryName=${encodeURIComponent(
          categoryName.trim()
        )}`;
        await api.put(url, {});
        toast.success("Category updated!");
      } else {
        // CREATE – POST with query param
        const url = `/company/${companyId}/create/category?categoryName=${encodeURIComponent(
          categoryName.trim()
        )}`;
        await api.post(url, {});
        toast.success("Category created!");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      await api.delete(`/category/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Manage Categories</h1>
        <p>Organize your items by categories</p>
      </div>

      {/* Search & Add */}
      <div className="category-actions-bar">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search categories"
          />
        </div>
        <button
          className="btn-primary add-category-btn"
          onClick={() => openModal()}
          disabled={loading}
        >
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="loading-spinner"></div>}

      {/* Table */}
      <div className="category-table-wrapper">
        {filteredCategories.length > 0 ? (
          <table className="category-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Category Name</th>
                <th className="table-actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, index) => (
                <tr key={cat.categoryId}>
                  <td>{index + 1}</td>
                  <td>{cat.categoryName}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openModal(cat)}
                      disabled={loading}
                      aria-label={`Edit category ${cat.categoryName}`}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(cat.categoryId)}
                      disabled={loading}
                      aria-label={`Delete category ${cat.categoryName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">
            {searchTerm
              ? "No categories found matching your search."
              : "No categories yet. Click '+ Add Category' to create one."}
          </p>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="catName">Category Name</label>
            <input
              id="catName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Electronics"
              required
              autoFocus
              aria-required="true"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Category;