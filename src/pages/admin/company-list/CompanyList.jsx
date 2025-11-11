"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import config from "../../../config/apiconfig"
import { useNavigate } from "react-router-dom"
import { Plus, Eye, Edit2, LogIn, Trash2, Search, X, Mail, Phone, MapPin, Building2, FileText, Map } from "lucide-react"
import styles from "./CompanyList.module.css"

function CompanyList() {
  const navigate = useNavigate()
  const UserData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const userId = UserData.user?.id
  const token = UserData.accessToken

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login")
      return
    }
    fetchCompanies()
  }, [token, userId, navigate])

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${config.BASE_URL}/owner/${userId}/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCompanies(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load companies.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (company) => {
    navigate(`/create-company?edit=${company.companyId}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return
    setLoading(true)
    setError(null)
    try {
      await axios.delete(`${config.BASE_URL}/delete/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCompanies()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete company.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (company) => {
    const eBilling = JSON.parse(localStorage.getItem("eBilling")) || {}
    eBilling.selectedCompany = {
      id: company.companyId,
      name: company.bussinessName,
    }
    localStorage.setItem("eBilling", JSON.stringify(eBilling))
    console.log("Selected Company:", eBilling.selectedCompany)
    navigate("/")
  }

  const handleView = (company) => {
    setSelectedCompany(company)
  }

  const handleClosePopup = () => {
    setSelectedCompany(null)
  }

  const handleCreate = () => {
    navigate("/create-company")
  }

  const filteredCompanies = companies.filter((company) =>
    [company.bussinessName, company.emailId, company.phoneNo].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  return (
    <div className={styles["company-list-container"]}>
      {/* Header Section */}
      <div className={styles["header-section"]}>
        <div className={styles["header-content"]}>
          <h2 className={styles["list-title"]}>Your Companies</h2>
          <p className={styles["subtitle"]}>Manage and organize your business accounts</p>
        </div>
        <button onClick={handleCreate} className={styles["create-button"]} disabled={loading}>
          <Plus size={20} />
          <span>Create Company</span>
        </button>
      </div>

      {/* Search Section */}
      <div className={styles["search-section"]}>
        <div className={styles["search-box"]}>
          <Search size={18} className={styles["search-icon"]} />
          <input
            type="search"
            placeholder="Search by name, email, or phone..."
            className={styles["search-input"]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles["spinner"]}></div>
          <p>Loading companies...</p>
        </div>
      )}

      {/* Error State */}
      {error && <div className={styles["error-message"]}>{error}</div>}

      {/* Empty State */}
      {!loading && companies.length === 0 && !error && (
        <div className={styles["no-data-message"]}>
          <Building2 size={56} />
          <p>No companies found</p>
          <p className={styles["no-data-subtitle"]}>Click "Create Company" to add one!</p>
        </div>
      )}

      {/* Companies List - Desktop Table View */}
      {!loading && companies.length > 0 && (
        <div className={styles["table-responsive"]}>
          <table className={styles["company-table"]}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.companyId}>
                  <td className={styles["company-name-cell"]}>
                    <div className={styles["company-info"]}>
                      {company.logoUrl && (
                        <img
                          src={company.logoUrl || "/placeholder.svg"}
                          alt={company.bussinessName}
                          className={styles["company-logo"]}
                        />
                      )}
                      <div>
                        <div className={styles["company-name"]}>{company.bussinessName}</div>
                        <div className={styles["company-type"]}>
                          {company.bussinessType
                            ? company.bussinessType
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={styles["contact-cell"]}>
                    <div className={styles["contact-info"]}>
                      {company.emailId && (
                        <div className={styles["contact-item"]}>
                          <Mail size={16} />
                          <a href={`mailto:${company.emailId}`}>{company.emailId}</a>
                        </div>
                      )}
                      {company.phoneNo && (
                        <div className={styles["contact-item"]}>
                          <Phone size={16} />
                          <a href={`tel:${company.phoneNo}`}>{company.phoneNo}</a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles["action-buttons"]}>
                    <div className={styles["actions-label"]}>
                    <button
                      onClick={() => handleView(company)}
                      className={`${styles["action-button"]} ${styles["view-button"]}`}
                      title="View Details"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(company)}
                      className={`${styles["action-button"]} ${styles["edit-button"]}`}
                      title="Edit Company"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpen(company)}
                      className={`${styles["action-button"]} ${styles["open-button"]}`}
                      title="Open Dashboard"
                    >
                      <LogIn size={16} />
                      <span>Open</span>
                    </button>
                    <button
                      onClick={() => handleDelete(company.companyId)}
                      className={`${styles["action-button"]} ${styles["delete-button"]}`}
                      title="Delete Company"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Companies List - Mobile Card View */}
      {!loading && companies.length > 0 && (
        <div className={styles["cards-container"]}>
          {filteredCompanies.map((company) => (
            <div key={company.companyId} className={styles["company-card"]}>
              <div className={styles["card-header"]}>
                {company.logoUrl && (
                  <img
                    src={company.logoUrl || "/placeholder.svg"}
                    alt={company.bussinessName}
                    className={styles["card-logo"]}
                  />
                )}
                <div className={styles["card-title-section"]}>
                  <h3 className={styles["card-title"]}>{company.bussinessName}</h3>
                  <p className={styles["card-type"]}>
                    {company.bussinessType
                      ? company.bussinessType
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className={styles["card-content"]}>
                {company.emailId && (
                  <div className={styles["card-detail"]}>
                    <Mail size={18} />
                    <a href={`mailto:${company.emailId}`}>{company.emailId}</a>
                  </div>
                )}
                {company.phoneNo && (
                  <div className={styles["card-detail"]}>
                    <Phone size={18} />
                    <a href={`tel:${company.phoneNo}`}>{company.phoneNo}</a>
                  </div>
                )}
                {company.address && (
                  <div className={styles["card-detail"]}>
                    <MapPin size={18} />
                    <span>{company.address}</span>
                  </div>
                )}
              </div>

              <div className={styles["card-actions"]}>
                <button
                  onClick={() => handleView(company)}
                  className={`${styles["card-action-button"]} ${styles["view-button"]}`}
                >
                  <Eye size={18} />
                  View
                </button>
                <button
                  onClick={() => handleEditClick(company)}
                  className={`${styles["card-action-button"]} ${styles["edit-button"]}`}
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleOpen(company)}
                  className={`${styles["card-action-button"]} ${styles["open-button"]}`}
                >
                  <LogIn size={18} />
                  Open
                </button>
                <button
                  onClick={() => handleDelete(company.companyId)}
                  className={`${styles["card-action-button"]} ${styles["delete-button"]}`}
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedCompany && (
        <div className={styles["popup-overlay"]} onClick={handleClosePopup}>
          <div className={styles["popup-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["popup-header"]}>
              <h3 className={styles["popup-title"]}>{selectedCompany.bussinessName}</h3>
              <button onClick={handleClosePopup} className={styles["popup-close-button"]} aria-label="Close">
                <X size={24} />
              </button>
            </div>

            <div className={styles["popup-body"]}>
              {selectedCompany.logoUrl && (
                <div className={styles["popup-logo-section"]}>
                  <img
                    src={selectedCompany.logoUrl || "/placeholder.svg"}
                    alt="Logo"
                    className={styles["popup-logo"]}
                  />
                </div>
              )}

              <div className={styles["popup-details"]}>
                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <Building2 size={16} />
                    Business Type:
                  </span>
                  <span className={styles["detail-value"]}>
                    {selectedCompany.bussinessType
                      ? selectedCompany.bussinessType
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : "N/A"}
                  </span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <Mail size={16} />
                    Email:
                  </span>
                  <span className={styles["detail-value"]}>{selectedCompany.emailId || "N/A"}</span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <Phone size={16} />
                    Phone:
                  </span>
                  <span className={styles["detail-value"]}>{selectedCompany.phoneNo || "N/A"}</span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <MapPin size={16} />
                    Address:
                  </span>
                  <span className={styles["detail-value"]}>{selectedCompany.address || "N/A"}</span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <FileText size={16} />
                    GSTIN:
                  </span>
                  <span className={styles["detail-value"]}>{selectedCompany.gstin || "N/A"}</span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <Building2 size={16} />
                    Category:
                  </span>
                  <span className={styles["detail-value"]}>{selectedCompany.bussinessCategory || "N/A"}</span>
                </div>

                <div className={styles["detail-row"]}>
                  <span className={styles["detail-label"]}>
                    <Map size={16} />
                    State:
                  </span>
                  <span className={styles["detail-value"]}>
                    {selectedCompany.state
                      ? selectedCompany.state
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : "N/A"}
                  </span>
                </div>

                {selectedCompany.businessDescription && (
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Description:</span>
                    <span className={styles["detail-value"]}>{selectedCompany.businessDescription}</span>
                  </div>
                )}

                {selectedCompany.logoUrl && (
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Logo:</span>
                    <img
                      src={selectedCompany.logoUrl || "/placeholder.svg"}
                      alt="Company Logo"
                      className={styles["detail-image"]}
                    />
                  </div>
                )}

                {selectedCompany.signatureUrl && (
                  <div className={styles["detail-row"]}>
                    <span className={styles["detail-label"]}>Signature:</span>
                    <img
                      src={selectedCompany.signatureUrl || "/placeholder.svg"}
                      alt="Company Signature"
                      className={styles["detail-image"]}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles["popup-footer"]}>
              <button onClick={handleClosePopup} className={styles["popup-action-button"]}>
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyList
