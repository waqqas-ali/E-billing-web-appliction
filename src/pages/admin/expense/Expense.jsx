// // src/pages/expenses/Expense.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Expense.module.css";
// import { toast } from "react-toastify";

// const Expense = () => {
//   const navigate = useNavigate();

//   // Auth & Company
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   // State
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState(null);

//   // Fetch Expenses
//   const fetchExpenses = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/all/expense`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setExpenses(res.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, [token, companyId]);

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Expenses</h1>
//           <p className={styles.subtitle}>Track every business expense</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_expense")}
//           className={styles.createBtn}
//           disabled={loading}
//         >
//           + Create Expense
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles.loading}>
//           <div className={styles.spinner}>⟳</div>
//           <p>Loading expenses...</p>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && expenses.length > 0 && (
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Date</th>
//                 <th>Category</th>
//                 <th>Payment</th>
//                 <th>Total</th>
//                 <th>Items</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map((exp) => (
//                 <tr key={exp.expenseNo}>
//                   <td className={styles.nameCell}>#{exp.expenseNo}</td>
//                   <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
//                   <td>{exp.expensesCategoryResponse?.categoryName || "—"}</td>
//                   <td>
//                     <span className={styles.badge}>{exp.paymentType}</span>
//                   </td>
//                   <td>₹{parseFloat(exp.totalAmount).toFixed(2)}</td>
//                   <td>{exp.addExpenseItemResponses?.length || 0}</td>
//                   <td className={styles.actionsCell}>
//                     <button
//                       onClick={() => setSelectedExpense(exp)}
//                       className={styles.editBtn}
//                       title="View details"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && expenses.length === 0 && (
//         <div className={styles.empty}>
//           <div className={styles.emptyIcon}>📊</div>
//           <p>No expenses found</p>
//           <p className={styles.emptySub}>
//             Click "Create Expense" to record your first entry.
//           </p>
//         </div>
//       )}

//       {/* View Modal */}
//       {selectedExpense && (
//         <div 
//           className={styles.modalOverlay} 
//           onClick={() => setSelectedExpense(null)}
//         >
//           <div 
//             className={styles.modal} 
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles.modalHeader}>
//               <h2 className={styles.modalTitle}>
//                 Expense #{selectedExpense.expenseNo}
//               </h2>
//               <button 
//                 className={styles.closeBtn} 
//                 onClick={() => setSelectedExpense(null)}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className={styles.modalForm}>
//               {/* Overview */}
//               <section className={styles.section}>
//                 <h3 className={styles.sectionTitle}>📋 Overview</h3>
//                 <div className={styles.formGrid}>
//                   <div className={styles.formGroup}>
//                     <label>Date</label>
//                     <input
//                       type="text"
//                       value={new Date(selectedExpense.expenseDate).toLocaleDateString()}
//                       readOnly
//                       className={styles.formInputReadOnly}
//                     />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Category</label>
//                     <input
//                       type="text"
//                       value={selectedExpense.expensesCategoryResponse?.categoryName || "—"}
//                       readOnly
//                       className={styles.formInputReadOnly}
//                     />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Payment Type</label>
//                     <input
//                       type="text"
//                       value={selectedExpense.paymentType}
//                       readOnly
//                       className={styles.formInputReadOnly}
//                     />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Total Amount</label>
//                     <input
//                       type="text"
//                       value={`₹${parseFloat(selectedExpense.totalAmount).toFixed(2)}`}
//                       readOnly
//                       className={styles.formInputReadOnly}
//                     />
//                   </div>
//                   <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
//                     <label>Description</label>
//                     <textarea
//                       value={selectedExpense.description || "No description"}
//                       readOnly
//                       rows={3}
//                     />
//                   </div>
//                 </div>
//               </section>

//               {/* Items */}
//               <section className={styles.section}>
//                 <h3 className={styles.sectionTitle}>
//                   🛒 Expense Items ({selectedExpense.addExpenseItemResponses?.length || 0})
//                 </h3>
//                 {selectedExpense.addExpenseItemResponses?.length > 0 ? (
//                   <div className={styles.itemList}>
//                     {selectedExpense.addExpenseItemResponses.map((item, idx) => (
//                       <div key={idx} className={styles.itemRow}>
//                         <span className={styles.itemName}>
//                           {item.itemName}
//                         </span>
//                         <span>
//                           {item.quantity} × ₹{parseFloat(item.perItemRate).toFixed(2)}
//                         </span>
//                         <span className={styles.itemTotal}>
//                           ₹{parseFloat(item.totalAmount).toFixed(2)}
//                         </span>
//                       </div>
//                     ))}
//                     <div className={styles.totalRow}>
//                       <strong>Grand Total</strong>
//                       <strong>
//                         ₹{parseFloat(selectedExpense.totalAmount).toFixed(2)}
//                       </strong>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className={styles.empty}>
//                     <p>No items recorded for this expense</p>
//                   </div>
//                 )}
//               </section>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Expense;





// src/pages/expenses/Expense.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css";
import { toast } from "react-toastify";

import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  DollarSign,
  Package,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

const Expense = () => {
  const navigate = useNavigate();

  // Auth & Company
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  // State
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Expenses (unchanged)
  const fetchExpenses = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/get/all/expense`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setExpenses(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token, companyId]);

  // DELETE: /expense/{expenseId}
  const deleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/expense/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prev) => prev.filter((e) => e.expenseNo !== expenseId));
      toast.success("Expense deleted successfully");
      setSelectedExpense(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleEdit = (expenseId) => {
    navigate(`/create_expense?edit=${expenseId}`);
    setSelectedExpense(null);
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.expenseNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.expensesCategoryResponse?.categoryName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Expenses</h1>
            <p className={styles["form-subtitle"]}>Track every business expense</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create_expense")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Create Expense</span>
        </button>
      </div>

      {/* Search */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by expense # or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading expenses...</p>
        </div>
      )}

      {/* Table / Cards */}
      {filteredExpenses.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.expenseNo} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>#{exp.expenseNo}</span>
                    </td>
                    <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>
                        {exp.expensesCategoryResponse?.categoryName || "—"}
                      </span>
                    </td>
                    <td>
                      <span className={styles["badge"]}>{exp.paymentType}</span>
                    </td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{parseFloat(exp.totalAmount).toFixed(2)}
                      </span>
                    </td>
                    <td>{exp.addExpenseItemResponses?.length || 0}</td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedExpense(exp)}
                        className={`${styles["action-button"]} ${styles["view-button"]}`}
                        title="View details"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles["mobile-cards-container"]}>
            {filteredExpenses.map((exp) => (
              <div key={exp.expenseNo} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>#{exp.expenseNo}</h3>
                    <span className={styles["status-badge-paid"]}>
                      {exp.paymentType}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedExpense(exp)}
                    className={styles["card-action-button"]}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>
                      {new Date(exp.expenseDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Category:</span>
                    <span className={styles["info-value"]}>
                      {exp.expensesCategoryResponse?.categoryName || "—"}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{parseFloat(exp.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Items:</span>
                    <span className={styles["info-value"]}>
                      {exp.addExpenseItemResponses?.length || 0}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button
                    onClick={() => setSelectedExpense(exp)}
                    className={styles["card-view-button"]}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles["no-data"]}>
          <Package size={48} />
          <p>No expenses found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : 'Click "Create Expense" to add your first entry.'}
          </p>
        </div>
      )}

      {/* View/Edit/Delete Modal */}
      {selectedExpense && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedExpense(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Expense #{selectedExpense.expenseNo}</h3>
                <div className={styles["balance-badge"]}>
                  <DollarSign size={16} />
                  Total: ₹{parseFloat(selectedExpense.totalAmount).toFixed(2)}
                </div>
              </div>

              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handleEdit(selectedExpense.expenseNo)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit expense"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => deleteExpense(selectedExpense.expenseNo)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete expense"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedExpense(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Overview */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Overview</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedExpense.expenseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Category:</span>
                  <span className={styles["detail-value"]}>
                    {selectedExpense.expensesCategoryResponse?.categoryName || "—"}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selectedExpense.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Total Amount:</span>
                  <span className={styles["detail-value"]}>
                    ₹{parseFloat(selectedExpense.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>
                    {selectedExpense.description || "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>
                Items ({selectedExpense.addExpenseItemResponses?.length || 0})
              </h4>

              {selectedExpense.addExpenseItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
                  <table className={styles["items-table"]}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExpense.addExpenseItemResponses.map((it, i) => (
                        <tr key={i}>
                          <td>{it.itemName}</td>
                          <td>{it.quantity}</td>
                          <td>₹{parseFloat(it.perItemRate).toFixed(2)}</td>
                          <td>₹{parseFloat(it.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className={styles["amount-breakdown"]}>
                    <div className={styles["breakdown-row"]}>
                      <span>Grand Total</span>
                      <span className={styles["total-amount"]}>
                        ₹{parseFloat(selectedExpense.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No items recorded for this expense</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;