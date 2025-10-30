// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Calendar,
//   DollarSign,
//   FileText,
//   AlertCircle,
//   Loader2,
//   X,
//   Package,
// } from "lucide-react";
// import styles from "./Expense.module.css";

// const Expense = () => {
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   // State
//   const [expenses, setExpenses] = useState([]);
//   const [expenseItems, setExpenseItems] = useState([]); // For dropdown
//   const [expenseCategories, setExpenseCategories] = useState([]); // Assume you have categories
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);

//   // Form state
//   const [form, setForm] = useState({
//     expenseCategoryId: "",
//     expenseDate: new Date().toISOString().split("T")[0],
//     addExpenseItems: [],
//     totalAmount: 0,
//     paymentType: "CASH",
//     description: "",
//   });

//   const [newItem, setNewItem] = useState({
//     expenseItemId: "",
//     itemName: "",
//     quantity: 1,
//     perItemRate: 0,
//     totalAmount: 0,
//   });

//   // Fetch expenses
//   const fetchExpenses = async () => {
//     if (!companyId || !token) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/expense/list`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setExpenses(res.data || []);
//     } catch (err) {
//       setError("Failed to load expenses.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch expense items (for dropdown)
//   const fetchExpenseItems = async () => {
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/expense/${companyId}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setExpenseItems(res.data || []);
//     } catch (err) {
//       console.error("Failed to load expense items");
//     }
//   };

//   // Fetch categories (you may need to adjust endpoint)
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/expense-category/list`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setExpenseCategories(res.data || []);
//     } catch (err) {
//       console.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     if (companyId && token) {
//       fetchExpenses();
//       fetchExpenseItems();
//       fetchCategories();
//     }
//   }, [companyId, token]);

//   // Open modal
//   const openModal = (expense = null) => {
//     setEditingExpense(expense);
//     if (expense) {
//       setForm({
//         expenseCategoryId: expense.expenseCategoryId || "",
//         expenseDate: expense.expenseDate || "",
//         addExpenseItems: expense.addExpenseItems || [],
//         totalAmount: expense.totalAmount || 0,
//         paymentType: expense.paymentType || "CASH",
//         description: expense.description || "",
//       });
//     } else {
//       setForm({
//         expenseCategoryId: "",
//         expenseDate: new Date().toISOString().split("T")[0],
//         addExpenseItems: [],
//         totalAmount: 0,
//         paymentType: "CASH",
//         description: "",
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingExpense(null);
//     setNewItem({ expenseItemId: "", itemName: "", quantity: 1, perItemRate: 0, totalAmount: 0 });
//   };

//   // Add item to list
//   const addItemToList = () => {
//     if (!newItem.expenseItemId || newItem.quantity <= 0 || newItem.perItemRate < 0) return;

//     const selectedItem = expenseItems.find((i) => i.expenseItemId === parseInt(newItem.expenseItemId));
//     const itemTotal = newItem.quantity * newItem.perItemRate;

//     const itemToAdd = {
//       expenseItemId: parseInt(newItem.expenseItemId),
//       itemName: selectedItem?.name || newItem.itemName,
//       quantity: parseInt(newItem.quantity),
//       perItemRate: parseFloat(newItem.perItemRate),
//       totalAmount: itemTotal,
//     };

//     const updatedItems = [...form.addExpenseItems, itemToAdd];
//     setForm({
//       ...form,
//       addExpenseItems: updatedItems,
//       totalAmount: updatedItems.reduce((sum, i) => sum + i.totalAmount, 0),
//     });

//     setNewItem({ expenseItemId: "", itemName: "", quantity: 1, perItemRate: 0, totalAmount: 0 });
//   };

//   // Remove item
//   const removeItem = (index) => {
//     const updated = form.addExpenseItems.filter((_, i) => i !== index);
//     setForm({
//       ...form,
//       addExpenseItems: updated,
//       totalAmount: updated.reduce((sum, i) => sum + i.totalAmount, 0),
//     });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.expenseCategoryId || form.addExpenseItems.length === 0) {
//       setError("Category and at least one item are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (editingExpense) {
//         // PUT /expense/{id} - if supported
//         await axios.put(
//           `${config.BASE_URL}/expense/${editingExpense.expenseId}`,
//           form,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/create-expense`,
//           form,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//       fetchExpenses();
//       closeModal();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save expense.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this expense?")) return;
//     setLoading(true);
//     try {
//       await axios.delete(`${config.BASE_URL}/expense/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchExpenses();
//     } catch (err) {
//       setError("Failed to delete.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter
//   const filtered = expenses.filter((e) =>
//     [e.description, e.paymentType]
//       .filter(Boolean)
//       .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");
//   const formatEnum = (val) =>
//     val
//       ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//       : "—";

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Expenses</h1>
//           <p className={styles.subtitle}>Track business expenses</p>
//         </div>
//         <button onClick={() => openModal()} className={styles.createBtn} disabled={loading}>
//           <Plus size={18} />
//           Add Expense
//         </button>
//       </div>

//       {/* Search */}
//       <div className={styles.searchWrapper}>
//         <Search className={styles.searchIcon} size={18} />
//         <input
//           type="text"
//           placeholder="Search by description, payment type..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles.searchInput}
//           disabled={loading}
//         />
//       </div>

//       {/* Loading / Error */}
//       {loading && (
//         <div className={styles.loading}>
//           <Loader2 className={styles.spinner} size={40} />
//           <p>Loading...</p>
//         </div>
//       )}
//       {error && (
//         <div className={styles.error}>
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && !error && filtered.length === 0 && (
//         <div className={styles.empty}>
//           <FileText size={60} className={styles.emptyIcon} />
//           <p>No expenses found</p>
//           <p className={styles.emptySub}>Click "Add Expense" to record one</p>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && !error && filtered.length > 0 && (
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Category</th>
//                 <th>Items</th>
//                 <th>Amount</th>
//                 <th>Payment</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((exp) => (
//                 <tr key={exp.expenseId}>
//                   <td>{formatDate(exp.expenseDate)}</td>
//                   <td>
//                     {expenseCategories.find((c) => c.id === exp.expenseCategoryId)?.name || "—"}
//                   </td>
//                   <td>{exp.addExpenseItems?.length || 0} item(s)</td>
//                   <td>₹{exp.totalAmount.toFixed(2)}</td>
//                   <td>
//                     <span className={styles.badge}>{formatEnum(exp.paymentType)}</span>
//                   </td>
//                   <td className={styles.descCell}>{exp.description || "—"}</td>
//                   <td className={styles.actionsCell}>
//                     <button
//                       onClick={() => openModal(exp)}
//                       className={styles.editBtn}
//                       disabled={loading}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(exp.expenseId)}
//                       className={styles.deleteBtn}
//                       disabled={loading}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Mobile Cards */}
//       <div className={styles.cards}>
//         {filtered.map((exp) => (
//           <div key={exp.expenseId} className={styles.card}>
//             <div className={styles.cardHeader}>
//               <h3 className={styles.cardTitle}>₹{exp.totalAmount.toFixed(2)}</h3>
//               <span className={styles.cardBadge}>{formatEnum(exp.paymentType)}</span>
//             </div>
//             <div className={styles.cardBody}>
//               <div className={styles.cardRow}>
//                 <Calendar size={16} />
//                 <span>{formatDate(exp.expenseDate)}</span>
//               </div>
//               <div className={styles.cardRow}>
//                 <Package size={16} />
//                 <span>
//                   {expenseCategories.find((c) => c.id === exp.expenseCategoryId)?.name || "—"}
//                 </span>
//               </div>
//               {exp.description && (
//                 <div className={styles.cardRow}>
//                   <FileText size={16} />
//                   <span>{exp.description}</span>
//                 </div>
//               )}
//             </div>
//             <div className={styles.cardFooter}>
//               <button onClick={() => openModal(exp)} className={styles.cardEdit}>
//                 <Edit size={16} /> Edit
//               </button>
//               <button onClick={() => handleDelete(exp.expenseId)} className={styles.cardDelete}>
//                 <Trash2 size={16} /> Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className={styles.modalOverlay} onClick={closeModal}>
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <div className={styles.modalHeader}>
//               <h2>{editingExpense ? "Edit" : "Add"} Expense</h2>
//               <button onClick={closeModal} className={styles.closeBtn}>
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className={styles.modalForm}>
//               <div className={styles.formGroup}>
//                 <label>Category *</label>
//                 <select
//                   required
//                   value={form.expenseCategoryId}
//                   onChange={(e) => setForm({ ...form, expenseCategoryId: e.target.value })}
//                 >
//                   <option value="">Select Category</option>
//                   {expenseCategories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Date *</label>
//                 <input
//                   type="date"
//                   required
//                   value={form.expenseDate}
//                   onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Payment Type</label>
//                 <select
//                   value={form.paymentType}
//                   onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                 >
//                   <option value="CASH">Cash</option>
//                   <option value="BANK">Bank</option>
//                   <option value="UPI">UPI</option>
//                   <option value="CARD">Card</option>
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Description</label>
//                 <textarea
//                   rows="2"
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   placeholder="Optional notes..."
//                 />
//               </div>

//               <div className={styles.section}>
//                 <h3>Add Items</h3>

//                 <div className={styles.itemInput}>
//                   <select
//                     value={newItem.expenseItemId}
//                     onChange={(e) => {
//                       const item = expenseItems.find((i) => i.expenseItemId === parseInt(e.target.value));
//                       setNewItem({
//                         ...newItem,
//                         expenseItemId: e.target.value,
//                         itemName: item?.name || "",
//                         perItemRate: item?.price || 0,
//                       });
//                     }}
//                   >
//                     <option value="">Select Item</option>
//                     {expenseItems.map((item) => (
//                       <option key={item.expenseItemId} value={item.expenseItemId}>
//                         {item.name} (₹{item.price})
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     type="number"
//                     min="1"
//                     placeholder="Qty"
//                     value={newItem.quantity}
//                     onChange={(e) => {
//                       const qty = parseInt(e.target.value) || 1;
//                       setNewItem({
//                         ...newItem,
//                         quantity: qty,
//                         totalAmount: qty * newItem.perItemRate,
//                       });
//                     }}
//                   />

//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     placeholder="Rate"
//                     value={newItem.perItemRate}
//                     onChange={(e) => {
//                       const rate = parseFloat(e.target.value) || 0;
//                       setNewItem({
//                         ...newItem,
//                         perItemRate: rate,
//                         totalAmount: newItem.quantity * rate,
//                       });
//                     }}
//                   />

//                   <button type="button" onClick={addItemToList} className={styles.addItemBtn}>
//                     Add
//                   </button>
//                 </div>

//                 {form.addExpenseItems.length > 0 && (
//                   <div className={styles.itemList}>
//                     {form.addExpenseItems.map((item, i) => (
//                       <div key={i} className={styles.itemRow}>
//                         <span>
//                           {item.itemName} × {item.quantity} @ ₹{item.perItemRate.toFixed(2)}
//                         </span>
//                         <span>₹{item.totalAmount.toFixed(2)}</span>
//                         <button
//                           type="button"
//                           onClick={() => removeItem(i)}
//                           className={styles.removeItem}
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                     <div className={styles.totalRow}>
//                       <strong>Total: ₹{form.totalAmount.toFixed(2)}</strong>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className={styles.modalActions}>
//                 <button type="button" onClick={closeModal} className={styles.cancelBtn}>
//                   Cancel
//                 </button>
//                 <button type="submit" className={styles.submitBtn} disabled={loading}>
//                   {loading ? <Loader2 size={16} className={styles.spinner} /> : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Expense;





import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config/apiconfig";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Loader2,
  X,
  Package,
} from "lucide-react";
import styles from "./Expense.module.css";

const Expense = () => {
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  // State
  const [expenses, setExpenses] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Form state
  const [form, setForm] = useState({
    expenseCategoryId: "",
    expenseDate: new Date().toISOString().split("T")[0],
    addExpenseItems: [],
    totalAmount: 0,
    paymentType: "CASH",
    description: "",
  });

  const [newItem, setNewItem] = useState({
    expenseItemId: "",
    itemName: "",
    quantity: 1,
    perItemRate: 0,
    totalAmount: 0,
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!companyId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expense/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(res.data || []);
    } catch (err) {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch expense items
  const fetchExpenseItems = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/expense/${companyId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenseItems(res.data || []);
    } catch (err) {
      console.error("Failed to load expense items");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expense-category/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenseCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => {
    if (companyId && token) {
      fetchExpenses();
      fetchExpenseItems();
      fetchCategories();
    }
  }, [companyId, token]);

  // Open modal
  const openModal = (expense = null) => {
    setEditingExpense(expense);
    if (expense) {
      setForm({
        expenseCategoryId: expense.expenseCategoryId || "",
        expenseDate: expense.expenseDate || "",
        addExpenseItems: expense.addExpenseItems || [],
        totalAmount: expense.totalAmount || 0,
        paymentType: expense.paymentType || "CASH",
        description: expense.description || "",
      });
    } else {
      setForm({
        expenseCategoryId: "",
        expenseDate: new Date().toISOString().split("T")[0],
        addExpenseItems: [],
        totalAmount: 0,
        paymentType: "CASH",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setNewItem({ expenseItemId: "", itemName: "", quantity: 1, perItemRate: 0, totalAmount: 0 });
  };

  // Add item to list
  const addItemToList = () => {
    if (!newItem.expenseItemId || newItem.quantity <= 0 || newItem.perItemRate < 0) return;

    const selectedItem = expenseItems.find((i) => i.expenseItemId === parseInt(newItem.expenseItemId));
    const itemTotal = newItem.quantity * newItem.perItemRate;

    const itemToAdd = {
      expenseItemId: parseInt(newItem.expenseItemId),
      itemName: selectedItem?.name || newItem.itemName,
      quantity: parseInt(newItem.quantity),
      perItemRate: parseFloat(newItem.perItemRate),
      totalAmount: itemTotal,
    };

    const updatedItems = [...form.addExpenseItems, itemToAdd];
    setForm({
      ...form,
      addExpenseItems: updatedItems,
      totalAmount: updatedItems.reduce((sum, i) => sum + i.totalAmount, 0),
    });

    setNewItem({ expenseItemId: "", itemName: "", quantity: 1, perItemRate: 0, totalAmount: 0 });
  };

  // Remove item
  const removeItem = (index) => {
    const updated = form.addExpenseItems.filter((_, i) => i !== index);
    setForm({
      ...form,
      addExpenseItems: updated,
      totalAmount: updated.reduce((sum, i) => sum + i.totalAmount, 0),
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.expenseCategoryId || form.addExpenseItems.length === 0) {
      setError("Category and at least one item are required.");
      return;
    }

    setLoading(true);
    try {
      if (editingExpense) {
        await axios.put(
          `${config.BASE_URL}/expense/${editingExpense.expenseId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/create-expense`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchExpenses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setLoading(true);
    try {
      await axios.delete(`${config.BASE_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      setError("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filtered = expenses.filter((e) =>
    [e.description, e.paymentType]
      .filter(Boolean)
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");
  const formatEnum = (val) =>
    val
      ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "—";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>Track business expenses</p>
        </div>
        <button onClick={() => openModal()} className={styles.createBtn} disabled={loading}>
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search by description, payment type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          disabled={loading}
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className={styles.loading}>
          <Loader2 className={styles.spinner} size={40} />
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <FileText size={60} className={styles.emptyIcon} />
          <p>No expenses found</p>
          <p className={styles.emptySub}>Click "Add Expense" to record one</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <tr key={exp.expenseId}>
                  <td>{formatDate(exp.expenseDate)}</td>
                  <td>
                    {expenseCategories.find((c) => c.id === exp.expenseCategoryId)?.name || "—"}
                  </td>
                  <td>{exp.addExpenseItems?.length || 0} item(s)</td>
                  <td>₹{exp.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={styles.badge}>{formatEnum(exp.paymentType)}</span>
                  </td>
                  <td className={styles.descCell}>{exp.description || "—"}</td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => openModal(exp)}
                      className={styles.editBtn}
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.expenseId)}
                      className={styles.deleteBtn}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      <div className={styles.cards}>
        {filtered.map((exp) => (
          <div key={exp.expenseId} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>₹{exp.totalAmount.toFixed(2)}</h3>
              <span className={styles.cardBadge}>{formatEnum(exp.paymentType)}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardRow}>
                <Calendar size={16} />
                <span>{formatDate(exp.expenseDate)}</span>
              </div>
              <div className={styles.cardRow}>
                <Package size={16} />
                <span>
                  {expenseCategories.find((c) => c.id === exp.expenseCategoryId)?.name || "—"}
                </span>
              </div>
              {exp.description && (
                <div className={styles.cardRow}>
                  <FileText size={16} />
                  <span>{exp.description}</span>
                </div>
              )}
            </div>
            <div className={styles.cardFooter}>
              <button onClick={() => openModal(exp)} className={styles.cardEdit}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => handleDelete(exp.expenseId)} className={styles.cardDelete}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== MODAL ==================== */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingExpense ? "Edit" : "Add"} Expense
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className={styles.closeBtn}
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Basic Info Grid */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    required
                    value={form.expenseCategoryId}
                    onChange={(e) => setForm({ ...form, expenseCategoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date">Date *</label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={form.expenseDate}
                    onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="payment">Payment Type</label>
                  <select
                    id="payment"
                    value={form.paymentType}
                    onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK">Bank</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="desc">Description</label>
                  <textarea
                    id="desc"
                    rows={2}
                    placeholder="Optional notes…"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Items Section */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Add Items</h3>

                <div className={styles.itemInputRow}>
                  <select
                    value={newItem.expenseItemId}
                    onChange={(e) => {
                      const item = expenseItems.find(
                        (i) => i.expenseItemId === parseInt(e.target.value)
                      );
                      setNewItem({
                        ...newItem,
                        expenseItemId: e.target.value,
                        itemName: item?.name ?? "",
                        perItemRate: item?.price ?? 0,
                      });
                    }}
                    aria-label="Select expense item"
                  >
                    <option value="">Select Item</option>
                    {expenseItems.map((it) => (
                      <option key={it.expenseItemId} value={it.expenseItemId}>
                        {it.name} (₹{it.price})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, parseInt(e.target.value) || 1);
                      setNewItem({
                        ...newItem,
                        quantity: qty,
                        totalAmount: qty * newItem.perItemRate,
                      });
                    }}
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Rate"
                    value={newItem.perItemRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      setNewItem({
                        ...newItem,
                        perItemRate: rate,
                        totalAmount: newItem.quantity * rate,
                      });
                    }}
                  />

                  <button type="button" onClick={addItemToList} className={styles.addItemBtn}>
                    Add
                  </button>
                </div>

                {form.addExpenseItems.length > 0 && (
                  <div className={styles.itemList}>
                    {form.addExpenseItems.map((it, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <span>
                          {it.itemName} × {it.quantity} @ ₹{it.perItemRate.toFixed(2)}
                        </span>
                        <span>₹{it.totalAmount.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className={styles.removeItem}
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className={styles.totalRow}>
                      <strong>Total: ₹{form.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <Loader2 size={18} className={styles.spinner} /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;