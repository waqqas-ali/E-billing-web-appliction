// "use client"

// import React, { useState, useEffect, useCallback } from "react"
// import api from "../../../../utils/axiosInstance"
// import styles from "../../Styles/Report.module.css" // Reusing the same styles for consistency

// export default function Parties_Report() {
//     // State management
//     const [userData, setUserData] = useState(null)
//     const [reportData, setReportData] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)

//     // Pagination and sorting
//     const [currentPage, setCurrentPage] = useState(1)
//     const [itemsPerPage] = useState(15) // Slightly more items per page since no date filters
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

//     // Fetch parties report data
//     const fetchReportData = useCallback(async () => {
//         if (!userData?.accessToken || !userData?.selectedCompany?.id) {
//             setError("Missing authentication or company information")
//             return
//         }

//         setLoading(true)
//         setError(null)

//         try {
//             const response = await api.get(`/company/${userData.selectedCompany.id}/parties/report`, {
//                 headers: { Authorization: `Bearer ${userData.accessToken}` },
//             })

//             if (response.data && Array.isArray(response.data)) {
//                 setReportData(response.data)
//             } else {
//                 setReportData([])
//             }
//         } catch (err) {
//             console.error("Error fetching parties report:", err)
//             if (err.response) {
//                 setError(err.response.data?.message || `Error: ${err.response.status}`)
//             } else {
//                 setError("Network error. Please check your connection.")
//             }
//         } finally {
//             setLoading(false)
//         }
//     }, [userData])

//     // Initial fetch
//     useEffect(() => {
//         if (userData?.accessToken && userData?.selectedCompany?.id) {
//             fetchReportData()
//         }
//     }, [fetchReportData])

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
//                 totalReceivable: acc.totalReceivable + (item.receivableBalance || 0),
//                 totalPayable: acc.totalPayable + (item.payableBalance || 0),
//             }),
//             { totalReceivable: 0, totalPayable: 0 }
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

//     const formatBalance = (value) => {
//         if (value === null || value === undefined || value === 0) return "₹0.00"
//         const formatted = formatCurrency(Math.abs(value))
//         return value > 0 ? formatted : `(${formatted})`
//     }

//     return (
//         <div className={styles.reportContainer}>
//             {/* Header */}
//             <div className={styles.reportHeader}>
//                 <h1 className={styles.reportTitle}>Parties Report</h1>
//                 <p className={styles.reportSubtitle}>{userData?.selectedCompany?.name || "Company Report"}</p>
//             </div>

//             {/* Refresh Button (since no filters) */}
//             {/* <div className={styles.filtersSection}>
//                 <div className={styles.filtersGrid}></div>
//                 <button onClick={fetchReportData} className={styles.refreshButton} disabled={loading}>
//                     {loading ? "Loading..." : "Refresh Report"}
//                 </button>
//             </div> */}

//             {/* Summary Cards */}
//             {!error && reportData.length > 0 && (
//                 <div className={styles.summaryCards}>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Receivable</div>
//                         <div className={styles.summaryValue}>{formatCurrency(totals.totalReceivable)}</div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Payable</div>
//                         <div className={styles.summaryValue}>{formatCurrency(totals.totalPayable)}</div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Net Balance</div>
//                         <div className={`${styles.summaryValue} ${totals.totalReceivable - totals.totalPayable >= 0 ? styles.profit : styles.loss}`}>
//                             {formatCurrency(totals.totalReceivable - totals.totalPayable)}
//                         </div>
//                     </div>
//                     <div className={styles.summaryCard}>
//                         <div className={styles.summaryLabel}>Total Parties</div>
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
//                     <p className={styles.loadingText}>Loading parties data...</p>
//                 </div>
//             )}

//             {/* Table */}
//             {!loading && !error && reportData.length > 0 && (
//                 <>
//                     <div className={styles.tableContainer}>
//                         <table className={styles.reportTable}>
//                             <thead className={styles.tableHeader}>
//                                 <tr>
//                                     <th onClick={() => handleSort("name")} className={styles.sortableHeader}>
//                                         Party Name
//                                         {sortConfig.key === "name" && <span className={styles.sortIcon}>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
//                                     </th>
//                                     <th onClick={() => handleSort("phoneNo")} className={styles.sortableHeader}>
//                                         Phone
//                                     </th>
//                                     <th onClick={() => handleSort("gstin")} className={styles.sortableHeader}>
//                                         GSTIN
//                                     </th>
//                                     <th onClick={() => handleSort("gstType")} className={styles.sortableHeader}>
//                                         GST Type
//                                     </th>
//                                     <th onClick={() => handleSort("state")} className={styles.sortableHeader}>
//                                         State
//                                     </th>
//                                     <th onClick={() => handleSort("receivableBalance")} className={styles.sortableHeader}>
//                                         Receivable (To Receive)
//                                     </th>
//                                     <th onClick={() => handleSort("payableBalance")} className={styles.sortableHeader}>
//                                         Payable (To Pay)
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className={styles.tableBody}>
//                                 {currentItems.map((item, index) => (
//                                     <tr key={item.partyId || index} className={styles.tableRow}>
//                                         <td className={styles.tableCell}>{item.name || "-"}</td>
//                                         <td className={styles.tableCell}>{item.phoneNo || "-"}</td>
//                                         <td className={styles.tableCell}>{item.gstin || "-"}</td>
//                                         <td className={styles.tableCell}>{item.gstType?.replace(/_/g, " ") || "-"}</td>
//                                         <td className={styles.tableCell}>{item.state?.replace(/_/g, " ") || "-"}</td>
//                                         <td className={`${styles.tableCell} ${item.receivableBalance > 0 ? styles.profitCell : ""}`}>
//                                             {formatBalance(item.receivableBalance)}
//                                         </td>
//                                         <td className={`${styles.tableCell} ${item.payableBalance > 0 ? styles.lossCell : ""}`}>
//                                             {formatBalance(item.payableBalance)}
//                                         </td>
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
//                     <h3 className={styles.emptyTitle}>No Parties Found</h3>
//                     <p className={styles.emptyDescription}>No party records available for this company.</p>
//                 </div>
//             )}
//         </div>
//     )
// }













"use client"

import React, { useState, useEffect, useCallback } from "react"
import api from "../../../../utils/axiosInstance"
import styles from "../../Styles/Report.module.css"

export default function Parties_Report() {
    // Main report states
    const [userData, setUserData] = useState(null)
    const [reportData, setReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Popup states
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [selectedParty, setSelectedParty] = useState(null)
    const [statementData, setStatementData] = useState([])
    const [statementLoading, setStatementLoading] = useState(false)
    const [statementError, setStatementError] = useState(null)

    // Statement filters
    const [statementFilters, setStatementFilters] = useState({
        period: "Today", // Custom option for full history
        startDate: "",
        endDate: "",
    })

    // Pagination and sorting for main report
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

    // Load user data
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

    // Fetch parties report
    const fetchReportData = useCallback(async () => {
        if (!userData?.accessToken || !userData?.selectedCompany?.id) return

        setLoading(true)
        setError(null)

        try {
            const response = await api.get(`/company/${userData.selectedCompany.id}/parties/report`, {
                headers: { Authorization: `Bearer ${userData.accessToken}` },
            })

            if (response.data && Array.isArray(response.data)) {
                setReportData(response.data)
            } else {
                setReportData([])
            }
        } catch (err) {
            console.error("Error fetching parties report:", err)
            setError(err.response?.data?.message || "Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [userData])

    useEffect(() => {
        if (userData?.accessToken && userData?.selectedCompany?.id) {
            fetchReportData()
        }
    }, [fetchReportData])

    // Open popup and fetch statement
    const openStatement = async (party) => {
        setSelectedParty(party)
        setIsPopupOpen(true)
        setStatementData([])
        setStatementError(null)
        setStatementFilters({ period: "Today", startDate: "", endDate: "" })

        await fetchStatement(party.partyId, { period: "Today" })
    }

    // Fetch party statement
    const fetchStatement = async (partyId, filters) => {
        if (!userData?.accessToken) return

        setStatementLoading(true)
        setStatementError(null)

        try {
            const params = {
                period: filters.period,
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            }

            const response = await api.get(`/party/${partyId}/statement/list`, {
                params,
                headers: { Authorization: `Bearer ${userData.accessToken}` },
            })

            if (response.data && Array.isArray(response.data)) {
                setStatementData(response.data)
            } else {
                setStatementData([])
            }
        } catch (err) {
            console.error("Error fetching statement:", err)
            setStatementError(err.response?.data?.message || "Failed to load statement")
        } finally {
            setStatementLoading(false)
        }
    }

    // Handle statement filter change
    const handleStatementFilterChange = (e) => {
        const { name, value } = e.target
        setStatementFilters((prev) => ({ ...prev, [name]: value }))
    }

    // Apply statement filters
    const applyStatementFilters = () => {
        if (selectedParty) {
            fetchStatement(selectedParty.partyId, statementFilters)
        }
    }

    // Sorting for main report
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
            let aValue = a[sortConfig.key] ?? ""
            let bValue = b[sortConfig.key] ?? ""
            if (typeof aValue === "string") {
                return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        })
    }, [reportData, sortConfig])

    // Pagination for main report
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage)

    // Totals
    const totals = React.useMemo(() => {
        return reportData.reduce(
            (acc, item) => ({
                totalReceivable: acc.totalReceivable + (item.receivableBalance || 0),
                totalPayable: acc.totalPayable + (item.payableBalance || 0),
            }),
            { totalReceivable: 0, totalPayable: 0 }
        )
    }, [reportData])

    // Formatters
    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === 0) return "₹0.00"
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(Math.abs(value))
    }

    const formatBalance = (value) => {
        if (value === 0) return "₹0.00"
        const formatted = formatCurrency(value)
        return value > 0 ? formatted : `(${formatted})`
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    }

    return (
        <div className={styles.reportContainer}>
            {/* Header */}
            <div className={styles.reportHeader}>
                <h1 className={styles.reportTitle}>Parties Report</h1>
                <p className={styles.reportSubtitle}>{userData?.selectedCompany?.name || "Company Report"}</p>
            </div>

            {/* Summary Cards */}
            {!error && reportData.length > 0 && (
                <div className={styles.summaryCards}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Receivable</div>
                        <div className={styles.summaryValue}>{formatCurrency(totals.totalReceivable)}</div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Payable</div>
                        <div className={styles.summaryValue}>{formatCurrency(totals.totalPayable)}</div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Net Balance</div>
                        <div className={`${styles.summaryValue} ${totals.totalReceivable - totals.totalPayable >= 0 ? styles.profit : styles.loss}`}>
                            {formatCurrency(totals.totalReceivable - totals.totalPayable)}
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Total Parties</div>
                        <div className={styles.summaryValue}>{reportData.length}</div>
                    </div>
                </div>
            )}

            {/* Error / Loading / Table / Empty */}
            {error && (
                <div className={styles.errorMessage}>
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading parties data...</p>
                </div>
            )}

            {!loading && !error && reportData.length > 0 && (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.reportTable}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th onClick={() => handleSort("name")} className={styles.sortableHeader}>
                                        Party Name
                                    </th>
                                    <th onClick={() => handleSort("phoneNo")} className={styles.sortableHeader}>
                                        Phone
                                    </th>
                                    <th onClick={() => handleSort("gstin")} className={styles.sortableHeader}>
                                        GSTIN
                                    </th>
                                    <th onClick={() => handleSort("gstType")} className={styles.sortableHeader}>
                                        GST Type
                                    </th>
                                    <th onClick={() => handleSort("state")} className={styles.sortableHeader}>
                                        State
                                    </th>
                                    <th onClick={() => handleSort("receivableBalance")} className={styles.sortableHeader}>
                                        Receivable
                                    </th>
                                    <th onClick={() => handleSort("payableBalance")} className={styles.sortableHeader}>
                                        Payable
                                    </th>
                                    <th className={styles.tableHeader}>Action</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {currentItems.map((item) => (
                                    <tr key={item.partyId} className={styles.tableRow}>
                                        <td className={styles.tableCell}>{item.name || "-"}</td>
                                        <td className={styles.tableCell}>{item.phoneNo || "-"}</td>
                                        <td className={styles.tableCell}>{item.gstin || "-"}</td>
                                        <td className={styles.tableCell}>{item.gstType?.replace(/_/g, " ") || "-"}</td>
                                        <td className={styles.tableCell}>{item.state?.replace(/_/g, " ") || "-"}</td>
                                        <td className={`${styles.tableCell} ${item.receivableBalance > 0 ? styles.profitCell : ""}`}>
                                            {formatBalance(item.receivableBalance)}
                                        </td>
                                        <td className={`${styles.tableCell} ${item.payableBalance > 0 ? styles.lossCell : ""}`}>
                                            {formatBalance(item.payableBalance)}
                                        </td>
                                        <td className={styles.tableCell}>
                                            <button onClick={() => openStatement(item)} className={styles.refreshButton} style={{ padding: "6px 12px", fontSize: "0.875rem" }}>
                                                View Statement
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={styles.paginationButton}>
                                Previous
                            </button>
                            <div className={styles.paginationInfo}>Page {currentPage} of {totalPages}</div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={styles.paginationButton}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {!loading && !error && reportData.length === 0 && (
                <div className={styles.emptyState}>
                    <h3 className={styles.emptyTitle}>No Parties Found</h3>
                    <p className={styles.emptyDescription}>No party records available for this company.</p>
                </div>
            )}

            {/* Statement Popup */}
            {isPopupOpen && selectedParty && (
                <div className={styles.modalOverlay} onClick={() => setIsPopupOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Statement - {selectedParty.name}</h2>
                            <button onClick={() => setIsPopupOpen(false)} className={styles.modalClose}>×</button>
                        </div>

                        {/* Statement Filters */}
                        <div className={styles.filtersSection} style={{ padding: "16px", borderBottom: "1px solid #eee" }}>
                            <div className={styles.filtersGrid}>
                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Period</label>
                                    <select
                                        name="period"
                                        value={statementFilters.period}
                                        onChange={handleStatementFilterChange}
                                        className={styles.filterSelect}
                                    >
                                        {/* <option value="All">All Time</option> */}
                                        <option value="Today">Today</option>
                                        <option value="Week">Week</option>
                                        <option value="Month">Month</option>
                                        <option value="Quarter">Quarter</option>
                                        <option value="Year">Year</option>
                                        <option value="CUSTOM">Custom</option>
                                    </select>
                                </div>

                                {statementFilters.period === "CUSTOM" && (
                                    <>
                                        <div className={styles.filterGroup}>
                                            <label className={styles.filterLabel}>Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={statementFilters.startDate}
                                                onChange={handleStatementFilterChange}
                                                className={styles.filterInput}
                                            />
                                        </div>
                                        <div className={styles.filterGroup}>
                                            <label className={styles.filterLabel}>End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={statementFilters.endDate}
                                                onChange={handleStatementFilterChange}
                                                className={styles.filterInput}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <button onClick={applyStatementFilters} className={styles.refreshButton} disabled={statementLoading}>
                                Apply Filters
                            </button>
                        </div>

                        {/* Statement Table */}
                        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            {statementLoading && (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.spinner}></div>
                                    <p>Loading statement...</p>
                                </div>
                            )}

                            {statementError && (
                                <div className={styles.errorMessage}>
                                    <span>{statementError}</span>
                                </div>
                            )}

                            {!statementLoading && !statementError && statementData.length > 0 && (
                                <table className={styles.reportTable} style={{ width: "100%" }}>
                                    <thead className={styles.tableHeader}>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Reference</th>
                                            <th>Debit</th>
                                            <th>Credit</th>
                                            <th>Running Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className={styles.tableBody}>
                                        {statementData.map((stmt) => (
                                            <tr key={stmt.id}>
                                                <td className={styles.tableCell}>{formatDate(stmt.transactionDate)}</td>
                                                <td className={styles.tableCell}>{stmt.transactionType || "-"}</td>
                                                <td className={styles.tableCell}>{stmt.referenceNumber || "-"}</td>
                                                <td className={styles.tableCell}>{stmt.debitAmount > 0 ? formatCurrency(stmt.debitAmount) : "-"}</td>
                                                <td className={styles.tableCell}>{stmt.creditAmount > 0 ? formatCurrency(stmt.creditAmount) : "-"}</td>
                                                <td className={styles.tableCell}>{formatBalance(stmt.runningBalance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {!statementLoading && !statementError && statementData.length === 0 && (
                                <div className={styles.emptyState} style={{ padding: "40px" }}>
                                    <p>No transactions found for the selected period.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}