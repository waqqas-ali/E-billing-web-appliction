"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/Form.module.css";

import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Users,
  Calendar,
  CreditCard,
  MapPin,
  IndianRupee,
  Loader,
  Package,
  FileText,
  Phone,
} from "lucide-react";

const CreateSale = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const editId = query.get("edit");

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [loading, setLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  // -----------------------------------------------------------------
  // Form State (unchanged)
  // -----------------------------------------------------------------
  const [formData, setFormData] = useState({
    partyId: "",
    billingAddress: "",
    shippingAddress: "",
    invoiceNumber: "",
    invoceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    saleType: "CASH",
    stateOfSupply: "ANDHRA_PRADESH",
    paymentType: "CASH",
    paymentDescription: "",
    totalAmountWithoutTax: 0,
    totalTaxAmount: 0,
    deliveryCharges: 0,
    totalAmount: 0,
    receivedAmount: 0,
    balance: 0,
    overdue: false,
    paid: false,
    saleItems: [
      {
        itemId: "",
        itemName: "",
        itemHsnCode: "",
        itemDescription: "",
        quantity: 1,
        unit: "CARTONS",
        pricePerUnit: 0,
        pricePerUnitTaxType: "WITHTAX",
        taxRate: "NONE",
        taxAmount: 0,
        totalAmount: 0,
      },
    ],
  });

  // -----------------------------------------------------------------
  // Handlers (unchanged)
  // -----------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getTaxRateValue = (taxRateString) => {
    switch (taxRateString) {
      case "GST0POINT25":
      case "IGST0POINT25":
        return 0.0025;
      case "GST3":
      case "IGST3":
        return 0.03;
      case "GST5":
      case "IGST5":
        return 0.05;
      case "GST12":
      case "IGST12":
        return 0.12;
      case "GST18":
      case "IGST18":
        return 0.18;
      case "GST28":
      case "IGST28":
        return 0.28;
      case "GST0":
      case "IGST0":
      case "EXEMPTED":
      case "NONE":
      default:
        return 0;
    }
  };

  const calculateItemTotals = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const pricePerUnit = parseFloat(item.pricePerUnit) || 0;
    const taxRateValue = getTaxRateValue(item.taxRate);

    let itemTotalWithoutTax = 0;
    let itemTaxAmount = 0;
    let itemTotalWithTax = 0;

    if (item.pricePerUnitTaxType === "WITHTAX") {
      itemTotalWithTax = quantity * pricePerUnit;
      if (taxRateValue > 0) {
        itemTotalWithoutTax = itemTotalWithTax / (1 + taxRateValue);
        itemTaxAmount = itemTotalWithTax - itemTotalWithoutTax;
      } else {
        itemTotalWithoutTax = itemTotalWithTax;
        itemTaxAmount = 0;
      }
    } else {
      itemTotalWithoutTax = quantity * pricePerUnit;
      itemTaxAmount = itemTotalWithoutTax * taxRateValue;
      itemTotalWithTax = itemTotalWithoutTax + itemTaxAmount;
    }

    return {
      totalAmountWithoutTax: parseFloat(itemTotalWithoutTax.toFixed(2)),
      taxAmount: parseFloat(itemTaxAmount.toFixed(2)),
      totalAmount: parseFloat(itemTotalWithTax.toFixed(2)),
    };
  };

  const handleItemChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const itemsCopy = [...formData.saleItems];
    itemsCopy[idx] = {
      ...itemsCopy[idx],
      [name]: type === "checkbox" ? checked : value,
    };

    if (
      name === "quantity" ||
      name === "pricePerUnit" ||
      name === "pricePerUnitTaxType" ||
      name === "taxRate"
    ) {
      const itemCalculations = calculateItemTotals(itemsCopy[idx]);
      itemsCopy[idx].taxAmount = itemCalculations.taxAmount;
      itemsCopy[idx].totalAmount = itemCalculations.totalAmount;
    }

    setFormData((prev) => ({ ...prev, saleItems: itemsCopy }));
  };

  const handleItemSelect = (idx, selectedItemId) => {
    const selectedItem = items.find(
      (item) => item.itemId === parseInt(selectedItemId)
    );

    if (selectedItem) {
      const updatedSaleItems = [...formData.saleItems];
      updatedSaleItems[idx] = {
        ...updatedSaleItems[idx],
        itemId: selectedItem.itemId,
        itemName: selectedItem.itemName,
        itemHsnCode: selectedItem.itemHsn,
        itemDescription: selectedItem.description,
        quantity: updatedSaleItems[idx].quantity || 1,
        unit: selectedItem.baseUnit,
        pricePerUnit: selectedItem.salePrice,
        pricePerUnitTaxType: selectedItem.saleTaxType,
        taxRate: selectedItem.taxRate,
      };

      const itemCalculations = calculateItemTotals(updatedSaleItems[idx]);
      updatedSaleItems[idx].taxAmount = itemCalculations.taxAmount;
      updatedSaleItems[idx].totalAmount = itemCalculations.totalAmount;

      setFormData((prev) => ({ ...prev, saleItems: updatedSaleItems }));
    } else {
      const updatedSaleItems = [...formData.saleItems];
      updatedSaleItems[idx] = {
        ...updatedSaleItems[idx],
        itemId: "",
        itemName: "",
        itemHsnCode: "",
        itemDescription: "",
        quantity: 1,
        unit: "CARTONS",
        pricePerUnit: 0,
        pricePerUnitTaxType: "WITHTAX",
        taxRate: "NONE",
        taxAmount: 0,
        totalAmount: 0,
      };
      setFormData((prev) => ({ ...prev, saleItems: updatedSaleItems }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      saleItems: [
        ...prev.saleItems,
        {
          itemId: "",
          itemName: "",
          itemHsnCode: "",
          itemDescription: "",
          quantity: 1,
          unit: "CARTONS",
          pricePerUnit: 0,
          pricePerUnitTaxType: "WITHTAX",
          taxRate: "NONE",
          taxAmount: 0,
          totalAmount: 0,
        },
      ],
    }));
  };

  const removeItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      saleItems: prev.saleItems.filter((_, i) => i !== idx),
    }));
  };

  // -----------------------------------------------------------------
  // API Calls (unchanged)
  // -----------------------------------------------------------------
  const fetchParties = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/parties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParties(res.data);
    } catch (err) {
      toast.error("Failed to load parties");
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load items");
    }
  };

  const fetchSale = async (saleId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/sale/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sale = res.data;

      setFormData({
        partyId: sale.partyResponseDto?.id || "",
        billingAddress: sale.billingAddress || "",
        shippingAddress: sale.shippingAddress || "",
        invoiceNumber: sale.invoiceNumber || "",
        invoceDate: sale.invoceDate?.split("T")[0] || "",
        dueDate: sale.dueDate?.split("T")[0] || "",
        saleType: sale.saleType || "CASH",
        stateOfSupply: sale.stateOfSupply || "ANDHRA_PRADESH",
        paymentType: sale.paymentType || "CASH",
        paymentDescription: sale.paymentDescription || "",
        totalAmountWithoutTax: sale.totalAmountWithoutTax || 0,
        totalTaxAmount: sale.totalTaxAmount || 0,
        deliveryCharges: sale.deliveryCharges || 0,
        totalAmount: sale.totalAmount || 0,
        receivedAmount: sale.receivedAmount || 0,
        balance: sale.balance || 0,
        overdue: sale.overdue || false,
        paid: sale.paid || false,
        saleItems:
          sale.saleItemResponses?.map((it) => ({
            itemId: it.itemId || "",
            itemName: it.itemName || "",
            itemHsnCode: it.itemHsnCode || "",
            itemDescription: it.itemDescription || "",
            quantity: it.quantity || 1,
            unit: it.unit || "CARTONS",
            pricePerUnit: it.pricePerUnit || 0,
            pricePerUnitTaxType: it.pricePerUnitTaxType || "WITHTAX",
            taxRate: it.taxRate || "NONE",
            taxAmount: it.taxAmount || 0,
            totalAmount: it.totalAmount || 0,
          })) || [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load sale");
      navigate("/sales");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Load on Mount (unchanged)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!token || !companyId) {
      navigate("/login");
      return;
    }
    fetchParties();
    fetchItems();
    if (editId) fetchSale(editId);
  }, [token, companyId, editId, navigate]);

  // -----------------------------------------------------------------
  // Overall Totals (unchanged)
  // -----------------------------------------------------------------
  const calculateOverallTotals = (
    currentSaleItems,
    currentDeliveryCharges,
    currentReceivedAmount
  ) => {
    let totalAmountWithoutTax = 0;
    let totalTaxAmount = 0;
    let totalAmount = 0;

    currentSaleItems.forEach((item) => {
      const itemCalculations = calculateItemTotals(item);
      totalAmountWithoutTax += itemCalculations.totalAmountWithoutTax;
      totalTaxAmount += itemCalculations.taxAmount;
      totalAmount += itemCalculations.totalAmount;
    });

    const delivery = parseFloat(currentDeliveryCharges) || 0;
    totalAmount += delivery;

    const received = parseFloat(currentReceivedAmount) || 0;
    const balance = totalAmount - received;

    return {
      totalAmountWithoutTax: parseFloat(totalAmountWithoutTax.toFixed(2)),
      totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    };
  };

  useEffect(() => {
    const {
      totalAmountWithoutTax,
      totalTaxAmount,
      totalAmount,
      balance,
    } = calculateOverallTotals(
      formData.saleItems,
      formData.deliveryCharges,
      formData.receivedAmount
    );

    setFormData((prev) => ({
      ...prev,
      totalAmountWithoutTax,
      totalTaxAmount,
      totalAmount,
      balance,
    }));
  }, [formData.saleItems, formData.deliveryCharges, formData.receivedAmount]);

  // -----------------------------------------------------------------
  // Submit (unchanged)
  // -----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !companyId) {
      toast.error("Authentication required");
      return;
    }

    setLoading(true);
    setMessage("");

    const dataToSend = { ...formData };

    try {
      const url = editId
        ? `${config.BASE_URL}/sale/${editId}`
        : `${config.BASE_URL}/company/${companyId}/create-sale`;

      const method = editId ? axios.put : axios.post;

      await method(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(editId ? "Sale updated!" : "Sale created!");
      navigate("/sales");
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      setMessage(`Error: ${msg}`);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Constants (unchanged)
  // -----------------------------------------------------------------
  const saleTypes = ["CASH", "CREDIT"];
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA",
    "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA",
    "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND",
    "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
    "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
  ];
  const units = [
    "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS",
    "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS",
    "CANS", "SQUARE_FEET",
  ];
  const taxTypes = ["WITHTAX", "WITHOUTTAX"];
  const taxRates = [
    "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
    "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18",
    "GST28", "IGST28",
  ];
  const paymentTypes = [
    "CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET",
    "CHEQUE", "OTHER",
  ];

  const isEditMode = !!editId;

  // -----------------------------------------------------------------
  // Render – UI identical to CreateSaleOrder
  // -----------------------------------------------------------------
  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading sale data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ==== HEADER ==== */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>
                {isEditMode ? (
                  <>
                    <CheckCircle className={styles.titleIcon} />
                    Edit Sale
                  </>
                ) : (
                  <>
                    <FileText className={styles.titleIcon} />
                    Create Sale
                  </>
                )}
              </h1>
              <p className={styles.subtitle}>
                {isEditMode
                  ? `Invoice #${formData.invoiceNumber}`
                  : "Enter invoice details and items"}
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate("/sales")}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditMode ? "Update Sale" : "Create Sale"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ==== PARTY INFO ==== */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Users size={20} />
            Party Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="party" className={styles.label}>
                Party <span className={styles.required}>*</span>
              </label>
              <select
                id="party"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
                className={styles.input}
                disabled={loading}
              >
                <option value="">Select Party</option>
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="invoiceNumber" className={styles.label}>
                Invoice Number
              </label>
              <input
                id="invoiceNumber"
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. INV-001"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone No
              </label>
              <div className={styles.inputIcon}>
                <Phone size={18} />
                <input
                  id="phone"
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo || ""}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==== DATES ==== */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Calendar size={20} />
            Important Dates
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="invoceDate" className={styles.label}>
                Invoice Date <span className={styles.required}>*</span>
              </label>
              <input
                id="invoceDate"
                type="date"
                name="invoceDate"
                value={formData.invoceDate}
                onChange={handleChange}
                required
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dueDate" className={styles.label}>
                Due Date <span className={styles.required}>*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={formData.invoceDate}
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* ==== PAYMENT & LOCATION ==== */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <CreditCard size={20} />
            Payment & Location
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="saleType" className={styles.label}>
                Sale Type
              </label>
              <select
                id="saleType"
                name="saleType"
                value={formData.saleType}
                onChange={handleChange}
                className={styles.input}
                disabled={loading}
              >
                {saleTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stateOfSupply" className={styles.label}>
                State of Supply
              </label>
              <div className={styles.inputIcon}>
                <MapPin size={18} />
                <select
                  id="stateOfSupply"
                  name="stateOfSupply"
                  value={formData.stateOfSupply}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="paymentType" className={styles.label}>
                Payment Type
              </label>
              <select
                id="paymentType"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className={styles.input}
                disabled={loading}
              >
                {paymentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ==== ADDRESSES ==== */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Addresses</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="billingAddress" className={styles.label}>
                Billing Address
              </label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shippingAddress" className={styles.label}>
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* ==== PAYMENT DESCRIPTION ==== */}
        <div className={styles.formSection}>
          <label htmlFor="paymentDescription" className={styles.label}>
            Payment Description
          </label>
          <textarea
            id="paymentDescription"
            name="paymentDescription"
            value={formData.paymentDescription}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            placeholder="Optional notes..."
            disabled={loading}
          />
        </div>

        {/* ==== ITEMS ==== */}
        <div className={styles.formSection}>
          <div className={styles.itemsHeader}>
            <h2 className={styles.sectionTitle}>
              <Package size={20} />
              Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className={styles.buttonAdd}
              disabled={loading}
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>

          <div className={styles.itemsList}>
            {formData.saleItems.map((it, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemNumber}>Item {idx + 1}</span>
                  {formData.saleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className={styles.buttonDelete}
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Item select & HSN */}
                <div className={styles.itemGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Item <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={it.itemId || ""}
                      onChange={(e) => handleItemSelect(idx, e.target.value)}
                      required
                      className={styles.input}
                      disabled={loading}
                    >
                      <option value="">-- Select Item --</option>
                      {items.map((i) => (
                        <option key={i.itemId} value={i.itemId}>
                          {i.itemName} (HSN: {i.itemHsn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>HSN</label>
                    <input
                      type="text"
                      value={it.itemHsnCode}
                      readOnly
                      className={`${styles.input} ${styles.inputReadonly}`}
                    />
                  </div>
                </div>

                {/* Quantity & Unit */}
                <div className={styles.itemGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Quantity <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="quantity"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(idx, e)}
                      required
                      className={styles.input}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Unit</label>
                    <select
                      name="unit"
                      value={it.unit}
                      onChange={(e) => handleItemChange(idx, e)}
                      className={styles.input}
                      disabled={loading}
                    >
                      {units.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rate & Tax type */}
                <div className={styles.itemGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Rate/Unit <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="pricePerUnit"
                      value={it.pricePerUnit}
                      onChange={(e) => handleItemChange(idx, e)}
                      required
                      className={styles.input}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tax Type</label>
                    <select
                      name="pricePerUnitTaxType"
                      value={it.pricePerUnitTaxType}
                      onChange={(e) => handleItemChange(idx, e)}
                      className={styles.input}
                      disabled={loading}
                    >
                      {taxTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tax Rate</label>
                    <select
                      name="taxRate"
                      value={it.taxRate}
                      onChange={(e) => handleItemChange(idx, e)}
                      className={styles.input}
                      disabled={loading}
                    >
                      {taxRates.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Totals per item */}
                <div className={styles.itemGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tax Amount</label>
                    <div className={styles.valueDisplay}>
                      <IndianRupee size={16} />
                      <span>{it.taxAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Total</label>
                    <div className={`${styles.valueDisplay} ${styles.valueDisplayTotal}`}>
                      <IndianRupee size={16} />
                      <span>{it.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Optional description */}
                <div className={styles.itemGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      name="itemDescription"
                      value={it.itemDescription}
                      readOnly
                      className={`${styles.input} ${styles.textarea}`}
                      rows={2}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==== SUMMARY ==== */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total (ex-tax)</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {formData.totalAmountWithoutTax.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Tax</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {formData.totalTaxAmount.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Delivery Charges</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {(parseFloat(formData.deliveryCharges) || 0).toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Amount</span>
              <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
                <IndianRupee size={14} />
                {formData.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Received Amount</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {(parseFloat(formData.receivedAmount) || 0).toFixed(2)}
              </span>
            </div>

            <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
              <span className={styles.summaryLabel}>Balance</span>
              <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
                <IndianRupee size={14} />
                {formData.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery & Received (editable) */}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.formGroup}>
              <label htmlFor="deliveryCharges" className={styles.label}>
                Delivery Charges
              </label>
              <div className={styles.inputIcon}>
                <IndianRupee size={18} />
                <input
                  id="deliveryCharges"
                  type="number"
                  step="0.01"
                  name="deliveryCharges"
                  value={formData.deliveryCharges}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="receivedAmount" className={styles.label}>
                Received Amount
              </label>
              <div className={styles.inputIcon}>
                <IndianRupee size={18} />
                <input
                  id="receivedAmount"
                  type="number"
                  step="0.01"
                  name="receivedAmount"
                  value={formData.receivedAmount}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Overdue / Paid */}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  name="overdue"
                  checked={formData.overdue}
                  onChange={handleChange}
                  disabled={loading}
                />{" "}
                Overdue
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  name="paid"
                  checked={formData.paid}
                  onChange={handleChange}
                  disabled={loading}
                />{" "}
                Paid
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;