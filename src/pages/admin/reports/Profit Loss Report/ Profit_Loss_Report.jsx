"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../../../../utils/axiosInstance"
import styles from "../../Styles/Report.module.css"

export default function ProfitLossReport() {
  // State management
  const [userData, setUserData] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    period: "Month",
    startDate: "",
    endDate: "",
  })

  // Initialize user data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("eBilling")
      if (storedData) {
        const parsed = JSON.parse(storedData)
        setUserData(parsed)
      } else {
        setError("User data not found. Please login again.")
      }
    } catch (err) {
      console.error("[v0] Error parsing user data:", err)
      setError("Failed to load user data. Please login again.")
    }
  }, [])

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    if (!userData?.accessToken || !userData?.selectedCompany?.id) {
      setError("Missing authentication or company information")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = {
        period: filters.period,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      }

      const response = await api.get(`/company/${userData.selectedCompany.id}/profit-loss/report`, {
        params,
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      })

      if (response.data) {
        setReportData(response.data)
      } else {
        setReportData(null)
        setError("Invalid data format received from server")
      }
    } catch (err) {
      console.error("[v0] Error fetching report:", err)

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Session expired. Please login again.")
            break
          case 403:
            setError("You don't have permission to access this report.")
            break
          case 404:
            setError("Report not found.")
            break
          case 500:
            setError("Server error. Please try again later.")
            break
          default:
            setError(err.response.data?.message || "Failed to fetch report data")
        }
      } else if (err.request) {
        setError("Network error. Please check your internet connection.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }, [userData, filters])

  // Fetch data on mount and filter change
  useEffect(() => {
    if (userData?.accessToken && userData?.selectedCompany?.id) {
      fetchReportData()
    }
  }, [fetchReportData, userData])

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "₹0.00"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Calculate gross profit
  const calculateGrossProfit = () => {
    if (!reportData) return 0
    return (
      (reportData.sale || 0) -
      (reportData.creditNote || 0) +
      (reportData.saleFA || 0) +
      (reportData.closingStock || 0) +
      (reportData.closingStockFA || 0) -
      (reportData.openingStock || 0) -
      (reportData.openingStockFA || 0) -
      (reportData.purchase || 0) +
      (reportData.debitNote || 0) -
      (reportData.purchaseFA || 0) -
      (reportData.otherDirectExpenses || 0)
    )
  }

  // Calculate net profit
  const calculateNetProfit = () => {
    if (!reportData) return 0
    const grossProfit = calculateGrossProfit()
    return (
      grossProfit +
      (reportData.otherIncome || 0) +
      (reportData.paymentInDiscount || 0) -
      (reportData.otherExpense || 0) -
      (reportData.paymentOutDiscount || 0) -
      (reportData.loanInterestExpense || 0) -
      (reportData.loanProcessingFeeExpense || 0) -
      (reportData.loanChargeExpense || 0)
    )
  }

  return (
    <div className={styles.reportContainer}>
      {/* Header */}
      <div className={styles.reportHeader}>
        <h1 className={styles.reportTitle}>Profit & Loss Report</h1>
        <p className={styles.reportSubtitle}>{userData?.selectedCompany?.name || "Company Report"}</p>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="period" className={styles.filterLabel}>
              Period
            </label>
            <select
              id="period"
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              disabled={loading}
            >
              <option value="Month">This Month</option>
              <option value="Week">Last Week</option>
              <option value="Quarter">This Quarter</option>
              <option value="Year">This Year</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
          </div>

          {filters.period === "CUSTOM" && (
            <>
              <div className={styles.filterGroup}>
                <label htmlFor="startDate" className={styles.filterLabel}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                  disabled={loading}
                />
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="endDate" className={styles.filterLabel}>
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>

        {/* <button onClick={fetchReportData} className={styles.refreshButton} disabled={loading}>
          {loading ? "Loading..." : "Refresh Report"}
        </button> */}
      </div>

      {/* Summary Cards */}
      {!error && reportData && (
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Gross Profit/Loss</div>
            <div className={`${styles.summaryValue} ${calculateGrossProfit() >= 0 ? styles.profit : styles.loss}`}>
              {formatCurrency(calculateGrossProfit())}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Net Profit/Loss</div>
            <div className={`${styles.summaryValue} ${calculateNetProfit() >= 0 ? styles.profit : styles.loss}`}>
              {formatCurrency(calculateNetProfit())}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Sales</div>
            <div className={styles.summaryValue}>{formatCurrency(reportData.sale || 0)}</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading report data...</p>
        </div>
      )}

      {/* Report Details */}
      {!loading && !error && reportData && (
        <div className={styles.detailsContainer}>
          {/* Revenue Section */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Revenue</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Sales</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.sale || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Less: Credit Note</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.creditNote || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Sale (Fixed Assets)</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.saleFA || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment In Discount</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.paymentInDiscount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Cost of Goods Sold */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Cost of Goods Sold</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Opening Stock</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.openingStock || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Opening Stock (Fixed Assets)</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.openingStockFA || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Purchases</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.purchase || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Less: Debit Note</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.debitNote || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Purchase (Fixed Assets)</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.purchaseFA || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Less: Closing Stock</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.closingStock || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Less: Closing Stock (Fixed Assets)</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.closingStockFA || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Other Direct Expenses</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.otherDirectExpenses || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Out Discount</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.paymentOutDiscount || 0)}</span>
              </div>
            </div>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Gross Profit/Loss</span>
              <span className={`${styles.subtotalValue} ${calculateGrossProfit() >= 0 ? styles.profit : styles.loss}`}>
                {formatCurrency(calculateGrossProfit())}
              </span>
            </div>
          </div>

          {/* Other Income & Expenses */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Other Income & Expenses</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Other Income</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.otherIncome || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Other Expenses</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.otherExpense || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Loan Interest Expense</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.loanInterestExpense || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Loan Processing Fee</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.loanProcessingFeeExpense || 0)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Loan Charges</span>
                <span className={`${styles.detailValue} ${styles.negative}`}>
                  ({formatCurrency(reportData.loanChargeExpense || 0)})
                </span>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Tax Information</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>GST Payable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.gstPayable || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>GST Receivable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.gstReceivable || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>TCS Payable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.tcsPayable || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>TCS Receivable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.tcsReceivable || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>TDS Payable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.tdsPayable || 0)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>TDS Receivable</span>
                <span className={styles.detailValue}>{formatCurrency(reportData.tdsReceivable || 0)}</span>
              </div>
            </div>
          </div>

          {/* Final Net Profit/Loss */}
          <div className={styles.finalCard}>
            <div className={styles.finalRow}>
              <span className={styles.finalLabel}>Net Profit/Loss</span>
              <span className={`${styles.finalValue} ${calculateNetProfit() >= 0 ? styles.profit : styles.loss}`}>
                {formatCurrency(calculateNetProfit())}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !reportData && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className={styles.emptyTitle}>No Data Available</h3>
          <p className={styles.emptyDescription}>No profit and loss data found for the selected period.</p>
        </div>
      )}
    </div>
  )
}
