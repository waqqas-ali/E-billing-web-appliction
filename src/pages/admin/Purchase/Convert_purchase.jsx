"use client"

import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/Form.module.css"
import { toast } from "react-toastify"
import {
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Package,
  Users,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  IndianRupee,
  Loader,
  RefreshCw,
} from "lucide-react"

const ConvertPurchase = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const purchaseOrderId = queryParams.get("id")

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])               // <-- master items list

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
  ]

  const TAX_RATE_MAP = {
    NONE: 0, EXEMPTED: 0,
    GST0: 0, IGST0: 0,
    GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
    GST3: 0.03, IGST3: 0.03,
    GST5: 0.05, IGST5: 0.05,
    GST12: 0.12, IGST12: 0.12,
    GST18: 0.18, IGST18: 0.18,
    GST28: 0.28, IGST28: 0.28,
  }

  const [form, setForm] = useState({
    partyId: "",
    billNumber: "",
    billDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    stateOfSupply: "MAHARASHTRA",
    paymentType: "CASH",
    paymentDescription: "",
    deliveryCharges: "0",
    sendAmount: "0",
    items: [],
    totalQuantity: 0,
    totalTaxAmount: 0,
    totalAmountWithoutTax: 0,
    totalAmount: 0,
    balance: 0,
  })

  /* ==================== FETCH DATA ==================== */
  const fetchParties = async () => {
    if (!token || !companyId) return
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setParties(res.data || [])
    } catch (err) {
      toast.error("Failed to load parties")
    }
  }

  const fetchItems = async () => {
    if (!token || !companyId) return
    setLoadingItems(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(res.data || [])
    } catch (err) {
      toast.error("Failed to load items")
    } finally {
      setLoadingItems(false)
    }
  }

  const fetchPurchaseOrder = async (poId) => {
    if (!token || !companyId || !poId) return
    setLoadingData(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/purchase-order/${poId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const po = res.data
      setForm({
        partyId: po.partyResponseDto?.partyId?.toString() || "",
        billNumber: po.orderNumber || "",               // adjust if PO uses different field
        billDate: new Date().toISOString().split("T")[0],
        dueDate: po.dueDate || "",
        stateOfSupply: po.stateOfSupply || "MAHARASHTRA",
        paymentType: "CASH",
        paymentDescription: "",
        deliveryCharges: (po.deliveryCharges || 0).toString(),
        sendAmount: "0",
        items: po.purchaseOrderItemResponses?.map((it) => ({
          // keep the original PO values but also store itemId for the select
          itemId: it.itemId?.toString() || "",
          itemName: it.itemName || "",
          itemHsnCode: it.itemHsnCode || "",
          itemDescription: it.itemDescription || "",
          quantity: it.quantity?.toString() || "",
          unit: it.unit || "PIECES",
          pricePerUnit: it.pricePerUnit?.toString() || "",
          pricePerUnitTaxType: it.pricePerUnitTaxType || "WITHTAX",
          taxRate: it.taxRate || "GST18",
          totalTaxAmount: it.totalTaxAmount || 0,
          totalAmount: it.totalAmount || 0,
        })) || [],
        totalQuantity: po.totalQuantity || 0,
        totalTaxAmount: po.totalTaxAmount || 0,
        totalAmountWithoutTax: po.totalAmountWithoutTax || 0,
        totalAmount: po.totalAmount || 0,
        balance: po.totalAmount || 0,
      })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load purchase order")
      navigate("/purchase_orders")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchParties()
    fetchItems()
    if (purchaseOrderId) fetchPurchaseOrder(purchaseOrderId)
  }, [token, companyId, purchaseOrderId])

  /* ==================== CALCULATIONS ==================== */
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.pricePerUnit) || 0
    const taxRate = TAX_RATE_MAP[item.taxRate] || 0
    const withTax = item.pricePerUnitTaxType === "WITHTAX"

    let subtotal = qty * rate
    let taxAmount = 0

    if (withTax && taxRate > 0) {
      const taxable = subtotal / (1 + taxRate)
      taxAmount = subtotal - taxable
      subtotal = taxable
    } else {
      taxAmount = subtotal * taxRate
    }

    const total = subtotal + taxAmount

    return {
      ...item,
      totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(total.toFixed(2)),
    }
  }

  const recalculateTotals = (newItems) => {
    const calculated = newItems.map(calculateItem)
    const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0)
    const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
    const totalAmtWithoutTax = calculated.reduce((s, i) => s + (i.totalAmount - i.totalTaxAmount), 0)
    const delivery = parseFloat(form.deliveryCharges) || 0
    const totalAmt = totalAmtWithoutTax + totalTax + delivery
    const send = parseFloat(form.sendAmount) || 0
    const balance = totalAmt - send

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: totalQty,
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmountWithoutTax: parseFloat(totalAmtWithoutTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    recalculateTotals(newItems)
  }

  /** Auto-fill when an item is selected from the dropdown */
  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId === Number(itemId))
    if (!selected) return

    const newItems = [...form.items]
    newItems[index] = {
      ...newItems[index],
      itemId: selected.itemId,
      itemName: selected.itemName,
      itemHsnCode: selected.itemHsn,
      itemDescription: selected.itemDescription || "",
      unit: selected.baseUnit,
      pricePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
      pricePerUnitTaxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
      taxRate: selected.taxRate || "GST18",
      quantity: newItems[index].quantity || "1",
    }

    recalculateTotals(newItems)
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          itemName: "",
          itemHsnCode: "",
          itemDescription: "",
          quantity: "",
          unit: "PIECES",
          pricePerUnit: "",
          pricePerUnitTaxType: "WITHTAX",
          taxRate: "GST18",
          totalTaxAmount: 0,
          totalAmount: 0,
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
      toast.error("Login and select company")
      return
    }

    if (!form.partyId || !form.billNumber || !form.billDate || !form.dueDate) {
      toast.error("Fill all required fields")
      return
    }

    const invalidItem = form.items.some(
      (i) => !i.itemName || !i.quantity || !i.pricePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerUnit) <= 0
    )
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0")
      return
    }

    const payload = {
      partyId: parseInt(form.partyId),
      billNumber: form.billNumber.trim(),
      billDate: form.billDate,
      dueDate: form.dueDate,
      stateOfSupply: form.stateOfSupply,
      paymentType: form.paymentType,
      paymentDescription: form.paymentDescription.trim() || null,
      totalTaxAmount: form.totalTaxAmount,
      totalAmountWithoutTax: form.totalAmountWithoutTax,
      deliveryCharges: parseFloat(form.deliveryCharges) || 0,
      totalAmount: form.totalAmount,
      sendAmount: parseFloat(form.sendAmount) || 0,
      balance: form.balance,
      purchaseItemRequests: form.items.map((i) => ({
        itemName: i.itemName.trim(),
        itemHsnCode: i.itemHsnCode,
        itemDescription: i.itemDescription.trim() || null,
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        pricePerUnit: parseFloat(i.pricePerUnit),
        pricePerUnitTaxType: i.pricePerUnitTaxType,
        taxRate: i.taxRate,
        totalTaxAmount: i.totalTaxAmount,
        totalAmount: i.totalAmount,
      })),
    }

    try {
      setLoading(true)
      await axios.post(
        `${config.BASE_URL}/purchase-order/${purchaseOrderId}/convert/to/purchase`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast.success("Purchase order converted to purchase!")
      navigate("/new_purchase")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to convert purchase order")
    } finally {
      setLoading(false)
    }
  }

  /* ==================== RENDER ==================== */
  return (
    <div className={styles.container}>
      {loadingData ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading purchase order...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  <RefreshCw className={styles.titleIcon} />
                  Convert PO to Purchase
                </h1>
                <p className={styles.subtitle}>
                  Convert Purchase Order #{purchaseOrderId} to Bill
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => navigate("/purchase_orders")}
                className={styles.buttonSecondary}
                disabled={loading}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                className={styles.buttonPrimary}
                disabled={loading || loadingData || !token || !companyId || !purchaseOrderId}
              >
                {loading ? (
                  <>
                    <Loader size={18} className={styles.spinnerSmall} />
                    Converting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Convert to Purchase
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Party & Bill Info */}
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
                  value={form.partyId}
                  onChange={(e) => setForm({ ...form, partyId: e.target.value })}
                  required
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                >
                  <option value="">
                    {token && companyId ? "Select Party" : "Login & Select Company"}
                  </option>
                  {parties.map((p) => (
                    <option key={p.partyId} value={p.partyId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="billNumber" className={styles.label}>
                  Bill Number <span className={styles.required}>*</span>
                </label>
                <input
                  id="billNumber"
                  type="text"
                  value={form.billNumber}
                  onChange={(e) => setForm({ ...form, billNumber: e.target.value })}
                  required
                  className={styles.input}
                  placeholder="e.g. PB-001"
                  disabled={!token || !companyId || loadingData}
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Important Dates
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="billDate" className={styles.label}>
                  Bill Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="billDate"
                  type="date"
                  value={form.billDate}
                  onChange={(e) => setForm({ ...form, billDate: e.target.value })}
                  required
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dueDate" className={styles.label}>
                  Due Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                  min={form.billDate}
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                />
              </div>
            </div>
          </div>

          {/* Payment & Location */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <CreditCard size={20} />
              Payment & Location
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="paymentType" className={styles.label}>
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                >
                  {paymentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>
                  State of Supply
                </label>
                <div className={styles.inputIcon}>
                  <MapPin size={18} />
                  <select
                    id="state"
                    value={form.stateOfSupply}
                    onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
                    className={styles.input}
                    disabled={!token || !companyId || loadingData}
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
                <label htmlFor="deliveryCharges" className={styles.label}>
                  Delivery Charges
                </label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    id="deliveryCharges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.deliveryCharges}
                    onChange={(e) => {
                      setForm({ ...form, deliveryCharges: e.target.value })
                      recalculateTotals(form.items)
                    }}
                    className={styles.input}
                    placeholder="0.00"
                    disabled={!token || !companyId || loadingData}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sendAmount" className={styles.label}>
                  Amount Paid
                </label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    id="sendAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.sendAmount}
                    onChange={(e) => {
                      setForm({ ...form, sendAmount: e.target.value })
                      recalculateTotals(form.items)
                    }}
                    className={styles.input}
                    placeholder="0.00"
                    disabled={!token || !companyId || loadingData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Description */}
          <div className={styles.formSection}>
            <label htmlFor="paymentDescription" className={styles.label}>
              Payment Description
            </label>
            <textarea
              id="paymentDescription"
              value={form.paymentDescription}
              onChange={(e) => setForm({ ...form, paymentDescription: e.target.value })}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Optional notes..."
              rows={3}
              disabled={!token || !companyId || loadingData}
            />
          </div>

          {/* Items Section */}
          <div className={styles.formSection}>
            <div className={styles.itemsHeader}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                Items (from PO)
              </h2>
              <button
                type="button"
                onClick={addItem}
                className={styles.buttonAdd}
                disabled={!token || !companyId || loadingItems || loadingData}
              >
                <Plus size={18} />
                Add Extra Item
              </button>
            </div>

            {loadingItems && (
              <div className={styles.loadingMessage}>
                <Loader size={20} className={styles.spinnerSmall} />
                Loading items...
              </div>
            )}

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
                        disabled={!token || !companyId || loadingData}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Item Select & HSN */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Item Name <span className={styles.required}>*</span>
                      </label>
                      <select
                        value={item.itemId || ""}
                        onChange={(e) => handleItemSelect(index, e.target.value)}
                        required
                        className={styles.input}
                        disabled={!token || !companyId || loadingItems || loadingData}
                      >
                        <option value="">-- Select Item --</option>
                        {items.map((i) => (
                          <option key={i.itemId} value={i.itemId}>
                            {i.itemName} ({i.itemCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>HSN</label>
                      <input
                        type="text"
                        value={item.itemHsnCode}
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
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                        className={styles.input}
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>
                  </div>

                  {/* Rate & Taxes */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Rate/Unit <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.pricePerUnit}
                        onChange={(e) => handleItemChange(index, "pricePerUnit", e.target.value)}
                        required
                        className={styles.input}
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Type</label>
                      <input
                        type="text"
                        value={item.pricePerUnitTaxType}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Rate</label>
                      <input
                        type="text"
                        value={item.taxRate}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>
                  </div>

                  {/* Description & Totals */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <input
                        type="text"
                        value={item.itemDescription}
                        onChange={(e) => handleItemChange(index, "itemDescription", e.target.value)}
                        className={styles.input}
                        placeholder="Optional"
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Amount</label>
                      <div className={styles.valueDisplay}>
                        <IndianRupee size={16} />
                        <span>{item.totalTaxAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Total</label>
                      <div className={`${styles.valueDisplay} ${styles.valueDisplayTotal}`}>
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
            <h2 className={styles.sectionTitle}>Purchase Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Quantity</span>
                <span className={styles.summaryValue}>{form.totalQuantity}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ex-Tax Amount</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {form.totalAmountWithoutTax.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Tax</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {form.totalTaxAmount.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Delivery Charges</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {(parseFloat(form.deliveryCharges) || 0).toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Amount</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
                  <IndianRupee size={14} />
                  {form.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Amount Paid</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {(parseFloat(form.sendAmount) || 0).toFixed(2)}
                </span>
              </div>
              <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
                <span className={styles.summaryLabel}>Balance Amount</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
                  <IndianRupee size={14} />
                  {form.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default ConvertPurchase