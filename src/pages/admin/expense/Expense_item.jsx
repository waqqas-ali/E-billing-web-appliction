// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import {
//     Search,
//     Plus,
//     Edit,
//     Trash2,
//     Package,
//     DollarSign,
//     AlertCircle,
//     Loader2,
//     X,
// } from "lucide-react";
// import styles from "./Expense.module.css";

// const Expense_item = () => {
//     const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//     const companyId = ebillingData?.selectedCompany?.id;
//     const token = ebillingData?.accessToken;

//     // State
//     const [items, setItems] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingItem, setEditingItem] = useState(null);

//     // Form state
//     const [form, setForm] = useState({
//         name: "",
//         hsnCode: "",
//         price: "",
//         priceTaxType: "WITHTAX",
//         taxRate: "NONE",
//     });

//     // Fetch all expense items
//     const fetchItems = async () => {
//         if (!companyId || !token) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get(
//                 `${config.BASE_URL}/company/${companyId}/expense-item/list`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setItems(res.data || []);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to load expense items.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (companyId && token) fetchItems();
//     }, [companyId, token]);

//     // Open modal for create/edit
//     const openModal = (item = null) => {
//         setEditingItem(item);
//         setForm(
//             item
//                 ? {
//                     name: item.name || "",
//                     hsnCode: item.hsnCode || "",
//                     price: item.price || "",
//                     priceTaxType: item.priceTaxType || "WITHTAX",
//                     taxRate: item.taxRate || "NONE",
//                 }
//                 : {
//                     name: "",
//                     hsnCode: "",
//                     price: "",
//                     priceTaxType: "WITHTAX",
//                     taxRate: "NONE",
//                 }
//         );
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingItem(null);
//         setForm({
//             name: "",
//             hsnCode: "",
//             price: "",
//             priceTaxType: "WITHTAX",
//             taxRate: "NONE",
//         });
//     };

//     // Handle form submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!companyId || !token) return;

//         setLoading(true);
//         try {
//             if (editingItem) {
//                 // Update
//                 await axios.put(
//                     `${config.BASE_URL}/expense-item/${editingItem.expenseItemId}`,
//                     { ...form, price: parseFloat(form.price) },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             } else {
//                 // Create
//                 await axios.post(
//                     `${config.BASE_URL}/company/${companyId}/create/expense-item`,
//                     { ...form, price: parseFloat(form.price) },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//             }
//             fetchItems();
//             closeModal();
//         } catch (err) {
//             setError(err.response?.data?.message || "Operation failed.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete item
//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this expense item?")) return;
//         setLoading(true);
//         try {
//             await axios.delete(`${config.BASE_URL}/expense-item/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             fetchItems();
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filter items
//     const filteredItems = items.filter((item) =>
//         [item.name, item.hsnCode]
//             .filter(Boolean)
//             .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     const formatEnum = (val) =>
//         val
//             ? val
//                 .replace(/_/g, " ")
//                 .toLowerCase()
//                 .replace(/\b\w/g, (c) => c.toUpperCase())
//             : "—";

//     return (
//         <div className={styles.container}>
//             {/* Header */}
//             <div className={styles.header}>
//                 <div>
//                     <h1 className={styles.title}>Expense Items</h1>
//                     <p className={styles.subtitle}>Manage items used in expenses</p>
//                 </div>
//                 <button
//                     onClick={() => openModal()}
//                     className={styles.createBtn}
//                     disabled={loading}
//                 >
//                     <Plus size={18} />
//                     Add Item
//                 </button>
//             </div>

//             {/* Search */}
//             <div className={styles.searchWrapper}>
//                 <Search className={styles.searchIcon} size={18} />
//                 <input
//                     type="text"
//                     placeholder="Search by name or HSN..."
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
//                     <p>Loading items...</p>
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
//             {!loading && !error && filteredItems.length === 0 && (
//                 <div className={styles.empty}>
//                     <Package size={60} className={styles.emptyIcon} />
//                     <p>No expense items found</p>
//                     <p className={styles.emptySub}>Click "Add Item" to create one</p>
//                 </div>
//             )}

//             {/* Desktop Table */}
//             {!loading && !error && filteredItems.length > 0 && (
//                 <div className={styles.tableContainer}>
//                     <table className={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>HSN Code</th>
//                                 <th>Price</th>
//                                 <th>Price Type</th>
//                                 <th>Tax Rate</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredItems.map((item) => (
//                                 <tr key={item.expenseItemId}>
//                                     <td className={styles.nameCell}>{item.name || "—"}</td>
//                                     <td>{item.hsnCode || "—"}</td>
//                                     <td>₹{parseFloat(item.price).toFixed(2)}</td>
//                                     <td>{formatEnum(item.priceTaxType)}</td>
//                                     <td>{formatEnum(item.taxRate)}</td>
//                                     <td className={styles.actionsCell}>
//                                         <button
//                                             onClick={() => openModal(item)}
//                                             className={styles.editBtn}
//                                             disabled={loading}
//                                             aria-label="Edit"
//                                         >
//                                             <Edit size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(item.expenseItemId)}
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
//                 {filteredItems.map((item) => (
//                     <div key={item.expenseItemId} className={styles.card}>
//                         <div className={styles.cardHeader}>
//                             <h3 className={styles.cardTitle}>{item.name || "Unnamed"}</h3>
//                             <span className={styles.cardBadge}>₹{parseFloat(item.price).toFixed(2)}</span>
//                         </div>
//                         <div className={styles.cardBody}>
//                             {item.hsnCode && (
//                                 <div className={styles.cardRow}>
//                                     <Package size={16} />
//                                     <span>{item.hsnCode}</span>
//                                 </div>
//                             )}
//                             <div className={styles.cardRow}>
//                                 <DollarSign size={16} />
//                                 <span>{formatEnum(item.priceTaxType)}</span>
//                             </div>
//                         </div>
//                         <div className={styles.cardFooter}>
//                             <button onClick={() => openModal(item)} className={styles.cardEdit}>
//                                 <Edit size={16} /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(item.expenseItemId)}
//                                 className={styles.cardDelete}
//                             >
//                                 <Trash2 size={16} /> Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Modal Popup */}
//             {isModalOpen && (
//                 <div className={styles.modalOverlay} onClick={closeModal}>
//                     <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//                         <div className={styles.modalHeader}>
//                             <h2>{editingItem ? "Edit" : "Add"} Expense Item</h2>
//                             <button onClick={closeModal} className={styles.closeBtn}>
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className={styles.modalForm}>
//                             <div className={styles.formGroup}>
//                                 <label>Name *</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     value={form.name}
//                                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                                     placeholder="e.g., Printer Ink"
//                                 />
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label>HSN Code</label>
//                                 <input
//                                     type="text"
//                                     value={form.hsnCode}
//                                     onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
//                                     placeholder="e.g., 9612"
//                                 />
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label>Price *</label>
//                                 <input
//                                     type="number"
//                                     step="0.01"
//                                     min="0"
//                                     required
//                                     value={form.price}
//                                     onChange={(e) => setForm({ ...form, price: e.target.value })}
//                                     placeholder="0.00"
//                                 />
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label>Price Includes Tax?</label>
//                                 <select
//                                     value={form.priceTaxType}
//                                     onChange={(e) => setForm({ ...form, priceTaxType: e.target.value })}
//                                 >
//                                     <option value="WITHTAX">With Tax</option>
//                                     <option value="WITHOUTTAX">Without Tax</option>
//                                 </select>
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label>Tax Rate</label>
//                                 <select
//                                     value={form.taxRate}
//                                     onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
//                                 >
//                                     <option value="NONE">None</option>
//                                     <option value="EXEMPTED">EXEMPTED%</option>
//                                     <option value="GST0">GST0%</option>
//                                     <option value="IGST0">IGST0%</option>
//                                     <option value="GST0POINT25">GST0POINT25%</option>
//                                     <option value="IGST0POINT25">IGST0POINT25%</option>
//                                     <option value="GST3">GST3%</option>
//                                     <option value="IGST3">IGST3%</option>
//                                     <option value="GST5">GST5%</option>
//                                     <option value="IGST5">IGST5%</option>
//                                     <option value="GST12">GST12%</option>
//                                     <option value="IGST12">IGST12%</option>
//                                     <option value="GST18">GST18%</option>
//                                     <option value="IGST18">IGST18%</option>
//                                     <option value="GST28">GST28%</option>
//                                     <option value="IGST28">IGST28%</option>
//                                 </select>
//                             </div>

//                             <div className={styles.modalActions}>
//                                 <button type="button" onClick={closeModal} className={styles.cancelBtn}>
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className={styles.submitBtn} disabled={loading}>
//                                     {loading ? <Loader2 size={16} className={styles.spinner} /> : "Save"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Expense_item;








// src/pages/expenses/Expense_item.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css"; // Reusing SalesList styles
import { toast } from "react-toastify";

import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  X,
  Loader,
  ChevronDown,
  Eye,
} from "lucide-react";

const Expense_item = () => {
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  // State
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    hsnCode: "",
    price: "",
    priceTaxType: "WITHTAX",
    taxRate: "NONE",
  });

  // Fetch all expense items
  const fetchItems = async () => {
    if (!companyId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expense-item/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expense items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId && token) fetchItems();
  }, [companyId, token]);

  // Open modal
  const openModal = (item = null) => {
    setEditingItem(item);
    setForm(
      item
        ? {
            name: item.name || "",
            hsnCode: item.hsnCode || "",
            price: item.price?.toString() || "",
            priceTaxType: item.priceTaxType || "WITHTAX",
            taxRate: item.taxRate || "NONE",
          }
        : {
            name: "",
            hsnCode: "",
            price: "",
            priceTaxType: "WITHTAX",
            taxRate: "NONE",
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm({
      name: "",
      hsnCode: "",
      price: "",
      priceTaxType: "WITHTAX",
      taxRate: "NONE",
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId || !token) return;

    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await axios.put(
          `${config.BASE_URL}/expense-item/${editingItem.expenseItemId}`,
          { ...form, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Expense item updated");
      } else {
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/create/expense-item`,
          { ...form, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Expense item created");
      }
      fetchItems();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense item?")) return;
    setLoading(true);
    try {
      await axios.delete(`${config.BASE_URL}/expense-item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i.expenseItemId !== id));
      toast.success("Expense item deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    [item.name, item.hsnCode]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatEnum = (val) =>
    val
      ? val
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "—";

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Expense Items</h1>
            <p className={styles["form-subtitle"]}>Manage items used in expenses</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by name or HSN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading items...</p>
        </div>
      )}

      {/* Table / Cards */}
      {filteredItems.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>HSN Code</th>
                  <th>Price</th>
                  <th>Price Type</th>
                  <th>Tax Rate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.expenseItemId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{item.name || "—"}</span>
                    </td>
                    <td>{item.hsnCode || "—"}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{parseFloat(item.price).toFixed(2)}
                      </span>
                    </td>
                    <td>{formatEnum(item.priceTaxType)}</td>
                    <td>{formatEnum(item.taxRate)}</td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => openModal(item)}
                        className={`${styles["action-button"]} ${styles["edit-button"]}`}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.expenseItemId)}
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
            {filteredItems.map((item) => (
              <div key={item.expenseItemId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{item.name || "Unnamed"}</h3>
                    <span className={styles["status-badge-paid"]}>
                      ₹{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => openModal(item)}
                    className={styles["card-action-button"]}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>HSN:</span>
                    <span className={styles["info-value"]}>{item.hsnCode || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Price Type:</span>
                    <span className={styles["info-value"]}>{formatEnum(item.priceTaxType)}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Tax Rate:</span>
                    <span className={styles["info-value"]}>{formatEnum(item.taxRate)}</span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button
                    onClick={() => openModal(item)}
                    className={styles["card-view-button"]}
                  >
                    <Edit2 size={16} />
                    Edit Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles["no-data"]}>
          <Package size={48} />
          <p>No expense items found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm
              ? "Try adjusting your search"
              : 'Click "Add Item" to create your first expense item.'}
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>{editingItem ? "Edit" : "Add"} Expense Item</h3>
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
                    Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={styles["form-input"]}
                    placeholder="e.g., Printer Ink"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>HSN Code</label>
                  <input
                    type="text"
                    value={form.hsnCode}
                    onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
                    className={styles["form-input"]}
                    placeholder="e.g., 9612"
                  />
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    Price <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={styles["form-input"]}
                    placeholder="0.00"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>Price Includes Tax?</label>
                  <select
                    value={form.priceTaxType}
                    onChange={(e) => setForm({ ...form, priceTaxType: e.target.value })}
                    className={styles["form-input"]}
                  >
                    <option value="WITHTAX">With Tax</option>
                    <option value="WITHOUTTAX">Without Tax</option>
                  </select>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Tax Rate</label>
                  <select
                    value={form.taxRate}
                    onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                    className={styles["form-input"]}
                  >
                    <option value="NONE">None</option>
                    <option value="EXEMPTED">EXEMPTED%</option>
                    <option value="GST0">GST 0%</option>
                    <option value="IGST0">IGST 0%</option>
                    <option value="GST0POINT25">GST 0.25%</option>
                    <option value="IGST0POINT25">IGST 0.25%</option>
                    <option value="GST3">GST 3%</option>
                    <option value="IGST3">IGST 3%</option>
                    <option value="GST5">GST 5%</option>
                    <option value="IGST5">IGST 5%</option>
                    <option value="GST12">GST 12%</option>
                    <option value="IGST12">IGST 12%</option>
                    <option value="GST18">GST 18%</option>
                    <option value="IGST18">IGST 18%</option>
                    <option value="GST28">GST 28%</option>
                    <option value="IGST28">IGST 28%</option>
                  </select>
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
                      <DollarSign size={16} />
                      Save Item
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
};

export default Expense_item;