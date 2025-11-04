// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Expense.module.css";
// import { toast } from "react-toastify";

// const PAYMENT_TYPES = [
//   "CASH",
//   "UPI",
//   "CREDIT_CARD",
//   "DEBIT_CARD",
//   "NET_BANKING",
//   "WALLET",
//   "CHEQUE",
//   "OTHER",
// ];

// const CreateExpense = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit"); // ?edit=123

//   // Auth
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   // State
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState({
//     expenseCategoryId: "",
//     expenseDate: new Date().toISOString().split("T")[0],
//     paymentType: "CASH",
//     description: "",
//     items: [
//       {
//         itemName: "",
//         quantity: "",
//         perItemRate: "",
//         totalAmount: 0,
//       },
//     ],
//     totalAmount: 0,
//   });

//   // Fetch Categories
//   const fetchCategories = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/expenses-categories`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCategories(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     }
//   };

//   // Load Expense for Edit
//   const fetchExpense = async (id) => {
//     if (!token) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/expense/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const e = res.data;

//       setForm({
//         expenseCategoryId: e.expenseCategoryId?.toString() || "",
//         expenseDate: e.expenseDate?.split("T")[0] || "",
//         paymentType: e.paymentType || "CASH",
//         description: e.description || "",
//         items:
//           e.addExpenseItemResponses?.map((it) => ({
//             expenseItemId: it.expenseItemId,
//             itemName: it.itemName || "",
//             quantity: it.quantity?.toString() || "",
//             perItemRate: it.perItemRate?.toString() || "",
//             totalAmount: it.totalAmount || 0,
//           })) || [],
//         totalAmount: e.totalAmount || 0,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expense");
//       navigate("/expenses");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     if (token && companyId) {
//       fetchCategories();
//       if (editId) fetchExpense(editId);
//     }
//   }, [token, companyId, editId]);

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.perItemRate) || 0;
//     const total = qty * rate;
//     return { ...item, totalAmount: parseFloat(total.toFixed(2)) };
//   };

//   // Recalculate all items & grand total
//   const recalculateTotals = (items) => {
//     const calculated = items.map(calculateItem);
//     const grandTotal = calculated.reduce((sum, i) => sum + i.totalAmount, 0);
//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalAmount: parseFloat(grandTotal.toFixed(2)),
//     }));
//   };

//   // Handle item field change
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

//   // Add new item row
//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           itemName: "",
//           quantity: "",
//           perItemRate: "",
//           totalAmount: 0,
//         },
//       ],
//     }));
//   };

//   // Remove item row
//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index);
//     recalculateTotals(newItems);
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("Please login and select a company");
//       return;
//     }

//     if (!form.expenseCategoryId || !form.expenseDate) {
//       toast.error("Category and Date are required");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) =>
//         !i.itemName ||
//         !i.quantity ||
//         !i.perItemRate ||
//         parseFloat(i.quantity) <= 0 ||
//         parseFloat(i.perItemRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Quantity > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       expenseCategoryId: parseInt(form.expenseCategoryId),
//       expenseDate: form.expenseDate,
//       paymentType: form.paymentType,
//       description: form.description.trim() || null,
//       totalAmount: form.totalAmount,
//       addExpenseItems: form.items.map((i) => ({
//         expenseItemId: i.expenseItemId || null,
//         itemName: i.itemName.trim(),
//         quantity: parseFloat(i.quantity),
//         perItemRate: parseFloat(i.perItemRate),
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         // UPDATE
//         await axios.put(`${config.BASE_URL}/expense/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Expense updated successfully!");
//       } else {
//         // CREATE
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/create-expense`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast.success("Expense created successfully!");
//       }

//       navigate("/expenses");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || `Failed to ${editId ? "update" : "create"} expense`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isEditMode = !!editId;

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>
//             {isEditMode ? "Edit Expense" : "Create Expense"}
//           </h1>
//           <p className={styles["form-subtitle"]}>
//             {isEditMode ? `Expense #${editId}` : "Record a new business expense"}
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             type="button"
//             onClick={() => navigate("/expenses")}
//             className={styles["cancel-button"]}
//             disabled={loading || loadingData}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             form="expenseForm"
//             className={styles["submit-button"]}
//             disabled={loading || loadingData}
//           >
//             {loading ? "Saving..." : isEditMode ? "Update Expense" : "Create Expense"}
//           </button>
//         </div>
//       </div>

//       {/* Loading */}
//       {loadingData && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading expense data...</p>
//         </div>
//       )}

//       {/* Form */}
//       {!loadingData && (
//         <form id="expenseForm" onSubmit={handleSubmit}>
//           {/* Category & Date */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>
//                 Category <span className={styles.required}>*</span>
//               </label>
//               <select
//                 value={form.expenseCategoryId}
//                 onChange={(e) =>
//                   setForm({ ...form, expenseCategoryId: e.target.value })
//                 }
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option
//                     key={cat.expensesCategoryId}
//                     value={cat.expensesCategoryId}
//                   >
//                     {cat.categoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles["form-group"]}>
//               <label>
//                 Expense Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.expenseDate}
//                 onChange={(e) =>
//                   setForm({ ...form, expenseDate: e.target.value })
//                 }
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               />
//             </div>
//           </div>

//           {/* Payment Type */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) =>
//                   setForm({ ...form, paymentType: e.target.value })
//                 }
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               >
//                 {PAYMENT_TYPES.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles["form-group"]} />
//           </div>

//           {/* Description */}
//           <div className={styles["form-group"]}>
//             <label>Description</label>
//             <textarea
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className={`${styles["form-input"]} ${styles.textarea}`}
//               rows={2}
//               placeholder="Optional notes..."
//               disabled={!token || !companyId}
//             />
//           </div>

//           {/* Items Section */}
//           <div className={styles["card-section"]}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "12px",
//               }}
//             >
//               <h4 style={{ margin: 0 }}>Expense Items</h4>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className={styles["submit-button"]}
//                 style={{ fontSize: "0.8rem", padding: "6px 12px" }}
//                 disabled={!token || !companyId}
//               >
//                 + Add Item
//               </button>
//             </div>

//             {form.items.map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   border: "1px solid #ddd",
//                   borderRadius: "6px",
//                   padding: "16px",
//                   marginBottom: "16px",
//                   background: "#fafafa",
//                 }}
//               >
//                 {/* Item Name */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>
//                       Item Name <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={item.itemName}
//                       onChange={(e) =>
//                         handleItemChange(index, "itemName", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                       placeholder="e.g. Printer Ink"
//                     />
//                   </div>
//                 </div>

//                 {/* Qty, Rate, Total */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>
//                       Quantity <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleItemChange(index, "quantity", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                     />
//                   </div>

//                   <div className={styles["form-group"]}>
//                     <label>
//                       Rate/Unit <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.perItemRate}
//                       onChange={(e) =>
//                         handleItemChange(index, "perItemRate", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                     />
//                   </div>

//                   <div className={styles["form-group"]}>
//                     <label>Total</label>
//                     <div
//                       style={{
//                         padding: "10px 12px",
//                         background: "#e8f5e9",
//                         borderRadius: "6px",
//                         fontWeight: "600",
//                         color: "#27ae60",
//                       }}
//                     >
//                       ₹{item.totalAmount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {form.items.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className={styles["delete-button"]}
//                     style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                   >
//                     Remove Item
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Grand Total */}
//           <div
//             className={styles["card-section"]}
//             style={{
//               background: "#f0f7ff",
//               padding: "16px",
//               borderRadius: "8px",
//               marginTop: "20px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "24px",
//                 fontSize: "1.1rem",
//               }}
//             >
//               <strong>Grand Total: ₹{form.totalAmount.toFixed(2)}</strong>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateExpense;







// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Expense.module.css";
// import { toast } from "react-toastify";

// const PAYMENT_TYPES = [
//   "CASH",
//   "UPI",
//   "CREDIT_CARD",
//   "DEBIT_CARD",
//   "NET_BANKING",
//   "WALLET",
//   "CHEQUE",
//   "OTHER",
// ];

// // Helper: Fetch expense item catalog
// const fetchExpenseItems = async (companyId, token) => {
//   const res = await axios.get(
//     `${config.BASE_URL}/company/${companyId}/expense-item/list`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   return res.data || [];
// };

// const CreateExpense = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit");

//   // Auth
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   // State
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [expenseItemsCatalog, setExpenseItemsCatalog] = useState([]);

//   const [form, setForm] = useState({
//     expenseCategoryId: "",
//     expenseDate: new Date().toISOString().split("T")[0],
//     paymentType: "CASH",
//     description: "",
//     items: [
//       {
//         expenseItemId: null,
//         itemName: "",
//         quantity: "",
//         perItemRate: "",
//         totalAmount: 0,
//         priceTaxType: "WITHTAX",
//         taxRate: "NONE",
//       },
//     ],
//     totalAmount: 0,
//   });

//   // Fetch Categories
//   const fetchCategories = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/expenses-categories`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCategories(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     }
//   };

//   // Load Catalog
//   const loadCatalog = useCallback(async () => {
//     if (!token || !companyId) return;
//     try {
//       const catalog = await fetchExpenseItems(companyId, token);
//       setExpenseItemsCatalog(catalog);
//     } catch (err) {
//       toast.error("Failed to load expense item catalog");
//     }
//   }, [token, companyId]);

//   // Load Expense for Edit
//   const fetchExpense = async (id) => {
//     if (!token) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/expense/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const e = res.data;

//       setForm({
//         expenseCategoryId: e.expenseCategoryId?.toString() || "",
//         expenseDate: e.expenseDate?.split("T")[0] || "",
//         paymentType: e.paymentType || "CASH",
//         description: e.description || "",
//         items:
//           e.addExpenseItemResponses?.map((it) => ({
//             expenseItemId: it.expenseItemId || null,
//             itemName: it.itemName || "",
//             quantity: it.quantity?.toString() || "",
//             perItemRate: it.perItemRate?.toString() || "",
//             totalAmount: it.totalAmount || 0,
//             priceTaxType: it.priceTaxType || "WITHTAX",
//             taxRate: it.taxRate || "NONE",
//           })) || [],
//         totalAmount: e.totalAmount || 0,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expense");
//       navigate("/expenses");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     if (token && companyId) {
//       fetchCategories();
//       loadCatalog();
//       if (editId) fetchExpense(editId);
//     }
//   }, [token, companyId, editId, loadCatalog]);

//   // Calculate item with tax
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     let rate = parseFloat(item.perItemRate) || 0;

//     if (item.priceTaxType === "WITHTAX" && item.taxRate && item.taxRate !== "NONE") {
//       const taxPercent = parseFloat(item.taxRate) || 0;
//       rate = rate * (1 + taxPercent / 100);
//     }

//     const total = qty * rate;
//     return { ...item, totalAmount: parseFloat(total.toFixed(2)) };
//   };

//   const recalculateTotals = (items) => {
//     const calculated = items.map(calculateItem);
//     const grandTotal = calculated.reduce((sum, i) => sum + i.totalAmount, 0);
//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalAmount: parseFloat(grandTotal.toFixed(2)),
//     }));
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;

//     if (field === "itemName" && value === "") {
//       newItems[index].expenseItemId = null;
//     }
//     recalculateTotals(newItems);
//   };

//   const handleCatalogSelect = (index, catalogItem) => {
//     const newItems = [...form.items];
//     newItems[index] = {
//       ...newItems[index],
//       expenseItemId: catalogItem.expenseItemId,
//       itemName: catalogItem.name,
//       perItemRate: catalogItem.price.toString(),
//       priceTaxType: catalogItem.priceTaxType,
//       taxRate: catalogItem.taxRate,
//     };
//     recalculateTotals(newItems);
//   };

//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           expenseItemId: null,
//           itemName: "",
//           quantity: "",
//           perItemRate: "",
//           totalAmount: 0,
//           priceTaxType: "WITHTAX",
//           taxRate: "NONE",
//         },
//       ],
//     }));
//   };

//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index);
//     recalculateTotals(newItems);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("Please login and select a company");
//       return;
//     }

//     if (!form.expenseCategoryId || !form.expenseDate) {
//       toast.error("Category and Date are required");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) =>
//         !i.itemName ||
//         !i.quantity ||
//         !i.perItemRate ||
//         parseFloat(i.quantity) <= 0 ||
//         parseFloat(i.perItemRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Quantity > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       expenseCategoryId: parseInt(form.expenseCategoryId),
//       expenseDate: form.expenseDate,
//       paymentType: form.paymentType,
//       description: form.description.trim() || null,
//       totalAmount: form.totalAmount,
//       addExpenseItems: form.items.map((i) => ({
//         expenseItemId: i.expenseItemId || null,
//         itemName: i.itemName.trim(),
//         quantity: parseFloat(i.quantity),
//         perItemRate: parseFloat(i.perItemRate),
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/expense/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Expense updated successfully!");
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/create-expense`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast.success("Expense created successfully!");
//       }

//       navigate("/expenses");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           `Failed to ${editId ? "update" : "create"} expense`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isEditMode = !!editId;

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>
//             {isEditMode ? "Edit Expense" : "Create Expense"}
//           </h1>
//           <p className={styles["form-subtitle"]}>
//             {isEditMode ? `Expense #${editId}` : "Record a new business expense"}
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             type="button"
//             onClick={() => navigate("/expenses")}
//             className={styles["cancel-button"]}
//             disabled={loading || loadingData}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             form="expenseForm"
//             className={styles["submit-button"]}
//             disabled={loading || loadingData}
//           >
//             {loading ? "Saving..." : isEditMode ? "Update Expense" : "Create Expense"}
//           </button>
//         </div>
//       </div>

//       {/* Loading */}
//       {loadingData && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading expense data...</p>
//         </div>
//       )}

//       {/* Form */}
//       {!loadingData && (
//         <form id="expenseForm" onSubmit={handleSubmit}>
//           {/* Category & Date */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>
//                 Category <span className={styles.required}>*</span>
//               </label>
//               <select
//                 value={form.expenseCategoryId}
//                 onChange={(e) =>
//                   setForm({ ...form, expenseCategoryId: e.target.value })
//                 }
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option
//                     key={cat.expensesCategoryId}
//                     value={cat.expensesCategoryId}
//                   >
//                     {cat.categoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles["form-group"]}>
//               <label>
//                 Expense Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.expenseDate}
//                 onChange={(e) =>
//                   setForm({ ...form, expenseDate: e.target.value })
//                 }
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               />
//             </div>
//           </div>

//           {/* Payment Type */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) =>
//                   setForm({ ...form, paymentType: e.target.value })
//                 }
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId}
//               >
//                 {PAYMENT_TYPES.map((type) => (
//                   <option key={type} value={type}>
//                     {type.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles["form-group"]} />
//           </div>

//           {/* Description */}
//           <div className={styles["form-group"]}>
//             <label>Description</label>
//             <textarea
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className={`${styles["form-input"]} ${styles.textarea}`}
//               rows={2}
//               placeholder="Optional notes..."
//               disabled={!token || !companyId}
//             />
//           </div>

//           {/* Items Section */}
//           <div className={styles["card-section"]}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "12px",
//               }}
//             >
//               <h4 style={{ margin: 0 }}>Expense Items</h4>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className={styles["submit-button"]}
//                 style={{ fontSize: "0.8rem", padding: "6px 12px" }}
//                 disabled={!token || !companyId}
//               >
//                 + Add Item
//               </button>
//             </div>

//             {form.items.map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   border: "1px solid #ddd",
//                   borderRadius: "6px",
//                   padding: "16px",
//                   marginBottom: "16px",
//                   background: "#fafafa",
//                 }}
//               >
//                 {/* Catalog Select + Custom Name */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>
//                       Item <span className={styles.required}>*</span>
//                     </label>

//                     {/* Catalog Dropdown */}
//                     <select
//                       value={item.expenseItemId ?? ""}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         if (val === "-1") {
//                           // Custom
//                           handleItemChange(index, "expenseItemId", null);
//                           handleItemChange(index, "itemName", "");
//                           handleItemChange(index, "perItemRate", "");
//                         } else {
//                           const selected = expenseItemsCatalog.find(
//                             (c) => c.expenseItemId === Number(val)
//                           );
//                           if (selected) handleCatalogSelect(index, selected);
//                         }
//                       }}
//                       className={styles["form-input"]}
//                       style={{ marginBottom: "8px" }}
//                     >
//                       <option value="">-- Select from catalog --</option>
//                       {expenseItemsCatalog.map((cat) => (
//                         <option
//                           key={cat.expenseItemId}
//                           value={cat.expenseItemId}
//                         >
//                           {cat.name} (₹{cat.price}
//                           {cat.priceTaxType === "WITHTAX" &&
//                             cat.taxRate !== "NONE"
//                             ? ` + ${cat.taxRate}% tax`
//                             : ""}
//                           )
//                         </option>
//                       ))}
//                       <option value={-1}>[Custom Item]</option>
//                     </select>

//                     {/* Custom Name (only editable if custom) */}
//                     <input
//                       type="text"
//                       value={item.itemName}
//                       onChange={(e) =>
//                         handleItemChange(index, "itemName", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                       placeholder="Enter custom item name"
//                       disabled={!!item.expenseItemId}
//                     />
//                   </div>
//                 </div>

//                 {/* Quantity, Rate, Total */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>
//                       Quantity <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleItemChange(index, "quantity", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                     />
//                   </div>

//                   <div className={styles["form-group"]}>
//                     <label>
//                       Rate/Unit <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.perItemRate}
//                       onChange={(e) =>
//                         handleItemChange(index, "perItemRate", e.target.value)
//                       }
//                       required
//                       className={styles["form-input"]}
//                       disabled={!!item.expenseItemId}
//                     />
//                   </div>

//                   <div className={styles["form-group"]}>
//                     <label>Total</label>
//                     <div
//                       style={{
//                         padding: "10px 12px",
//                         background: "#e8f5e9",
//                         borderRadius: "6px",
//                         fontWeight: "600",
//                         color: "#27ae60",
//                       }}
//                     >
//                       ₹{item.totalAmount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {form.items.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className={styles["delete-button"]}
//                     style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                   >
//                     Remove Item
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Grand Total */}
//           <div
//             className={styles["card-section"]}
//             style={{
//               background: "#f0f7ff",
//               padding: "16px",
//               borderRadius: "8px",
//               marginTop: "20px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "24px",
//                 fontSize: "1.1rem",
//               }}
//             >
//               <strong>Grand Total: ₹{form.totalAmount.toFixed(2)}</strong>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateExpense;









import React, { useEffect, useState, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/Form.module.css"
import { toast } from "react-toastify"
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  FileText,
  Loader,
  Package,
  Plus,
  Trash2,
  IndianRupee,
  Tag,
} from "lucide-react"

const PAYMENT_TYPES = [
  "CASH",
  "UPI",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "NET_BANKING",
  "WALLET",
  "CHEQUE",
  "OTHER",
]

const fetchExpenseItems = async (companyId, token) => {
  const res = await axios.get(
    `${config.BASE_URL}/company/${companyId}/expense-item/list`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data || []
}

const CreateExpense = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const editId = queryParams.get("edit")

  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}")
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [categories, setCategories] = useState([])
  const [expenseItemsCatalog, setExpenseItemsCatalog] = useState([])

  const [form, setForm] = useState({
    expenseCategoryId: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paymentType: "CASH",
    description: "",
    items: [
      {
        expenseItemId: null,
        itemName: "",
        quantity: "",
        perItemRate: "",
        totalAmount: 0,
        priceTaxType: "WITHTAX",
        taxRate: "NONE",
      },
    ],
    totalAmount: 0,
  })

  /* ==================== FETCH DATA ==================== */
  const fetchCategories = async () => {
    if (!token || !companyId) return
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expenses-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setCategories(res.data || [])
    } catch (err) {
      toast.error("Failed to load categories")
    }
  }

  const loadCatalog = useCallback(async () => {
    if (!token || !companyId) return
    try {
      const catalog = await fetchExpenseItems(companyId, token)
      setExpenseItemsCatalog(catalog)
    } catch (err) {
      toast.error("Failed to load expense item catalog")
    }
  }, [token, companyId])

  const fetchExpense = async (id) => {
    if (!token) return
    setLoadingData(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const e = res.data

      setForm({
        expenseCategoryId: e.expenseCategoryId?.toString() || "",
        expenseDate: e.expenseDate?.split("T")[0] || "",
        paymentType: e.paymentType || "CASH",
        description: e.description || "",
        items:
          e.addExpenseItemResponses?.map((it) => ({
            expenseItemId: it.expenseItemId || null,
            itemName: it.itemName || "",
            quantity: it.quantity?.toString() || "",
            perItemRate: it.perItemRate?.toString() || "",
            totalAmount: it.totalAmount || 0,
            priceTaxType: it.priceTaxType || "WITHTAX",
            taxRate: it.taxRate || "NONE",
          })) || [],
        totalAmount: e.totalAmount || 0,
      })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expense")
      navigate("/expense")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (token && companyId) {
      fetchCategories()
      loadCatalog()
      if (editId) fetchExpense(editId)
    }
  }, [token, companyId, editId, loadCatalog])

  /* ==================== CALCULATIONS ==================== */
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0
    let rate = parseFloat(item.perItemRate) || 0

    if (item.priceTaxType === "WITHTAX" && item.taxRate && item.taxRate !== "NONE") {
      const taxPercent = parseFloat(item.taxRate) || 0
      rate = rate * (1 + taxPercent / 100)
    }

    const total = qty * rate
    return { ...item, totalAmount: parseFloat(total.toFixed(2)) }
  }

  const recalculateTotals = (items) => {
    const calculated = items.map(calculateItem)
    const grandTotal = calculated.reduce((sum, i) => sum + i.totalAmount, 0)
    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalAmount: parseFloat(grandTotal.toFixed(2)),
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value

    if (field === "itemName" && value === "") {
      newItems[index].expenseItemId = null
    }
    recalculateTotals(newItems)
  }

  const handleCatalogSelect = (index, catalogItem) => {
    const newItems = [...form.items]
    newItems[index] = {
      ...newItems[index],
      expenseItemId: catalogItem.expenseItemId,
      itemName: catalogItem.name,
      perItemRate: catalogItem.price.toString(),
      priceTaxType: catalogItem.priceTaxType,
      taxRate: catalogItem.taxRate,
    }
    recalculateTotals(newItems)
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          expenseItemId: null,
          itemName: "",
          quantity: "",
          perItemRate: "",
          totalAmount: 0,
          priceTaxType: "WITHTAX",
          taxRate: "NONE",
        },
      ],
    }))
  }

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index)
    recalculateTotals(newItems)
  }

  /* ==================== SUBMIT ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token || !companyId) {
      toast.error("Please login and select a company")
      return
    }

    if (!form.expenseCategoryId || !form.expenseDate) {
      toast.error("Category and Date are required")
      return
    }

    const invalidItem = form.items.some(
      (i) =>
        !i.itemName ||
        !i.quantity ||
        !i.perItemRate ||
        parseFloat(i.quantity) <= 0 ||
        parseFloat(i.perItemRate) <= 0
    )
    if (invalidItem) {
      toast.error("Each item must have Name, Quantity > 0, Rate > 0")
      return
    }

    const payload = {
      expenseCategoryId: parseInt(form.expenseCategoryId),
      expenseDate: form.expenseDate,
      paymentType: form.paymentType,
      description: form.description.trim() || null,
      totalAmount: form.totalAmount,
      addExpenseItems: form.items.map((i) => ({
        expenseItemId: i.expenseItemId || null,
        itemName: i.itemName.trim(),
        quantity: parseFloat(i.quantity),
        perItemRate: parseFloat(i.perItemRate),
        totalAmount: i.totalAmount,
      })),
    }

    try {
      setLoading(true)

      if (editId) {
        await axios.put(`${config.BASE_URL}/expense/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        toast.success("Expense updated successfully!")
      } else {
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/create-expense`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        toast.success("Expense created successfully!")
      }

      navigate("/expense")
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${editId ? "update" : "create"} expense`
      )
    } finally {
      setLoading(false)
    }
  }

  const isEditMode = !!editId

  return (
    <div className={styles.container}>
      {loadingData ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading expense data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  {isEditMode ? (
                    <>
                      <FileText className={styles.titleIcon} />
                      Edit Expense
                    </>
                  ) : (
                    <>
                      <IndianRupee className={styles.titleIcon} />
                      Create Expense
                    </>
                  )}
                </h1>
                <p className={styles.subtitle}>
                  {isEditMode ? `Expense #${editId}` : "Record a new business expense"}
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => navigate("/expense")}
                className={styles.buttonSecondary}
                disabled={loading || loadingData}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                className={styles.buttonPrimary}
                disabled={loading || loadingData}
              >
                {loading ? (
                  <>
                    <Loader size={18} className={styles.spinnerSmall} />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isEditMode ? "Update Expense" : "Create Expense"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category & Date */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Tag size={20} />
              Category & Date
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="category"
                  value={form.expenseCategoryId}
                  onChange={(e) =>
                    setForm({ ...form, expenseCategoryId: e.target.value })
                  }
                  required
                  className={styles.input}
                  disabled={!token || !companyId}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.expensesCategoryId}
                      value={cat.expensesCategoryId}
                    >
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="expenseDate" className={styles.label}>
                  Expense Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="expenseDate"
                  type="date"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm({ ...form, expenseDate: e.target.value })
                  }
                  required
                  className={styles.input}
                  disabled={!token || !companyId}
                />
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <IndianRupee size={20} />
              Payment Type
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="paymentType" className={styles.label}>
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={form.paymentType}
                  onChange={(e) =>
                    setForm({ ...form, paymentType: e.target.value })
                  }
                  className={styles.input}
                  disabled={!token || !companyId}
                >
                  {PAYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description (optional)
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Optional notes..."
                rows={3}
                disabled={!token || !companyId}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className={styles.formSection}>
            <div className={styles.itemsHeader}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                Expense Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className={styles.buttonAdd}
                disabled={!token || !companyId}
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className={styles.itemsList}>
              {form.items.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemNumber}>Item {index + 1}</span>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className={styles.buttonDelete}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Catalog + Custom Name */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Item <span className={styles.required}>*</span>
                    </label>

                    {/* Catalog Dropdown */}
                    <select
                      value={item.expenseItemId ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === "-1") {
                          handleItemChange(index, "expenseItemId", null)
                          handleItemChange(index, "itemName", "")
                          handleItemChange(index, "perItemRate", "")
                        } else {
                          const selected = expenseItemsCatalog.find(
                            (c) => c.expenseItemId === Number(val)
                          )
                          if (selected) handleCatalogSelect(index, selected)
                        }
                      }}
                      className={styles.input}
                      style={{ marginBottom: "8px" }}
                    >
                      <option value="">-- Select from catalog --</option>
                      {expenseItemsCatalog.map((cat) => (
                        <option
                          key={cat.expenseItemId}
                          value={cat.expenseItemId}
                        >
                          {cat.name} (₹{cat.price}
                          {cat.priceTaxType === "WITHTAX" &&
                          cat.taxRate !== "NONE"
                            ? ` + ${cat.taxRate}% tax`
                            : ""}
                          )
                        </option>
                      ))}
                      <option value={-1}>[Custom Item]</option>
                    </select>

                    {/* Custom Name */}
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      required
                      className={styles.input}
                      placeholder="Enter custom item name"
                      disabled={!!item.expenseItemId}
                    />
                  </div>

                  {/* Quantity, Rate, Total */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Rate/Unit <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.perItemRate}
                        onChange={(e) =>
                          handleItemChange(index, "perItemRate", e.target.value)
                        }
                        required
                        className={styles.input}
                        disabled={!!item.expenseItemId}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Total</label>
                      <div className={styles.valueDisplayTotal}>
                        <IndianRupee size={16} />
                        <span>{item.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Expense Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Grand Total</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
                  <IndianRupee size={14} />
                  {form.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateExpense