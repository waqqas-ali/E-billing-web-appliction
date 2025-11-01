// src/pages/expenses/Expense.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Expense.module.css";
import { toast } from "react-toastify";

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

  // Fetch Expenses
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>Track every business expense</p>
        </div>
        <button
          onClick={() => navigate("/create_expense")}
          className={styles.createBtn}
          disabled={loading}
        >
          + Create Expense
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}>⟳</div>
          <p>Loading expenses...</p>
        </div>
      )}

      {/* Table */}
      {!loading && expenses.length > 0 && (
        <div className={styles.tableContainer}>
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
              {expenses.map((exp) => (
                <tr key={exp.expenseNo}>
                  <td className={styles.nameCell}>#{exp.expenseNo}</td>
                  <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                  <td>{exp.expensesCategoryResponse?.categoryName || "—"}</td>
                  <td>
                    <span className={styles.badge}>{exp.paymentType}</span>
                  </td>
                  <td>₹{parseFloat(exp.totalAmount).toFixed(2)}</td>
                  <td>{exp.addExpenseItemResponses?.length || 0}</td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => setSelectedExpense(exp)}
                      className={styles.editBtn}
                      title="View details"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && expenses.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <p>No expenses found</p>
          <p className={styles.emptySub}>
            Click "Create Expense" to record your first entry.
          </p>
        </div>
      )}

      {/* View Modal */}
      {selectedExpense && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setSelectedExpense(null)}
        >
          <div 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Expense #{selectedExpense.expenseNo}
              </h2>
              <button 
                className={styles.closeBtn} 
                onClick={() => setSelectedExpense(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalForm}>
              {/* Overview */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>📋 Overview</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input
                      type="text"
                      value={new Date(selectedExpense.expenseDate).toLocaleDateString()}
                      readOnly
                      className={styles.formInputReadOnly}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <input
                      type="text"
                      value={selectedExpense.expensesCategoryResponse?.categoryName || "—"}
                      readOnly
                      className={styles.formInputReadOnly}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Payment Type</label>
                    <input
                      type="text"
                      value={selectedExpense.paymentType}
                      readOnly
                      className={styles.formInputReadOnly}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Total Amount</label>
                    <input
                      type="text"
                      value={`₹${parseFloat(selectedExpense.totalAmount).toFixed(2)}`}
                      readOnly
                      className={styles.formInputReadOnly}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label>Description</label>
                    <textarea
                      value={selectedExpense.description || "No description"}
                      readOnly
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              {/* Items */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  🛒 Expense Items ({selectedExpense.addExpenseItemResponses?.length || 0})
                </h3>
                {selectedExpense.addExpenseItemResponses?.length > 0 ? (
                  <div className={styles.itemList}>
                    {selectedExpense.addExpenseItemResponses.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <span className={styles.itemName}>
                          {item.itemName}
                        </span>
                        <span>
                          {item.quantity} × ₹{parseFloat(item.perItemRate).toFixed(2)}
                        </span>
                        <span className={styles.itemTotal}>
                          ₹{parseFloat(item.totalAmount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className={styles.totalRow}>
                      <strong>Grand Total</strong>
                      <strong>
                        ₹{parseFloat(selectedExpense.totalAmount).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <p>No items recorded for this expense</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;