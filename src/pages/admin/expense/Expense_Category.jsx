// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import {
//     Search,
//     Plus,
//     Edit,
//     Trash2,
//     Folder,
//     AlertCircle,
//     Loader2,
//     X,
// } from "lucide-react";
// import styles from "./Expense.module.css";

// export default function Expense_Category() {
//     const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//     const companyId = ebillingData?.selectedCompany?.id;
//     const token = ebillingData?.accessToken;

//     // State
//     const [categories, setCategories] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);

//     // Form
//     const [form, setForm] = useState({
//         categoryName: "",
//     });

//     // Fetch categories
//     const fetchCategories = async () => {
//         if (!companyId || !token) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get(
//                 `${config.BASE_URL}/company/${companyId}/expenses-categories`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setCategories(res.data || []);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to load expense categories.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (companyId && token) fetchCategories();
//     }, [companyId, token]);

//     // Open modal for create/edit
//     const openModal = (category = null) => {
//         setEditingCategory(category);
//         setForm({
//             categoryName: category?.categoryName || "",
//         });
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingCategory(null);
//         setForm({ categoryName: "" });
//     };

//     // Handle submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!companyId || !token) return;
//         if (!form.categoryName.trim()) {
//             setError("Category name cannot be empty.");
//             return;
//         }

//         setLoading(true);
//         try {
//             if (editingCategory) {
//                 // Update
//                 await axios.put(
//                     `${config.BASE_URL}/expenses-category/${editingCategory.expensesCategoryId}`,
//                     { categoryName: form.categoryName },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             } else {
//                 // Create
//                 await axios.post(
//                     `${config.BASE_URL}/company/${companyId}/create/expenses-category`,
//                     { categoryName: form.categoryName },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             }
//             fetchCategories();
//             closeModal();
//         } catch (err) {
//             setError(err.response?.data?.message || "Operation failed.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete category
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this category?")) return;
//         setLoading(true);
//         try {
//             await axios.delete(`${config.BASE_URL}/expenses-category/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             fetchCategories();
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete category.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filtered list
//     const filteredCategories = categories.filter((c) =>
//         c.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className={styles.container}>
//             {/* Header */}
//             <div className={styles.header}>
//                 <div>
//                     <h1 className={styles.title}>Expense Categories</h1>
//                     <p className={styles.subtitle}>Organize and manage expense categories</p>
//                 </div>
//                 <button
//                     onClick={() => openModal()}
//                     className={styles.createBtn}
//                     disabled={loading}
//                 >
//                     <Plus size={18} />
//                     Add Category
//                 </button>
//             </div>

//             {/* Search */}
//             <div className={styles.searchWrapper}>
//                 <Search className={styles.searchIcon} size={18} />
//                 <input
//                     type="text"
//                     placeholder="Search by category name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className={styles.searchInput}
//                     disabled={loading}
//                 />
//             </div>

//             {/* Loading */}
//             {loading && (
//                 <div className={styles.loading}>
//                     <Loader2 className={styles.spinner} size={40} />
//                     <p>Loading categories...</p>
//                 </div>
//             )}

//             {/* Error */}
//             {error && (
//                 <div className={styles.error}>
//                     <AlertCircle size={18} />
//                     {error}
//                 </div>
//             )}

//             {/* Empty State */}
//             {!loading && !error && filteredCategories.length === 0 && (
//                 <div className={styles.empty}>
//                     <Folder size={60} className={styles.emptyIcon} />
//                     <p>No categories found</p>
//                     <p className={styles.emptySub}>Click "Add Category" to create one</p>
//                 </div>
//             )}

//             {/* Desktop Table */}
//             {!loading && !error && filteredCategories.length > 0 && (
//                 <div className={styles.tableContainer}>
//                     <table className={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Category Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredCategories.map((cat) => (
//                                 <tr key={cat.expensesCategoryId}>
//                                     <td>{cat.categoryName || "—"}</td>
//                                     <td className={styles.actionsCell}>
//                                         <button
//                                             onClick={() => openModal(cat)}
//                                             className={styles.editBtn}
//                                             disabled={loading}
//                                             aria-label="Edit"
//                                         >
//                                             <Edit size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(cat.expensesCategoryId)}
//                                             className={styles.deleteBtn}
//                                             disabled={loading}
//                                             aria-label="Delete"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Mobile Cards */}
//             <div className={styles.cards}>
//                 {filteredCategories.map((cat) => (
//                     <div key={cat.expensesCategoryId} className={styles.card}>
//                         <div className={styles.cardHeader}>
//                             <h3 className={styles.cardTitle}>{cat.categoryName || "Unnamed"}</h3>
//                         </div>
//                         <div className={styles.cardFooter}>
//                             <button onClick={() => openModal(cat)} className={styles.cardEdit}>
//                                 <Edit size={16} /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(cat.expensesCategoryId)}
//                                 className={styles.cardDelete}
//                             >
//                                 <Trash2 size={16} /> Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className={styles.modalOverlay} onClick={closeModal}>
//                     <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//                         <div className={styles.modalHeader}>
//                             <h2>{editingCategory ? "Edit" : "Add"} Category</h2>
//                             <button onClick={closeModal} className={styles.closeBtn}>
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className={styles.modalForm}>
//                             <div className={styles.formGroup}>
//                                 <label>Category Name *</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     value={form.categoryName}
//                                     onChange={(e) =>
//                                         setForm({ ...form, categoryName: e.target.value })
//                                     }
//                                     placeholder="e.g., Office Supplies"
//                                 />
//                             </div>

//                             <div className={styles.modalActions}>
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     className={styles.cancelBtn}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className={styles.submitBtn}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <Loader2 size={16} className={styles.spinner} />
//                                     ) : (
//                                         "Save"
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }









// src/pages/expenses/Expense_Category.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css"; // <-- same file as SalesList
import { toast } from "react-toastify";

import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Folder,
  X,
  Loader,
  ChevronDown,
} from "lucide-react";

export default function Expense_Category() {
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  // ────── State ──────
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form
  const [form, setForm] = useState({ categoryName: "" });

  // ────── Fetch categories (unchanged) ──────
  const fetchCategories = async () => {
    if (!companyId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expenses-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expense categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId && token) fetchCategories();
  }, [companyId, token]);

  // ────── Modal ──────
  const openModal = (category = null) => {
    setEditingCategory(category);
    setForm({ categoryName: category?.categoryName || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({ categoryName: "" });
  };

  // ────── Submit (create / update) ──────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId || !token) return;
    if (!form.categoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        await axios.put(
          `${config.BASE_URL}/expenses-category/${editingCategory.expensesCategoryId}`,
          { categoryName: form.categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category updated");
      } else {
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/create/expenses-category`,
          { categoryName: form.categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category created");
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // ────── Delete ──────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    try {
      await axios.delete(`${config.BASE_URL}/expenses-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((c) => c.expensesCategoryId !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  // ────── Filter ──────
  const filteredCategories = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles["company-form-container"]}>
      {/* ────── Header ────── */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Expense Categories</h1>
            <p className={styles["form-subtitle"]}>
              Organize and manage expense categories
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* ────── Search ────── */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by category name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* ────── Loading ────── */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading categories...</p>
        </div>
      )}

      {/* ────── Table / Cards ────── */}
      {filteredCategories.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.expensesCategoryId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>
                        {cat.categoryName || "—"}
                      </span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => openModal(cat)}
                        className={`${styles["action-button"]} ${styles["edit-button"]}`}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.expensesCategoryId)}
                        className={`${styles["action-button"]} ${styles["delete-button"]}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles["mobile-cards-container"]}>
            {filteredCategories.map((cat) => (
              <div key={cat.expensesCategoryId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>
                      {cat.categoryName || "Unnamed"}
                    </h3>
                  </div>
                  <button
                    onClick={() => openModal(cat)}
                    className={styles["card-action-button"]}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Name:</span>
                    <span className={styles["info-value"]}>
                      {cat.categoryName || "—"}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button
                    onClick={() => openModal(cat)}
                    className={styles["card-view-button"]}
                  >
                    <Edit2 size={16} />
                    Edit Category
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ────── Empty State ────── */
        <div className={styles["no-data"]}>
          <Folder size={48} />
          <p>No categories found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm
              ? "Try adjusting your search"
              : 'Click "Add Category" to create your first one.'}
          </p>
        </div>
      )}

      {/* ────── CREATE / EDIT MODAL ────── */}
      {isModalOpen && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>{editingCategory ? "Edit" : "Add"} Category</h3>
              </div>
              <button
                className={styles["close-modal-btn"]}
                onClick={closeModal}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles["payment-form"]}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    Category Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.categoryName}
                    onChange={(e) =>
                      setForm({ ...form, categoryName: e.target.value })
                    }
                    className={styles["form-input"]}
                    placeholder="e.g., Office Supplies"
                  />
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles["cancel-button"]}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles["submit-button"]}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className={styles["button-spinner"]} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Folder size={16} />
                      Save Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}