import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Expense.module.css";
import { toast } from "react-toastify";

const PAYMENT_TYPES = [
  "CASH",
  "UPI",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "NET_BANKING",
  "WALLET",
  "CHEQUE",
  "OTHER",
];

const CreateExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("edit"); // ?edit=123

  // Auth
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  // State
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    expenseCategoryId: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paymentType: "CASH",
    description: "",
    items: [
      {
        itemName: "",
        quantity: "",
        perItemRate: "",
        totalAmount: 0,
      },
    ],
    totalAmount: 0,
  });

  // Fetch Categories
  const fetchCategories = async () => {
    if (!token || !companyId) return;
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/expenses-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  // Load Expense for Edit
  const fetchExpense = async (id) => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const e = res.data;

      setForm({
        expenseCategoryId: e.expenseCategoryId?.toString() || "",
        expenseDate: e.expenseDate?.split("T")[0] || "",
        paymentType: e.paymentType || "CASH",
        description: e.description || "",
        items:
          e.addExpenseItemResponses?.map((it) => ({
            expenseItemId: it.expenseItemId,
            itemName: it.itemName || "",
            quantity: it.quantity?.toString() || "",
            perItemRate: it.perItemRate?.toString() || "",
            totalAmount: it.totalAmount || 0,
          })) || [],
        totalAmount: e.totalAmount || 0,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expense");
      navigate("/expenses");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && companyId) {
      fetchCategories();
      if (editId) fetchExpense(editId);
    }
  }, [token, companyId, editId]);

  // Calculate single item
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.perItemRate) || 0;
    const total = qty * rate;
    return { ...item, totalAmount: parseFloat(total.toFixed(2)) };
  };

  // Recalculate all items & grand total
  const recalculateTotals = (items) => {
    const calculated = items.map(calculateItem);
    const grandTotal = calculated.reduce((sum, i) => sum + i.totalAmount, 0);
    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalAmount: parseFloat(grandTotal.toFixed(2)),
    }));
  };

  // Handle item field change
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    recalculateTotals(newItems);
  };

  // Add new item row
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          quantity: "",
          perItemRate: "",
          totalAmount: 0,
        },
      ],
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    recalculateTotals(newItems);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !companyId) {
      toast.error("Please login and select a company");
      return;
    }

    if (!form.expenseCategoryId || !form.expenseDate) {
      toast.error("Category and Date are required");
      return;
    }

    const invalidItem = form.items.some(
      (i) =>
        !i.itemName ||
        !i.quantity ||
        !i.perItemRate ||
        parseFloat(i.quantity) <= 0 ||
        parseFloat(i.perItemRate) <= 0
    );
    if (invalidItem) {
      toast.error("Each item must have Name, Quantity > 0, Rate > 0");
      return;
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
    };

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        await axios.put(`${config.BASE_URL}/expense/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Expense updated successfully!");
      } else {
        // CREATE
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/create-expense`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Expense created successfully!");
      }

      navigate("/expenses");
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to ${editId ? "update" : "create"} expense`
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>
            {isEditMode ? "Edit Expense" : "Create Expense"}
          </h1>
          <p className={styles["form-subtitle"]}>
            {isEditMode ? `Expense #${editId}` : "Record a new business expense"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className={styles["cancel-button"]}
            disabled={loading || loadingData}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="expenseForm"
            className={styles["submit-button"]}
            disabled={loading || loadingData}
          >
            {loading ? "Saving..." : isEditMode ? "Update Expense" : "Create Expense"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loadingData && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading expense data...</p>
        </div>
      )}

      {/* Form */}
      {!loadingData && (
        <form id="expenseForm" onSubmit={handleSubmit}>
          {/* Category & Date */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                value={form.expenseCategoryId}
                onChange={(e) =>
                  setForm({ ...form, expenseCategoryId: e.target.value })
                }
                required
                className={styles["form-input"]}
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

            <div className={styles["form-group"]}>
              <label>
                Expense Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                value={form.expenseDate}
                onChange={(e) =>
                  setForm({ ...form, expenseDate: e.target.value })
                }
                required
                className={styles["form-input"]}
                disabled={!token || !companyId}
              />
            </div>
          </div>

          {/* Payment Type */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Payment Type</label>
              <select
                value={form.paymentType}
                onChange={(e) =>
                  setForm({ ...form, paymentType: e.target.value })
                }
                className={styles["form-input"]}
                disabled={!token || !companyId}
              >
                {PAYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]} />
          </div>

          {/* Description */}
          <div className={styles["form-group"]}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={`${styles["form-input"]} ${styles.textarea}`}
              rows={2}
              placeholder="Optional notes..."
              disabled={!token || !companyId}
            />
          </div>

          {/* Items Section */}
          <div className={styles["card-section"]}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h4 style={{ margin: 0 }}>Expense Items</h4>
              <button
                type="button"
                onClick={addItem}
                className={styles["submit-button"]}
                style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                disabled={!token || !companyId}
              >
                + Add Item
              </button>
            </div>

            {form.items.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "16px",
                  background: "#fafafa",
                }}
              >
                {/* Item Name */}
                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>
                      Item Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      required
                      className={styles["form-input"]}
                      placeholder="e.g. Printer Ink"
                    />
                  </div>
                </div>

                {/* Qty, Rate, Total */}
                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>
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
                      className={styles["form-input"]}
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label>
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
                      className={styles["form-input"]}
                    />
                  </div>

                  <div className={styles["form-group"]}>
                    <label>Total</label>
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "#e8f5e9",
                        borderRadius: "6px",
                        fontWeight: "600",
                        color: "#27ae60",
                      }}
                    >
                      ₹{item.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className={styles["delete-button"]}
                    style={{ marginTop: "8px", fontSize: "0.8rem" }}
                  >
                    Remove Item
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div
            className={styles["card-section"]}
            style={{
              background: "#f0f7ff",
              padding: "16px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "24px",
                fontSize: "1.1rem",
              }}
            >
              <strong>Grand Total: ₹{form.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateExpense;