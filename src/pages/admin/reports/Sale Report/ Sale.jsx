// "use client"

// import React, { useState, useEffect, useCallback } from "react"
// import api from "../../../../utils/axiosInstance"
// import styles from "../../Styles/Report.module.css" // Reusing the same styles for consistency

// export default function Sale() {
//     // State management
//     const [userData, setUserData] = useState(null)
//     const [reportData, setReportData] = useState([])
//     const [parties, setParties] = useState([]) // For party dropdown
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)

//     // Filter states
//     const [filters, setFilters] = useState({
//         period: "Today",
//         partyId: "",
//         saleTxnType: "",
//         startDate: "",
//         endDate: "",
//     })

//     // Pagination and sorting
//     const [currentPage, setCurrentPage] = useState(1)
//     const [itemsPerPage] = useState(10)
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

//     // Load user data from localStorage
//     useEffect(() => {
//         try {
//             const storedData = localStorage.getItem("eBilling")
//             if (storedData) {
//                 const parsed = JSON.parse(storedData)
//                 setUserData(parsed)
//             } else {
//                 setError("User data not found. Please login again.")
//             }
//         } catch (err) {
//             console.error("Error parsing user data:", err)
//             setError("Failed to load user data. Please login again.")
//         }
//     }, [])

//     // Fetch parties for dropdown
//     const fetchParties = useCallback(async () => {
//         if (!userData?.accessToken || !userData?.selectedCompany?.id) return

//         try {
//             const response = await api.get(`/company/${userData.selectedCompany.id}/parties`, {
//                 headers: { Authorization: `Bearer ${userData.accessToken}` },
//             })
//             if (response.data && Array.isArray(response.data)) {
//                 setParties(response.data)
//             } else {
//                 setParties([])
//             }
//         } catch (err) {
//             console.error("Error fetching parties:", err)
//         }
//     }, [userData])

//     useEffect(() => {
//         if (userData?.accessToken && userData?.selectedCompany?.id) {
//             fetchParties()
//         }
//     }, [fetchParties])

//     // Fetch sale report data
//     const fetchReportData = useCallback(async () => {
//         if (!userData?.accessToken || !userData?.selectedCompany?.id) {
//             setError("Missing authentication or company information")
//             return
//         }

//         setLoading(true)
//         setError(null)

//         try {
//             const params = {
//                 period: filters.period,
//                 ...(filters.partyId && { partyId: filters.partyId }),
//                 ...(filters.saleTxnType && { saleTxnType: filters.saleTxnType }),
//                 ...(filters.startDate && { startDate: filters.startDate }),
//                 ...(filters.endDate && { endDate: filters.endDate }),
//             }

//             const response = await api.get(`/company/${userData.selectedCompany.id}/sale/report`, {
//                 params,
//                 headers: { Authorization: `Bearer ${userData.accessToken}` },
//             })

//             if (response.data && Array.isArray(response.data)) {
//                 setReportData(response.data)
//             } else {
//                 setReportData([])
//             }
//         } catch (err) {
//             console.error("Error fetching sale report:", err)
//             if (err.response) {
//                 setError(err.response.data?.message || `Error: ${err.response.status}`)
//             } else {
//                 setError("Network error. Please check your connection.")
//             }
//         } finally {
//             setLoading(false)
//         }
//     }, [userData, filters])

//     // Initial fetch and on filter change
//     useEffect(() => {
//         if (userData?.accessToken && userData?.selectedCompany?.id) {
//             fetchReportData()
//         }
//     }, [fetchReportData])

//     // Handle filter changes
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target
//         setFilters((prev) => ({ ...prev, [name]: value }))
//         setCurrentPage(1)
//     }

//     // Sorting
//     const handleSort = (key) => {
//         let direction = "asc"
//         if (sortConfig.key === key && sortConfig.direction === "asc") {
//             direction = "desc"
//         }
//         setSortConfig({ key, direction })
//     }

//     const sortedData = React.useMemo(() => {
//         if (!sortConfig.key) return reportData

//         return [...reportData].sort((a, b) => {
//             let aValue = a[sortConfig.key]
//             let bValue = b[sortConfig.key]

//             if (aValue === null || aValue === undefined) return 1
//             if (bValue === null || bValue === undefined) return -1

//             if (typeof aValue === "string") {
//                 return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
//             }
//             return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
//         })
//     }, [reportData, sortConfig])

//     // Pagination
//     const indexOfLastItem = currentPage * itemsPerPage
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage
//     const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
//     const totalPages = Math.ceil(sortedData.length / itemsPerPage)

//     // Totals
//     const totals = React.useMemo(() => {
//         return reportData.reduce(
//             (acc, item) => ({
//                 totalAmount: acc.totalAmount + (item.totalAmount || 0),
//                 receivedAmount: acc.receivedAmount + (item.receivedAmount || 0),
//                 balance: acc.balance + (item.balance || 0),
//             }),
//             { totalAmount: 0, receivedAmount: 0, balance: 0 }
//         )
//     }, [reportData])

//     // Formatters
//     const formatCurrency = (value) => {
//         if (value === null || value === undefined) return "₹0.00"
//         return new Intl.NumberFormat("en-IN", {
//             style: "currency",
//             currency: "INR",
//             minimumFractionDigits: 2,
//         }).format(value)
//     }

//     const formatDate = (dateString) => {
//         if (!dateString) return "-"
//         return new Date(dateString).toLocaleDateString("en-IN", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         })
//     }

//     return (
//         <div className={styles.reportContainer}>
//             {/* Header */}
//             <div className={styles.reportHeader}>
//                 <h1 className={styles.reportTitle}>Sale Report</h1>
//                 <p className={styles.reportSubtitle}>{userData?.selectedCompany?.name || "Company Report"}</p>
//             </div>

//             {/* Filters */}
//             <div className={styles.filtersSection}>
//                 <div className={styles.filtersGrid}>
//                     <div className={styles.filterGroup}>
//                         <label htmlFor="period" className={styles.filterLabel}>Period</label>
//                         <select
//                             id="period"
//                             name="period"
//                             value={filters.period}
//                             onChange={handleFilterChange}
//                             className={styles.filterSelect}
//                             disabled={loading}
//                         >
//                             <option value="Today">Today</option>
//                             <option value="Week">Week</option>
//                             <option value="Month">Month</option>
//                             <option value="Quarter">Quarter</option>
//                             <option value="Year">Year</option>
//                             <option value="CUSTOM">Custom</option>
//                         </select>
//                     </div>

//                     {filters.period === "CUSTOM" && (
//                         <>
//                             <div className={styles.filterGroup}>
//                                 <label htmlFor="startDate" className={styles.filterLabel}>Start Date</label>
//                                 <input
//                                     type="date"
//                                     id="startDate"
//                                     name="startDate"
//                                     value={filters.startDate}
//                                     onChange={handleFilterChange}
//                                     className={styles.filterInput}
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className={styles.filterGroup}>
//                                 <label htmlFor="endDate" className={styles.filterLabel}>End Date</label>
//                                 <input
//                                     type="date"
//                                     id="endDate"
//                                     name="endDate"
//                                     value={filters.endDate}
//                                     onChange={handleFilterChange}
//                                     className={styles.filterInput}
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </>
//                     )}

//                     <div className={styles.filterGroup}>
//                         <label htmlFor="partyId" className={styles.filterLabel}>Party (Optional)</label>
//                         <select
//                             id="partyId"
//                             name="partyId"
//                             value={filters.partyId}
//                             onChange={handleFilterChange}
//                             className={styles.filterSelect}
//                             disabled={loading}
//                         >
//                             <option value="">All Parties</option>
//                             {parties.map((party) => (
//                                 <option key={party.partyId} value={party.partyId}>
//                                     {party.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className={styles.filterGroup}>
//                         <label htmlFor="saleTxnType" className={styles.filterLabel}>Transaction Type (Optional)</label>
//                         <select
//                             id="saleTxnType"
//                             name="saleTxnType"
//                             value={filters.saleTxnType}
//                             onChange={handleFilterChange}
//                             className={styles.filterSelect}
//                             disabled={loading}
//                         >
//                             <option value="">All Types</option>
//                             <option value="SALE">Sale</option>
//                             <option value="CREDIT_NOTE">Credit Note</option>
//                         </select>
//                     </div>
//                 </div>

//                 <button onClick={fetchReportData} className={styles.refreshButton} disabled={loading}>
//                     {loading ? "Loading..." : "Refresh Report"}
//                 </button>
//             </div>

//             {/* Summary Cards */}
//             {!error && reportData.length > 0 && (
//                 <div className={styles.summaryCards}>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Sale Amount</div>
//                         <div className={styles.summaryValue}>{formatCurrency(totals.totalAmount)}</div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Received</div>
//                         <div className={styles.summaryValue}>{formatCurrency(totals.receivedAmount)}</div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Balance (Receivable)</div>
//                         <div className={styles.summaryValue}>{formatCurrency(totals.balance)}</div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Records</div>
//                         <div className={styles.summaryValue}>{reportData.length}</div>
//                     </div>
//                 </div>
//             )}

//             {/* Error */}
//             {error && (
//                 <div className={styles.errorMessage}>
//                     <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <span>{error}</span>
//                 </div>
//             )}

//             {/* Loading */}
//             {loading && (
//                 <div className={styles.loadingContainer}>
//                     <div className={styles.spinner}></div>
//                     <p className={styles.loadingText}>Loading report data...</p>
//                 </div>
//             )}

//             {/* Table */}
//             {!loading && !error && reportData.length > 0 && (
//                 <>
//                     <div className={styles.tableContainer}>
//                         <table className={styles.reportTable}>
//                             <thead className={styles.tableHeader}>
//                                 <tr>
//                                     <th onClick={() => handleSort("invoceDate")} className={styles.sortableHeader}>
//                                         Invoice Date
//                                         {sortConfig.key === "invoceDate" && <span className={styles.sortIcon}>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
//                                     </th>
//                                     <th onClick={() => handleSort("invoiceNumber")} className={styles.sortableHeader}>
//                                         Invoice Number
//                                     </th>
//                                     <th onClick={() => handleSort("name")} className={styles.sortableHeader}>
//                                         Party Name
//                                     </th>
//                                     <th onClick={() => handleSort("saleTransactionType")} className={styles.sortableHeader}>
//                                         Type
//                                     </th>
//                                     <th onClick={() => handleSort("paymentType")} className={styles.sortableHeader}>
//                                         Payment Type
//                                     </th>
//                                     <th onClick={() => handleSort("totalAmount")} className={styles.sortableHeader}>
//                                         Total Amount
//                                     </th>
//                                     <th onClick={() => handleSort("receivedAmount")} className={styles.sortableHeader}>
//                                         Received Amount
//                                     </th>
//                                     <th onClick={() => handleSort("balance")} className={styles.sortableHeader}>
//                                         Balance
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className={styles.tableBody}>
//                                 {currentItems.map((item, index) => (
//                                     <tr key={item.saleId || index} className={styles.tableRow}>
//                                         <td className={styles.tableCell}>{formatDate(item.invoceDate)}</td>
//                                         <td className={styles.tableCell}>{item.invoiceNumber || "-"}</td>
//                                         <td className={styles.tableCell}>{item.name || "-"}</td>
//                                         <td className={styles.tableCell}>{item.saleTransactionType || "-"}</td>
//                                         <td className={styles.tableCell}>{item.paymentType || "-"}</td>
//                                         <td className={styles.tableCell}>{formatCurrency(item.totalAmount)}</td>
//                                         <td className={styles.tableCell}>{formatCurrency(item.receivedAmount)}</td>
//                                         <td className={styles.tableCell}>{formatCurrency(item.balance)}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {totalPages > 1 && (
//                         <div className={styles.pagination}>
//                             <button
//                                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                                 disabled={currentPage === 1}
//                                 className={styles.paginationButton}
//                             >
//                                 Previous
//                             </button>
//                             <div className={styles.paginationInfo}>
//                                 Page {currentPage} of {totalPages}
//                             </div>
//                             <button
//                                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                                 disabled={currentPage === totalPages}
//                                 className={styles.paginationButton}
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}

//             {/* Empty State */}
//             {!loading && !error && reportData.length === 0 && (
//                 <div className={styles.emptyState}>
//                     <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
//                     </svg>
//                     <h3 className={styles.emptyTitle}>No Data Available</h3>
//                     <p className={styles.emptyDescription}>No sale records found for the selected filters.</p>
//                 </div>
//             )}
//         </div>
//     )
// }













"use client"

import React, { useState, useEffect, useCallback } from "react"
import api from "../../../../utils/axiosInstance"
import styles from "../../Styles/Report.module.css"

export default function Sale() {
    // State management
    const [userData, setUserData] = useState(null)
    const [reportData, setReportData] = useState([])
    const [parties, setParties] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Filter states
    const [filters, setFilters] = useState({
        period: "Today",
        partyId: "",
        saleTxnType: "",
        startDate: "",
        endDate: "",
    })

    // Pagination and sorting
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

    // Profit/Loss popup states
    const [selectedSale, setSelectedSale] = useState(null)
    const [profitLossData, setProfitLossData] = useState(null)
    const [profitLossLoading, setProfitLossLoading] = useState(false)
    const [profitLossError, setProfitLossError] = useState(null)
    const [isProfitLossPopupOpen, setIsProfitLossPopupOpen] = useState(false)

    // Load user data from localStorage
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
            console.error("Error parsing user data:", err)
            setError("Failed to load user data. Please login again.")
        }
    }, [])

    // Fetch parties for dropdown
    const fetchParties = useCallback(async () => {
        if (!userData?.accessToken || !userData?.selectedCompany?.id) return

        try {
            const response = await api.get(`/company/${userData.selectedCompany.id}/parties`, {
                headers: { Authorization: `Bearer ${userData.accessToken}` },
            })
            if (response.data && Array.isArray(response.data)) {
                setParties(response.data)
            } else {
                setParties([])
            }
        } catch (err) {
            console.error("Error fetching parties:", err)
        }
    }, [userData])

    useEffect(() => {
        if (userData?.accessToken && userData?.selectedCompany?.id) {
            fetchParties()
        }
    }, [fetchParties])

    // Fetch sale report data
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
                ...(filters.partyId && { partyId: filters.partyId }),
                ...(filters.saleTxnType && { saleTxnType: filters.saleTxnType }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            }

            const response = await api.get(`/company/${userData.selectedCompany.id}/sale/report`, {
                params,
                headers: { Authorization: `Bearer ${userData.accessToken}` },
            })

            if (response.data && Array.isArray(response.data)) {
                setReportData(response.data)
            } else {
                setReportData([])
            }
        } catch (err) {
            console.error("Error fetching sale report:", err)
            if (err.response) {
                setError(err.response.data?.message || `Error: ${err.response.status}`)
            } else {
                setError("Network error. Please check your connection.")
            }
        } finally {
            setLoading(false)
        }
    }, [userData, filters])

    useEffect(() => {
        if (userData?.accessToken && userData?.selectedCompany?.id) {
            fetchReportData()
        }
    }, [fetchReportData])

    // Fetch profit/loss details
    const fetchProfitLossDetails = async (saleId) => {
        if (!userData?.accessToken) return

        setProfitLossLoading(true)
        setProfitLossError(null)
        setProfitLossData(null)

        try {
            const response = await api.get(`/sale/${saleId}/bill-wise/profit-loss/details`, {
                headers: { Authorization: `Bearer ${userData.accessToken}` },
            })

            setProfitLossData(response.data)
        } catch (err) {
            console.error("Error fetching profit/loss details:", err)
            setProfitLossError(err.response?.data?.message || "Failed to load profit/loss details")
        } finally {
            setProfitLossLoading(false)
        }
    }

    // Open profit/loss popup
    const openProfitLossPopup = (sale) => {
        setSelectedSale(sale)
        setIsProfitLossPopupOpen(true)
        fetchProfitLossDetails(sale.saleId)
    }

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({ ...prev, [name]: value }))
        setCurrentPage(1)
    }

    // Sorting
    const handleSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return reportData

        return [...reportData].sort((a, b) => {
            let aValue = a[sortConfig.key]
            let bValue = b[sortConfig.key]

            if (aValue === null || aValue === undefined) return 1
            if (bValue === null || bValue === undefined) return -1

            if (typeof aValue === "string") {
                return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        })
    }, [reportData, sortConfig])

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage)

    // Totals
    const totals = React.useMemo(() => {
        return reportData.reduce(
            (acc, item) => ({
                totalAmount: acc.totalAmount + (item.totalAmount || 0),
                receivedAmount: acc.receivedAmount + (item.receivedAmount || 0),
                balance: acc.balance + (item.balance || 0),
            }),
            { totalAmount: 0, receivedAmount: 0, balance: 0 }
        )
    }, [reportData])

    // Formatters
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "₹0.00"
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(value)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className={styles.reportContainer}>
            {/* Header */}
            <div className={styles.reportHeader}>
                <h1 className={styles.reportTitle}>Sale Report</h1>
                <p className={styles.reportSubtitle}>{userData?.selectedCompany?.name || "Company Report"}</p>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className={styles.filtersGrid}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="period" className={styles.filterLabel}>Period</label>
                        <select
                            id="period"
                            name="period"
                            value={filters.period}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                            disabled={loading}
                        >
                            <option value="Today">Today</option>
                            <option value="Week">Week</option>
                            <option value="Month">Month</option>
                            <option value="Quarter">Quarter</option>
                            <option value="Year">Year</option>
                            <option value="CUSTOM">Custom</option>
                        </select>
                    </div>

                    {filters.period === "CUSTOM" && (
                        <>
                            <div className={styles.filterGroup}>
                                <label htmlFor="startDate" className={styles.filterLabel}>Start Date</label>
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
                                <label htmlFor="endDate" className={styles.filterLabel}>End Date</label>
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

                    <div className={styles.filterGroup}>
                        <label htmlFor="partyId" className={styles.filterLabel}>Party (Optional)</label>
                        <select
                            id="partyId"
                            name="partyId"
                            value={filters.partyId}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                            disabled={loading}
                        >
                            <option value="">All Parties</option>
                            {parties.map((party) => (
                                <option key={party.partyId} value={party.partyId}>
                                    {party.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="saleTxnType" className={styles.filterLabel}>Transaction Type (Optional)</label>
                        <select
                            id="saleTxnType"
                            name="saleTxnType"
                            value={filters.saleTxnType}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                            disabled={loading}
                        >
                            <option value="">All Types</option>
                            <option value="SALE">Sale</option>
                            <option value="CREDIT_NOTE">Credit Note</option>
                        </select>
                    </div>
                </div>

                {/* <button onClick={fetchReportData} className={styles.refreshButton} disabled={loading}>
                    {loading ? "Loading..." : "Refresh Report"}
                </button> */}
            </div>

            {/* Summary Cards */}
            {!error && reportData.length > 0 && (
                <div className={styles.summaryCards}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Sale Amount</div>
                        <div className={styles.summaryValue}>{formatCurrency(totals.totalAmount)}</div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Received</div>
                        <div className={styles.summaryValue}>{formatCurrency(totals.receivedAmount)}</div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Balance (Receivable)</div>
                        <div className={styles.summaryValue}>{formatCurrency(totals.balance)}</div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Records</div>
                        <div className={styles.summaryValue}>{reportData.length}</div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className={styles.errorMessage}>
                    <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading report data...</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && reportData.length > 0 && (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.reportTable}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th onClick={() => handleSort("invoceDate")} className={styles.sortableHeader}>
                                        Invoice Date
                                        {sortConfig.key === "invoceDate" && <span className={styles.sortIcon}>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th onClick={() => handleSort("invoiceNumber")} className={styles.sortableHeader}>
                                        Invoice Number
                                    </th>
                                    <th onClick={() => handleSort("name")} className={styles.sortableHeader}>
                                        Party Name
                                    </th>
                                    <th onClick={() => handleSort("saleTransactionType")} className={styles.sortableHeader}>
                                        Type
                                    </th>
                                    <th onClick={() => handleSort("paymentType")} className={styles.sortableHeader}>
                                        Payment Type
                                    </th>
                                    <th onClick={() => handleSort("totalAmount")} className={styles.sortableHeader}>
                                        Total Amount
                                    </th>
                                    <th onClick={() => handleSort("receivedAmount")} className={styles.sortableHeader}>
                                        Received Amount
                                    </th>
                                    <th onClick={() => handleSort("balance")} className={styles.sortableHeader}>
                                        Balance
                                    </th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {currentItems.map((item, index) => (
                                    <tr key={item.saleId || index} className={styles.tableRow}>
                                        <td className={styles.tableCell}>{formatDate(item.invoceDate)}</td>
                                        <td className={styles.tableCell}>{item.invoiceNumber || "-"}</td>
                                        <td className={styles.tableCell}>{item.name || "-"}</td>
                                        <td className={styles.tableCell}>{item.saleTransactionType || "-"}</td>
                                        <td className={styles.tableCell}>{item.paymentType || "-"}</td>
                                        <td className={styles.tableCell}>{formatCurrency(item.totalAmount)}</td>
                                        <td className={styles.tableCell}>{formatCurrency(item.receivedAmount)}</td>
                                        <td className={styles.tableCell}>{formatCurrency(item.balance)}</td>
                                        <td className={styles.tableCell}>
                                            <button
                                                onClick={() => openProfitLossPopup(item)}
                                                className={styles.refreshButton}
                                                style={{ padding: "6px 12px", fontSize: "0.875rem" }}
                                                disabled={profitLossLoading}
                                            >
                                                View Profit/Loss
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                Previous
                            </button>
                            <div className={styles.paginationInfo}>
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && !error && reportData.length === 0 && (
                <div className={styles.emptyState}>
                    <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className={styles.emptyTitle}>No Data Available</h3>
                    <p className={styles.emptyDescription}>No sale records found for the selected filters.</p>
                </div>
            )}

            {/* Profit/Loss Popup */}
            {isProfitLossPopupOpen && selectedSale && (
                <div className={styles.modalOverlay} onClick={() => setIsProfitLossPopupOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "900px" }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                Profit/Loss Details - {selectedSale.invoiceNumber || "Sale"}
                            </h2>
                            <button onClick={() => setIsProfitLossPopupOpen(false)} className={styles.modalClose}>×</button>
                        </div>

                        {profitLossLoading && (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner}></div>
                                <p>Loading profit/loss details...</p>
                            </div>
                        )}

                        {profitLossError && (
                            <div className={styles.errorMessage}>
                                <span>{profitLossError}</span>
                            </div>
                        )}

                        {!profitLossLoading && !profitLossError && profitLossData && (
                            <div style={{ padding: "16px" }}>
                                {/* Summary */}
                                <div className={styles.summaryCards} style={{ marginBottom: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryLabel}>Sale Amount</div>
                                        <div className={styles.summaryValue}>{formatCurrency(profitLossData.saleAmount)}</div>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryLabel}>Total Cost</div>
                                        <div className={styles.summaryValue}>{formatCurrency(profitLossData.totalCost)}</div>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryLabel}>Tax Payable</div>
                                        <div className={styles.summaryValue}>{formatCurrency(profitLossData.taxPayable)}</div>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryLabel}>TDS Payable</div>
                                        <div className={styles.summaryValue}>{formatCurrency(profitLossData.tdsPayable)}</div>
                                    </div>
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryLabel}>Net Profit/Loss</div>
                                        <div className={`${styles.summaryValue} ${profitLossData.total >= 0 ? styles.profit : styles.loss}`}>
                                            {formatCurrency(profitLossData.total)}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                {profitLossData.items?.length > 0 ? (
                                    <table className={styles.reportTable}>
                                        <thead className={styles.tableHeader}>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Quantity</th>
                                                <th>Purchase Price</th>
                                                <th>Total Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tableBody}>
                                            {profitLossData.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className={styles.tableCell}>{item.itemName || "-"}</td>
                                                    <td className={styles.tableCell}>{item.quantity?.toFixed(2) || "-"}</td>
                                                    <td className={styles.tableCell}>{formatCurrency(item.purchasePrice)}</td>
                                                    <td className={styles.tableCell}>{formatCurrency(item.totalCost)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ textAlign: "center", padding: "20px" }}>No item details available</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}