// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Parties.module.css";

// const Add_Parties = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { party = {}, companyId, token } = location.state || {};

//   const states = [
//     "ANDHRA_PRADESH",
//     "ARUNACHAL_PRADESH",
//     "ASSAM",
//     "BIHAR",
//     "CHHATTISGARH",
//     "GOA",
//     "GUJARAT",
//     "HARYANA",
//     "HIMACHAL_PRADESH",
//     "JHARKHAND",
//     "KARNATAKA",
//     "KERALA",
//     "MADHYA_PRADESH",
//     "MAHARASHTRA",
//     "MANIPUR",
//     "MEGHALAYA",
//     "MIZORAM",
//     "NAGALAND",
//     "ODISHA",
//     "PUNJAB",
//     "RAJASTHAN",
//     "SIKKIM",
//     "TAMIL_NADU",
//     "TELANGANA",
//     "TRIPURA",
//     "UTTAR_PRADESH",
//     "UTTARAKHAND",
//     "WEST_BENGAL",
//     "OTHER",
//   ];

//   const gstTypes = [
//     "UNREGISTER_CONSUMER",
//     "REGISTERD_BUSSINESS_REGULAR",
//     "REGISTED_BUSSINESS_COMPOSITION",
//   ];

//   const [name, setName] = useState(party.name || "");
//   const [gstin, setGstin] = useState(party.gstin || "");
//   const [gstType, setGstType] = useState(party.gstType || "");
//   const [phoneNo, setPhoneNo] = useState(party.phoneNo || "");
//   const [state, setState] = useState(party.state || "");
//   const [emailId, setEmailId] = useState(party.emailId || "");
//   const [billingAddress, setBillingAddress] = useState(party.billingAddress || "");
//   const [shippingAddress, setShippingAddress] = useState(party.shipingAddress || "");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCreateParty = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const payload = {
//       name,
//       gstin,
//       gstType,
//       phoneNo,
//       state,
//       emailId,
//       billingAddress,
//       shipingAddress: shippingAddress,
//     };

//     try {
//       if (party.partyId) {
//         await axios.put(`${config.BASE_URL}/party/${party.partyId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         alert("Party updated successfully");
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/created/party`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Party created successfully");
//       }
//       navigate("/parties");
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save party.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.formHeader}>
//         <div>
//           <h1 className={styles.formTitle}>
//             {party.partyId ? "Edit Party" : "Create Party"}
//           </h1>
//           <p className={styles.formSubtitle}>
//             {party.partyId ? "Update party details" : "Add a new party to your company"}
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/parties")}
//           className={styles.closeButton}
//           disabled={loading}
//         >
//           <i className="fas fa-times"></i> Close
//         </button>
//       </div>

//       {loading && (
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p>{party.partyId ? "Updating..." : "Creating..."}</p>
//         </div>
//       )}

//       {error && <div className={styles.error}>{error}</div>}

//       <form onSubmit={handleCreateParty} className={styles.form}>
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>Party Information</h2>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="name">
//                 Name <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="gstin">GST No</label>
//               <input
//                 type="text"
//                 id="gstin"
//                 value={gstin}
//                 onChange={(e) => setGstin(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="gstType">
//                 GST Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="gstType"
//                 value={gstType}
//                 onChange={(e) => setGstType(e.target.value)}
//                 required
//                 className={styles.select}
//                 disabled={loading}
//               >
//                 <option value="">Select GST Type</option>
//                 {gstTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="state">
//                 State <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="state"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 required
//                 className={styles.select}
//                 disabled={loading}
//               >
//                 <option value="">Select State</option>
//                 {states.map((s) => (
//                   <option key={s} value={s}>
//                     {s
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="phoneNo">Phone No</label>
//               <input
//                 type="tel"
//                 id="phoneNo"
//                 value={phoneNo}
//                 onChange={(e) => setPhoneNo(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="emailId">Email</label>
//               <input
//                 type="email"
//                 id="emailId"
//                 value={emailId}
//                 onChange={(e) => setEmailId(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </div>

//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>Address Details</h2>
//           <div className={styles.formGroup}>
//             <label htmlFor="billingAddress">Billing Address</label>
//             <textarea
//               id="billingAddress"
//               value={billingAddress}
//               onChange={(e) => setBillingAddress(e.target.value)}
//               className={styles.textarea}
//               disabled={loading}
//             ></textarea>
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="shippingAddress">Shipping Address</label>
//             <textarea
//               id="shippingAddress"
//               value={shippingAddress}
//               onChange={(e) => setShippingAddress(e.target.value)}
//               className={styles.textarea}
//               disabled={loading}
//             ></textarea>
//           </div>
//         </div>

//         <div className={styles.formActions}>
//           <button
//             type="submit"
//             className={styles.submitButton}
//             disabled={loading}
//           >
//             {party.partyId ? "Update Party" : "Create Party"}
//           </button>
//           <button
//             type="button"
//             className={styles.cancelButton}
//             onClick={() => navigate("/parties")}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Add_Parties;






// src/pages/Add_Parties.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import { X, Loader2, AlertCircle } from "lucide-react";
import styles from "./Parties.module.css";

const Add_Parties = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { party = {}, companyId, token } = state || {};

  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
    "GOA", "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND",
    "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB",
    "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
    "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
  ];

  const gstTypes = [
    "UNREGISTER_CONSUMER",
    "REGISTERD_BUSSINESS_REGULAR",
    "REGISTED_BUSSINESS_COMPOSITION",
  ];

  const [form, setForm] = useState({
    name: party.name || "",
    gstin: party.gstin || "",
    gstType: party.gstType || "",
    phoneNo: party.phoneNo || "",
    state: party.state || "",
    emailId: party.emailId || "",
    billingAddress: party.billingAddress || "",
    shippingAddress: party.shipingAddress || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      shipingAddress: form.shippingAddress,
    };

    try {
      if (party.partyId) {
        await axios.put(`${config.BASE_URL}/party/${party.partyId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${config.BASE_URL}/company/${companyId}/created/party`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/parties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save party.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div>
          <h1 className={styles.formTitle}>
            {party.partyId ? "Edit Party" : "Create Party"}
          </h1>
          <p className={styles.formSubtitle}>
            {party.partyId ? "Update party details" : "Add a new business contact"}
          </p>
        </div>
        <button
          onClick={() => navigate("/parties")}
          className={styles.closeBtn}
          disabled={loading}
        >
          <X size={18} />
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <Loader2 className={styles.spinner} size={40} />
          <p>{party.partyId ? "Updating..." : "Creating..."}</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Party Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Name <span className={styles.req}>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className={styles.field}>
              <label>GST No</label>
              <input name="gstin" value={form.gstin} onChange={handleChange} disabled={loading} />
            </div>
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                GST Type <span className={styles.req}>*</span>
              </label>
              <select
                name="gstType"
                value={form.gstType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Type</option>
                {gstTypes.map((t) => (
                  <option key={t} value={t}>
                    {formatEnum(t)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>
                State <span className={styles.req}>*</span>
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {formatEnum(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Phone</label>
              <input name="phoneNo" value={form.phoneNo} onChange={handleChange} disabled={loading} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input name="emailId" type="email" value={form.emailId} onChange={handleChange} disabled={loading} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Address</h2>
          <div className={styles.field}>
            <label>Billing Address</label>
            <textarea
              name="billingAddress"
              value={form.billingAddress}
              onChange={handleChange}
              rows={3}
              disabled={loading}
            />
          </div>
          <div className={styles.field}>
            <label>Shipping Address</label>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              rows={3}
              disabled={loading}
            />
          </div>
        </section>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {party.partyId ? "Update" : "Create"} Party
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate("/parties")} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const formatEnum = (val) =>
  val
    ? val
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

export default Add_Parties;