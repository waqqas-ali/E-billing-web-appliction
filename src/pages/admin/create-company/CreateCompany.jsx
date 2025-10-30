"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "./CreateCompany.module.css"

function CreateCompany() {
  const navigate = useNavigate()

  // Get user info and token from eBilling localStorage
  const eBilling = JSON.parse(localStorage.getItem("eBilling")) || null
  const userId = eBilling?.user?.id || null
  const token = eBilling?.accessToken || null

  // Dropdown values
  const bussinessTypes = ["RETAIL", "WHOLESALE", "DISTRIBUTOR", "SERVICE", "MANUFACTURING", "OTHERS"]

  const states = [
    "ANDHRA_PRADESH",
    "ARUNACHAL_PRADESH",
    "ASSAM",
    "BIHAR",
    "CHHATTISGARH",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL_PRADESH",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "MADHYA_PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL_NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR_PRADESH",
    "UTTARAKHAND",
    "WEST_BENGAL",
    "OTHER",
  ]

  // Form state
  const [bussinessName, setBussinessName] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [emailId, setEmailId] = useState("")
  const [address, setAddress] = useState("")
  const [bussinessType, setBussinessType] = useState("")
  const [gstin, setGstin] = useState("")
  const [bussinessCategory, setBussinessCategory] = useState("")
  const [state, setState] = useState("")
  const [logo, setLogo] = useState(null)
  const [signature, setSignature] = useState(null)
  const [logoUrl, setLogoUrl] = useState("")
  const [signatureUrl, setSignatureUrl] = useState("")
  const [companyEditId, setCompanyEditId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // On mount: redirect if not logged in, fetch company if edit
  useEffect(() => {
    if (!token || !userId) {
      navigate("/login")
      return
    }

    const params = new URLSearchParams(window.location.search)
    const editId = params.get("edit")
    if (editId) {
      setLoading(true)
      setCompanyEditId(String(editId))
      fetchCompany(String(editId)).finally(() => setLoading(false))
    }
  }, [token, userId, navigate])

  // Fetch existing company data for editing
  const fetchCompany = async (id) => {
    try {
      const response = await axios.get(`${config.BASE_URL}/get/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const company = response.data
      if (company) {
        setBussinessName(company.bussinessName || "")
        setBusinessDescription(company.businessDescription || "")
        setPhoneNo(company.phoneNo || "")
        setEmailId(company.emailId || "")
        setAddress(company.address || "")
        setBussinessType(bussinessTypes.includes(company.bussinessType) ? company.bussinessType : "")
        setState(states.includes(company.state) ? company.state : "")
        setGstin(company.gstin || "")
        setBussinessCategory(company.bussinessCategory || "")
        setLogoUrl(company.logoUrl || "")
        setSignatureUrl(company.signatureUrl || "")
        setError(null)
      } else {
        setError("Company data not found.")
      }
    } catch (err) {
      console.error("Fetch company error:", {
        message: err.response?.data?.message,
        status: err.response?.status,
        url: `${config.BASE_URL}/get/company/${id}`,
        token: token ? "Token present" : "Token missing",
      })
      setError(
        err.response?.data?.message ||
          `Failed to load company data: ${
            err.response?.status === 401 ? "Unauthorized access. Please check your login credentials." : err.message
          }`,
      )
    }
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token || !userId) {
      setError("Authentication failed. Please log in again.")
      return
    }

    const formData = new FormData()
    formData.append("bussinessName", bussinessName)
    if (businessDescription) formData.append("businessDescription", businessDescription)
    formData.append("phoneNo", phoneNo)
    if (emailId) formData.append("emailId", emailId)
    formData.append("address", address)
    if (bussinessType) formData.append("bussinessType", bussinessType)
    formData.append("gstin", gstin)
    if (bussinessCategory) formData.append("bussinessCategory", bussinessCategory)
    formData.append("state", state)
    if (logo instanceof File) {
      formData.append("logo", logo)
    }
    if (signature instanceof File) {
      formData.append("signature", signature)
    }

    try {
      setLoading(true)
      const url = companyEditId
        ? `${config.BASE_URL}/update/company/${companyEditId}`
        : `${config.BASE_URL}/create/company/by/owner/${userId}`
      const method = companyEditId ? axios.put : axios.post

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201 || response.status === 200) {
        alert(companyEditId ? "Company updated successfully" : "Company created successfully")
        navigate("/company-list")
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message)
      setError(err.response?.data?.message || "Failed to save company. Check required fields.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles["company-form-container"]}>
      <div className={styles["form-header"]}>
        <h1 className={styles["company-form-title"]}>{companyEditId ? "Edit Company" : "Create Company"}</h1>
        <p className={styles["form-subtitle"]}>
          {companyEditId ? "Update your company information" : "Add a new company to your account"}
        </p>
      </div>

      {loading && <div className={styles["loading-message"]}>Loading...</div>}
      {error && <div className={styles["error-message"]}>{error}</div>}

      <form className={styles["company-form"]} onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Basic Information</h2>

          <div className={styles["form-group"]}>
            <label htmlFor="businessName">
              Business Name <span className={styles["required"]}>*</span>
            </label>
            <input
              type="text"
              id="businessName"
              className={styles["form-input"]}
              placeholder="e.g., My Awesome Business Pvt. Ltd."
              value={bussinessName}
              onChange={(e) => setBussinessName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="businessDescription">Business Description</label>
            <textarea
              id="businessDescription"
              className={`${styles["form-input"]} ${styles["textarea"]}`}
              placeholder="Brief description of your business..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="phoneNo">
                Phone Number <span className={styles["required"]}>*</span>
              </label>
              <input
                type="tel"
                id="phoneNo"
                className={styles["form-input"]}
                placeholder="e.g., +91 9876543210"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="emailId">Email</label>
              <input
                type="email"
                id="emailId"
                className={styles["form-input"]}
                placeholder="e.g., contact@mybusiness.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Address & Location Section */}
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Address & Location</h2>

          <div className={styles["form-group"]}>
            <label htmlFor="address">
              Address <span className={styles["required"]}>*</span>
            </label>
            <input
              type="text"
              id="address"
              className={styles["form-input"]}
              placeholder="e.g., 123 Main St, City, State, Pin Code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="state">
                State <span className={styles["required"]}>*</span>
              </label>
              <select
                id="state"
                className={`${styles["form-input"]} ${styles["select"]}`}
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s
                      .replace(/_/g, " ")
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="bussinessType">
                Business Type <span className={styles["required"]}>*</span>
              </label>
              <select
                id="bussinessType"
                className={`${styles["form-input"]} ${styles["select"]}`}
                value={bussinessType}
                onChange={(e) => setBussinessType(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Business Type</option>
                {bussinessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type
                      .replace(/_/g, " ")
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Business Details Section */}
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Business Details</h2>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="gstin">
                GSTIN <span className={styles["required"]}>*</span>
              </label>
              <input
                type="text"
                id="gstin"
                className={styles["form-input"]}
                placeholder="e.g., 22AAAAA0000A1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="bussinessCategory">Business Category</label>
              <input
                type="text"
                id="bussinessCategory"
                className={styles["form-input"]}
                placeholder="e.g., Electronics, Fashion, Food"
                value={bussinessCategory}
                onChange={(e) => setBussinessCategory(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* File Uploads Section */}
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Company Assets</h2>

          <div className={styles["file-upload-group"]}>
            <div className={styles["file-upload"]}>
              <label htmlFor="logo" className={styles["file-label"]}>
                <span className={styles["file-icon"]}>📁</span>
                <span className={styles["file-text"]}>
                  <span className={styles["file-title"]}>Upload Logo</span>
                  <span className={styles["file-hint"]}>PNG, JPG up to 5MB</span>
                </span>
              </label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                disabled={loading}
                className={styles["file-input"]}
              />
              {logo instanceof File ? (
                <span className={styles["file-name"]}>{logo.name}</span>
              ) : logoUrl ? (
                <span className={styles["file-name"]}>
                  Current:{" "}
                  <a href={logoUrl} target="_blank" rel="noopener noreferrer">
                    View Logo
                  </a>
                </span>
              ) : (
                <span className={styles["file-name"]}>No file chosen</span>
              )}
            </div>

            <div className={styles["file-upload"]}>
              <label htmlFor="signature" className={styles["file-label"]}>
                <span className={styles["file-icon"]}>📁</span>
                <span className={styles["file-text"]}>
                  <span className={styles["file-title"]}>Upload Signature</span>
                  <span className={styles["file-hint"]}>PNG, JPG up to 5MB</span>
                </span>
              </label>
              <input
                type="file"
                id="signature"
                accept="image/*"
                onChange={(e) => setSignature(e.target.files[0])}
                disabled={loading}
                className={styles["file-input"]}
              />
              {signature instanceof File ? (
                <span className={styles["file-name"]}>{signature.name}</span>
              ) : signatureUrl ? (
                <span className={styles["file-name"]}>
                  Current:{" "}
                  <a href={signatureUrl} target="_blank" rel="noopener noreferrer">
                    View Signature
                  </a>
                </span>
              ) : (
                <span className={styles["file-name"]}>No file chosen</span>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles["form-actions"]}>
          <button type="submit" className={styles["submit-button"]} disabled={loading}>
            {loading
              ? companyEditId
                ? "Updating..."
                : "Submitting..."
              : companyEditId
                ? "Update Company"
                : "Create Company"}
          </button>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={() => navigate("/company-list")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCompany
