// // src/pages/Payment/PaymentIn.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Payment.module.css";
// import { toast } from "react-toastify";

// const PaymentIn = () => {
//   const navigate = useNavigate();

//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");

//   const getDefaultRange = () => {
//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 30);
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   };

//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   };

//   const fetchPayments = async () => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//       navigate("/login");
//       return;
//     }
//     if (!companyId) {
//       toast.error("No company selected.");
//       return;
//     }

//     const { startDate: defStart, endDate: defEnd } = getDefaultRange();
//     const params = {
//       startDate: filterStartDate || defStart,
//       endDate: filterEndDate || defEnd,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/payment-in/list/by/filter`,
//         {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000,
//         }
//       );
//       setPayments(res.data || []);
//       toast.success("Payments loaded");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         toast.error("Invalid token – logging out");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load payments");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, companyId]);

//   // DELETE PAYMENT
//   const deletePayment = async (paymentInId) => {
//     if (!window.confirm("Delete this payment-in? This cannot be undone.")) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPayments((prev) => prev.filter((p) => p.paymentInId !== paymentInId));
//       setSelected(null);
//       toast.success("Payment deleted successfully");
//     } catch (err) {
//       console.error("Delete error:", err);
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Logging out...");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to delete payment");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Payments In</h1>
//           <p className={styles["form-subtitle"]}>All money received from parties</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_payment_in")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Payment In
//         </button>
//       </div>

//       {/* DATE FILTER */}
//       <div
//         style={{
//           marginBottom: "16px",
//           display: "flex",
//           gap: "12px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Start Date</label>
//           <input
//             type="date"
//             value={filterStartDate}
//             onChange={(e) => setFilterStartDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>End Date</label>
//           <input
//             type="date"
//             value={filterEndDate}
//             onChange={(e) => setFilterEndDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <button
//           onClick={fetchPayments}
//           className={styles["submit-button"]}
//           style={{ alignSelf: "end", height: "40px" }}
//           disabled={loading}
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading payments...</p>
//         </div>
//       )}

//       {/* TABLE */}
//       {payments.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Receipt #</th>
//                 <th>Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Amount</th>
//                 <th>Payment Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((p) => (
//                 <tr key={p.paymentInId}>
//                   <td>{p.receiptNo}</td>
//                   <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
//                   <td>{p.partyResponseDto?.name || "—"}</td>
//                   <td>{p.phoneNumber}</td>
//                   <td>₹{p.receivedAmount?.toFixed(2)}</td>
//                   <td>{p.paymentType}</td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelected(p)}
//                       className={`${styles["action-button"]} ${styles["view-button"]}`}
//                       title="View details"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         !loading && (
//           <div className={styles["no-data"]}>
//             <p>No payments in found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click “+ New Payment In” to record one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL WITH DELETE */}
//       {selected && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelected(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Receipt #{selected.receiptNo}</h3>
//                 <div className={styles["balance-badge"]}>
//                   ₹{selected.receivedAmount?.toFixed(2)}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//                 {/* DELETE BUTTON */}
//                 <button
//                   onClick={() => deletePayment(selected.paymentInId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete payment"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelected(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* SUMMARY */}
//             <section className={styles["card-section"]}>
//               <h4>Payment Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>ID:</strong> {selected.paymentInId}</p>
//                 <p><strong>Date:</strong> {new Date(selected.paymentDate).toLocaleDateString()}</p>
//                 <p><strong>Phone:</strong> {selected.phoneNumber}</p>
//                 <p><strong>Amount:</strong> ₹{selected.receivedAmount?.toFixed(2)}</p>
//                 <p><strong>Payment Type:</strong> {selected.paymentType}</p>
//                 <p><strong>Description:</strong> {selected.description || "—"}</p>
//               </div>
//             </section>

//             {/* PARTY */}
//             {selected.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selected.partyResponseDto.name}</p>
//                   <p><strong>GSTIN:</strong> {selected.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>Phone:</strong> {selected.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>GST Type:</strong> {selected.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>State:</strong> {selected.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Email:</strong> {selected.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>Billing:</strong> {selected.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping:</strong> {selected.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentIn;







// src/pages/Payment/PaymentIn.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Payment.module.css";
import { toast } from "react-toastify";

const PaymentIn = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const getDefaultRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const fetchPayments = async () => {
    if (!token || !isTokenValid()) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("eBilling");
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.error("No company selected.");
      return;
    }

    const { startDate: defStart, endDate: defEnd } = getDefaultRange();
    const params = {
      startDate: filterStartDate || defStart,
      endDate: filterEndDate || defEnd,
    };

    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/payment-in/list/by/filter`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      setPayments(res.data || []);
      toast.success("Payments loaded");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Invalid token – logging out");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to load payments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, companyId]);

  // DELETE PAYMENT
  const deletePayment = async (paymentInId) => {
    if (!window.confirm("Delete this payment-in? This cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments((prev) => prev.filter((p) => p.paymentInId !== paymentInId));
      setSelected(null);
      toast.success("Payment deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Logging out...");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to delete payment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Payments In</h1>
          <p className={styles["form-subtitle"]}>All money received from parties</p>
        </div>
        <button
          onClick={() => navigate("/create_payment_in")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          + New Payment In
        </button>
      </div>

      {/* DATE FILTER */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Start Date</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className={styles["form-input"]}
            style={{ width: "160px" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>End Date</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className={styles["form-input"]}
            style={{ width: "160px" }}
          />
        </div>
        <button
          onClick={fetchPayments}
          className={styles["submit-button"]}
          style={{ alignSelf: "end", height: "40px" }}
          disabled={loading}
        >
          Apply Filter
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading payments...</p>
        </div>
      )}

      {/* TABLE */}
      {payments.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Date</th>
                <th>Party</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentInId}>
                  <td>{p.receiptNo}</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td>{p.partyResponseDto?.name || "—"}</td>
                  <td>{p.phoneNumber}</td>
                  <td>₹{p.receivedAmount?.toFixed(2)}</td>
                  <td>{p.paymentType}</td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelected(p)}
                      className={`${styles["action-button"]} ${styles["view-button"]}`}
                      title="View details"
                    >
                      View
                    </button>

                    {/* Inline Edit Button */}
                    <button
                      onClick={() => navigate(`/create_payment_in?edit=${p.paymentInId}`)}
                      className={`${styles["action-button"]} ${styles["edit-button"]}`}
                      title="Edit"
                      style={{ marginLeft: "6px", fontSize: "0.85rem" }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className={styles["no-data"]}>
            <p>No payments in found</p>
            <p className={styles["no-data-subtitle"]}>
              Click “+ New Payment In” to record one.
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL WITH EDIT & DELETE */}
      {selected && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelected(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Receipt #{selected.receiptNo}</h3>
                <div className={styles["balance-badge"]}>
                  ₹{selected.receivedAmount?.toFixed(2)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {/* EDIT BUTTON */}
                <button
                  onClick={() => navigate(`/create_payment_in?edit=${selected.paymentInId}`)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit payment"
                  disabled={loading}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deletePayment(selected.paymentInId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete payment"
                  disabled={loading}
                >
                  Delete
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelected(null)}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>

            {/* SUMMARY */}
            <section className={styles["card-section"]}>
              <h4>Payment Summary</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>ID:</strong> {selected.paymentInId}</p>
                <p><strong>Date:</strong> {new Date(selected.paymentDate).toLocaleDateString()}</p>
                <p><strong>Phone:</strong> {selected.phoneNumber}</p>
                <p><strong>Amount:</strong> ₹{selected.receivedAmount?.toFixed(2)}</p>
                <p><strong>Payment Type:</strong> {selected.paymentType}</p>
                <p><strong>Description:</strong> {selected.description || "—"}</p>
              </div>
            </section>

            {/* PARTY */}
            {selected.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selected.partyResponseDto.name}</p>
                  <p><strong>GSTIN:</strong> {selected.partyResponseDto.gstin || "—"}</p>
                  <p><strong>Phone:</strong> {selected.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>GST Type:</strong> {selected.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>State:</strong> {selected.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Email:</strong> {selected.partyResponseDto.emailId || "—"}</p>
                  <p><strong>Billing:</strong> {selected.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping:</strong> {selected.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentIn;