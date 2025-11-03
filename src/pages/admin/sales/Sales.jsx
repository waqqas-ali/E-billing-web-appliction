"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/ScreenUI.module.css"
import { toast } from "react-toastify"
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react"

const SalesList = () => {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState(null)
  const [remainingBalance, setRemainingBalance] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const [paymentForm, setPaymentForm] = useState({
    receiptNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: "",
    paymentType: "CASH",
    referenceNumber: "",
    paymentDescription: "",
  })

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]

  const fetchSales = async () => {
    if (!token || !companyId) return
    setLoading(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setSales(res.data)
      console.log("Fetched sales:", res.data)
    } catch (err) {
      toast.error("Failed to load sales")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [token, companyId])

  const deleteSale = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return

    try {
      await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSales((prev) => prev.filter((s) => s.saleId !== saleId))
      toast.success("Sale deleted successfully")
      setSelectedSale(null)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale")
    }
  }

  const handleEdit = (saleId) => {
    navigate(`/createsale?edit=${saleId}`)
    setSelectedSale(null)
  }

  const openPaymentModal = (sale) => {
    setSelectedSaleId(sale.saleId)
    setRemainingBalance(Number.parseFloat(sale.balance) || 0)
    setPaymentForm({
      receiptNo: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amountPaid: "",
      paymentType: "CASH",
      referenceNumber: "",
      paymentDescription: "",
    })
    setShowPaymentModal(true)
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    if (!selectedSaleId) return

    const amount = Number.parseFloat(paymentForm.amountPaid)
    if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
      toast.error("Payment Date, Amount, and Type are required")
      return
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    if (amount > remainingBalance) {
      toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`)
      return
    }

    const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000)

    const payload = {
      paymentId,
      receiptNo: paymentForm.receiptNo || null,
      paymentDate: paymentForm.paymentDate,
      amountPaid: amount,
      paymentType: paymentForm.paymentType,
      referenceNumber: paymentForm.referenceNumber || null,
      paymentDescription: paymentForm.paymentDescription || null,
    }

    try {
      setLoading(true)
      await axios.post(`${config.BASE_URL}/sale/${selectedSaleId}/add-payment`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      toast.success("Payment added successfully!")
      setShowPaymentModal(false)
      fetchSales()
      setSelectedSale(null)
    } catch (err) {
      console.error("Add payment error:", err.response?.data)
      toast.error(err.response?.data?.message || "Failed to add payment")
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles["company-form-container"]}>
      {/* Header Section */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Sales Invoices</h1>
            <p className={styles["form-subtitle"]}>Manage all your invoices</p>
          </div>
        </div>
        <button onClick={() => navigate("/createsale")} className={styles["submit-button"]} disabled={loading}>
          <Plus size={18} />
          <span>Create Sale</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by invoice number or party name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading sales...</p>
        </div>
      )}

      {/* Sales Grid/Table */}
      {filteredSales.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Party Name</th>
                  <th>Total Amount</th>
                  <th>Received</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr key={s.saleId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{s.invoiceNumber}</span>
                    </td>
                    <td>{new Date(s.invoceDate).toLocaleDateString()}</td>
                    <td>{new Date(s.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{s.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
                    </td>
                    <td className={styles["received-cell"]}>₹{Number.parseFloat(s.receivedAmount).toFixed(2)}</td>
                    <td className={styles["balance-cell"]}>
                      <span className={s.balance > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
                        ₹{Number.parseFloat(s.balance).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={s.balance > 0 ? styles["status-pending"] : styles["status-paid"]}>
                        {s.balance > 0 ? "Pending" : "Paid"}
                      </span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedSale(s)}
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

          {/* Mobile Card View */}
          <div className={styles["mobile-cards-container"]}>
            {filteredSales.map((s) => (
              <div key={s.saleId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{s.invoiceNumber}</h3>
                    <span className={s.balance > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}>
                      {s.balance > 0 ? "Pending" : "Paid"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedSale(s)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{s.partyResponseDto?.name || "—"}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>{new Date(s.invoceDate).toLocaleDateString()}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Balance:</span>
                    <span className={s.balance > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
                      ₹{Number.parseFloat(s.balance).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedSale(s)} className={styles["card-view-button"]}>
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
          <p>No sales found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Sale" to add your first invoice.'}
          </p>
        </div>
      )}

      {/* VIEW MODAL WITH ACTIONS */}
      {selectedSale && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedSale(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Sale #{selectedSale.saleId}</h3>
                <div className={`${styles["balance-badge"]} ${selectedSale.balance <= 0 ? styles.paid : ""}`}>
                  {selectedSale.balance > 0 ? (
                    <>
                      <AlertCircle size={16} />
                      Balance: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Paid: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handleEdit(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit sale"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                {selectedSale.balance > 0 && (
                  <button
                    onClick={() => openPaymentModal(selectedSale)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Add Payment"
                  >
                    <DollarSign size={16} />
                    <span>Add Payment</span>
                  </button>
                )}

                <button
                  onClick={() => deleteSale(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete sale"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button className={styles["close-modal-btn"]} onClick={() => setSelectedSale(null)} title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Invoice Details */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Invoice Details</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice Number:</span>
                  <span className={styles["detail-value"]}>{selectedSale.invoiceNumber || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedSale.invoceDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Due Date:</span>
                  <span className={styles["detail-value"]}>{new Date(selectedSale.dueDate).toLocaleDateString()}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Sale Type:</span>
                  <span className={styles["detail-value"]}>{selectedSale.saleType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>{selectedSale.stateOfSupply?.replace(/_/g, " ")}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selectedSale.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Billing Address:</span>
                  <span className={styles["detail-value"]}>{selectedSale.billingAddress || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Shipping Address:</span>
                  <span className={styles["detail-value"]}>{selectedSale.shippingAddress || "—"}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total (ex-tax):</span>
                  <span>₹{selectedSale.totalAmountWithoutTax}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{selectedSale.totalTaxAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Delivery Charges:</span>
                  <span>₹{selectedSale.deliveryCharges}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Received:</span>
                  <span>₹{selectedSale.receivedAmount}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${
                    selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                  }`}
                >
                  <span>Balance:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Party */}
            {selectedSale.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Party ID:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.partyId}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Items</h4>
              {selectedSale.saleItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
                  <table className={styles["items-table"]}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>HSN</th>
                        <th>Desc</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Price/Unit</th>
                        <th>Tax Type</th>
                        <th>Tax Rate</th>
                        <th>Tax</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.saleItemResponses.map((it, i) => (
                        <tr key={i}>
                          <td>{it.itemName}</td>
                          <td>{it.itemHsnCode}</td>
                          <td>{it.itemDescription || "—"}</td>
                          <td>{it.quantity}</td>
                          <td>{it.unit}</td>
                          <td>₹{it.pricePerUnit}</td>
                          <td>{it.pricePerUnitTaxType}</td>
                          <td>{it.taxRate}</td>
                          <td>₹{it.taxAmount}</td>
                          <td>₹{it.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No items</p>
              )}
            </section>

            {/* Payments */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Payments</h4>
              {selectedSale.salePaymentResponses?.length > 0 ? (
                <ul className={styles["payment-list"]}>
                  {selectedSale.salePaymentResponses.map((p, i) => (
                    <li key={i} className={styles["payment-item"]}>
                      <div className={styles["payment-info"]}>
                        <span className={styles["payment-amount"]}>₹{p.amountPaid}</span>
                        <span className={styles["payment-date"]}>{new Date(p.paymentDate).toLocaleDateString()}</span>
                      </div>
                      <div className={styles["payment-type"]}>{p.paymentType}</div>
                      {p.referenceNumber && <div className={styles["payment-ref"]}>Ref: {p.referenceNumber}</div>}
                      {p.receiptNo && <div className={styles["payment-receipt"]}>Receipt: {p.receiptNo}</div>}
                      {p.paymentDescription && <div className={styles["payment-desc"]}>{p.paymentDescription}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No payments recorded</p>
              )}
            </section>
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className={styles["modal-overlay"]} onClick={() => setShowPaymentModal(false)}>
          <div className={styles["payment-modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>Add Payment for Sale #{selectedSaleId}</h3>
              <button className={styles["close-modal-btn"]} onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className={styles["payment-form"]}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Receipt No</label>
                  <input
                    type="text"
                    value={paymentForm.receiptNo}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        receiptNo: e.target.value,
                      })
                    }
                    className={styles["form-input"]}
                    placeholder="Optional"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    Payment Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentDate: e.target.value,
                      })
                    }
                    required
                    className={styles["form-input"]}
                  />
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    Amount Paid <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentForm.amountPaid}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        amountPaid: e.target.value,
                      })
                    }
                    required
                    className={styles["form-input"]}
                    placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
                  />
                  <small className={styles["balance-info"]}>💰 Remaining Balance: ₹{remainingBalance.toFixed(2)}</small>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    Payment Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentType: e.target.value,
                      })
                    }
                    required
                    className={styles["form-input"]}
                  >
                    {paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Reference Number</label>
                  <input
                    type="text"
                    value={paymentForm.referenceNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        referenceNumber: e.target.value,
                      })
                    }
                    className={styles["form-input"]}
                    placeholder="UPI ID, Cheque #, etc."
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>Description</label>
                  <textarea
                    value={paymentForm.paymentDescription}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentDescription: e.target.value,
                      })
                    }
                    className={`${styles["form-input"]} ${styles.textarea}`}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button type="submit" className={styles["submit-button"]} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader size={16} className={styles["button-spinner"]} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} />
                      Add Payment
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={styles["cancel-button"]}
                  onClick={() => setShowPaymentModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesList
