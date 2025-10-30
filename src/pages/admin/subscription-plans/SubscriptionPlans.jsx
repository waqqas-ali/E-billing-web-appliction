// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import { toast } from "react-toastify";
// import Button from "../../../components/ui/Button/Button";
// import styles from "./SubscriptionPlans.module.css";

// const SubscriptionPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const navigate = useNavigate();

//   const fetchPlans = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.get(
//         `${config.BASE_URL}/get/subscription-plan`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       setPlans(response.data);
//     } catch (error) {
//       console.error("Plans fetch error:", error);
//       toast.error("Failed to fetch plans.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
//   };

//   const handlePurchase = async () => {
//     if (!selectedPlan) {
//       toast.error("Please select a plan.");
//       return;
//     }

//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const payload = {
//         subscriptionPlanId: selectedPlan.subscriptionPlanId,
//       };
//       const response = await axios.post(
//         `${config.BASE_URL}/buy/subscription-plan`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       toast.success("Subscription purchased successfully!");
//       console.log("Purchase response:", response.data);
//       // Re-check subscription or navigate to dashboard/company creation
//       navigate("/create-company");
//     } catch (error) {
//       console.error("Purchase error:", error);
//       toast.error("Purchase failed. Please try again.");
//     }
//   };

//   if (loading) return <div>Loading plans...</div>;

//   return (
//     <div className={styles.plansContainer}>
//       <h1 className={styles.title}>Choose a Subscription Plan</h1>
//       <div className={styles.plansGrid}>
//         {plans.map((plan) => (
//           <div key={plan.subscriptionPlanId} className={styles.planCard}>
//             <h2>{plan.name}</h2>
//             <p className={styles.price}>₹{plan.price}</p>
//             <p className={styles.duration}>{plan.durationDays} days</p>
//             <p className={styles.description}>{plan.description}</p>
//             <ul className={styles.features}>
//               {plan.featureResponseDtos.map((feature) => (
//                 <li key={feature.featureId}>
//                   {feature.name}: {feature.description} (Limit:{" "}
//                   {feature.usageLimit})
//                 </li>
//               ))}
//             </ul>
//             <Button
//               variant="primary"
//               onClick={() => handlePlanSelect(plan)}
//               disabled={
//                 selectedPlan &&
//                 selectedPlan.subscriptionPlanId !== plan.subscriptionPlanId
//               }
//             >
//               {selectedPlan &&
//               selectedPlan.subscriptionPlanId === plan.subscriptionPlanId
//                 ? "Selected"
//                 : "Select Plan"}
//             </Button>
//           </div>
//         ))}
//       </div>
//       {selectedPlan && (
//         <div className={styles.purchaseSection}>
//           <Button variant="primary" onClick={handlePurchase} loading={false}>
//             Buy {selectedPlan.name} for ₹{selectedPlan.price}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubscriptionPlans;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import { toast } from "react-toastify";
// import Button from "../../../components/ui/Button/Button";
// import styles from "./SubscriptionPlans.module.css";

// const SubscriptionPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const navigate = useNavigate();

//   const decodeToken = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const exp = payload.exp * 1000; // Convert to milliseconds
//       console.log("Token Payload:", payload); // Debug
//       console.log("Token Expiration:", new Date(exp).toISOString()); // Debug
//       console.log("Current Time:", new Date().toISOString()); // Debug
//       if (Date.now() > exp) {
//         console.log("Token expired. Attempting refresh."); // Debug
//         return { valid: false, payload };
//       }
//       return { valid: true, payload };
//     } catch (e) {
//       console.error("Token decode error:", e);
//       return { valid: false, payload: null };
//     }
//   };

//   const refreshAccessToken = async () => {
//     try {
//       const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       const refreshToken = eBilling.refreshToken?.trim();
//       console.log("Refreshing token with:", refreshToken); // Debug
//       if (!refreshToken) {
//         throw new Error("No refresh token found.");
//       }
//       const response = await axios.post(`${config.BASE_URL}/refresh-token`, {
//         refreshToken,
//       });
//       const newAccessToken = response.data.accessToken;
//       console.log("New Access Token:", newAccessToken); // Debug
//       localStorage.setItem(
//         "eBilling",
//         JSON.stringify({ ...eBilling, accessToken: newAccessToken })
//       );
//       return newAccessToken;
//     } catch (error) {
//       console.error("Token refresh error:", error.response?.data || error.message);
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//       navigate("/login");
//       return null;
//     }
//   };

//   const fetchPlans = async () => {
//     try {
//       const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       let accessToken = eBilling.accessToken?.trim();
//       console.log("fetchPlans Access Token:", accessToken); // Debug
//       console.log("eBilling Object:", eBilling); // Debug
//       if (!accessToken) {
//         toast.error("No access token found. Please log in.");
//         navigate("/login");
//         return;
//       }
//       const { valid } = decodeToken(accessToken);
//       if (!valid) {
//         accessToken = await refreshAccessToken();
//         if (!accessToken) return;
//       }
//       console.log("fetchPlans Authorization Header:", `Bearer ${accessToken}`); // Debug
//       const response = await axios.get(
//         `${config.BASE_URL}/get/subscription-plan`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       setPlans(response.data);
//       console.log("Fetched Plans:", response.data); // Debug
//     } catch (error) {
//       console.error("Plans fetch error:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         toast.error("Unauthorized. Please log in again.");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error("Failed to fetch plans.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
//     console.log("Selected Plan:", plan); // Debug
//   };

//   const handlePurchase = async () => {
//     if (!selectedPlan) {
//       toast.error("Please select a plan.");
//       return;
//     }

//     try {
//       const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       let accessToken = eBilling.accessToken?.trim();
//       console.log("handlePurchase Access Token:", accessToken); // Debug
//       console.log("eBilling Object:", eBilling); // Debug
//       if (!accessToken) {
//         toast.error("No access token found. Please log in.");
//         navigate("/login");
//         return;
//       }
//       const { valid, payload: tokenPayload } = decodeToken(accessToken);
//       if (!valid) {
//         accessToken = await refreshAccessToken();
//         if (!accessToken) return;
//       }
//       // Use eBilling.user.id instead of eBilling.user.userId
//       let userId = eBilling.user?.id;
//       if (!userId) {
//         console.log("No userId in eBilling.user, checking token payload"); // Debug
//         userId = tokenPayload?.userId || tokenPayload?.sub; // Fallback to token
//         if (!userId) {
//           toast.error("User ID not found. Please log in again.");
//           navigate("/login");
//           return;
//         }
//       }
//       console.log("User ID:", userId); // Debug
//       console.log("Purchase Payload:", {
//         userId,
//         subscriptionPlanId: selectedPlan.subscriptionPlanId,
//       }); // Debug
//       console.log("handlePurchase Authorization Header:", `Bearer ${accessToken}`); // Debug
//       const payload = {
//         userId,
//         subscriptionPlanId: selectedPlan.subscriptionPlanId,
//       };
//       const response = await axios.post(
//         `${config.BASE_URL}/buy/subscription-plan`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       toast.success("Subscription purchased successfully!");
//       console.log("Purchase response:", response.data);
//       // Verify subscription status
//       const planResponse = await axios.get(`${config.BASE_URL}/check-subscription`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       console.log("Post-purchase plan response:", planResponse.data);
//       if (planResponse.data.active) {
//         navigate("/create-company");
//       } else {
//         toast.error("Subscription not activated. Contact support.");
//       }
//     } catch (error) {
//       console.error("Purchase error:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         toast.error("Unauthorized. Please log in again.");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error("Purchase failed. Please try again.");
//       }
//     }
//   };

//   if (loading) return <div>Loading plans...</div>;

//   return (
//     <div className={styles.plansContainer}>
//       <h1 className={styles.title}>Choose a Subscription Plan</h1>
//       <div className={styles.plansGrid}>
//         {plans.map((plan) => (
//           <div key={plan.subscriptionPlanId} className={styles.planCard}>
//             <h2>{plan.name}</h2>
//             <p className={styles.price}>₹{plan.price}</p>
//             <p className={styles.duration}>{plan.durationDays} days</p>
//             <p className={styles.description}>{plan.description}</p>
//             <ul className={styles.features}>
//               {plan.featureResponseDtos.map((feature) => (
//                 <li key={feature.featureId}>
//                   {feature.name}: {feature.description} (Limit: {feature.usageLimit})
//                 </li>
//               ))}
//             </ul>
//             <Button
//               variant="primary"
//               onClick={() => handlePlanSelect(plan)}
//               disabled={
//                 selectedPlan &&
//                 selectedPlan.subscriptionPlanId !== plan.subscriptionPlanId
//               }
//             >
//               {selectedPlan &&
//               selectedPlan.subscriptionPlanId === plan.subscriptionPlanId
//                 ? "Selected"
//                 : "Select Plan"}
//             </Button>
//           </div>
//         ))}
//       </div>
//       {selectedPlan && (
//         <div className={styles.purchaseSection}>
//           <Button variant="primary" onClick={handlePurchase} loading={false}>
//             Buy {selectedPlan.name} for ₹{selectedPlan.price}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubscriptionPlans;






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button/Button";
import styles from "./SubscriptionPlans.module.css";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      console.log("Token Payload:", payload); // Debug
      console.log("Token Expiration:", new Date(exp).toISOString()); // Debug
      console.log("Current Time:", new Date().toISOString()); // Debug
      if (Date.now() > exp) {
        console.log("Token expired. Attempting refresh."); // Debug
        return { valid: false, payload };
      }
      return { valid: true, payload };
    } catch (e) {
      console.error("Token decode error:", e);
      return { valid: false, payload: null };
    }
  };

  const refreshAccessToken = async () => {
    try {
      const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
      const refreshToken = eBilling.refreshToken?.trim();
      console.log("Refreshing token with:", refreshToken); // Debug
      if (!refreshToken) {
        throw new Error("No refresh token found.");
      }
      const response = await axios.post(`${config.BASE_URL}/refresh-token`, {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      console.log("New Access Token:", newAccessToken); // Debug
      localStorage.setItem(
        "eBilling",
        JSON.stringify({ ...eBilling, accessToken: newAccessToken })
      );
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message);
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("eBilling");
      navigate("/login");
      return null;
    }
  };

  const fetchPlans = async () => {
    try {
      const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
      let accessToken = eBilling.accessToken?.trim();
      console.log("fetchPlans Access Token:", accessToken); // Debug
      console.log("eBilling Object:", eBilling); // Debug
      if (!accessToken) {
        toast.error("No access token found. Please log in.");
        navigate("/login");
        return;
      }
      const { valid } = decodeToken(accessToken);
      if (!valid) {
        accessToken = await refreshAccessToken();
        if (!accessToken) return;
      }
      console.log("fetchPlans Authorization Header:", `Bearer ${accessToken}`); // Debug
      const response = await axios.get(
        `${config.BASE_URL}/get/subscription-plan`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setPlans(response.data);
      console.log("Fetched Plans:", response.data); // Debug
    } catch (error) {
      console.error("Plans fetch error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error("Failed to fetch plans.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    console.log("Selected Plan:", plan); // Debug
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan.");
      return;
    }

    try {
      const eBilling = JSON.parse(localStorage.getItem("eBilling") || "{}");
      let accessToken = eBilling.accessToken?.trim();
      console.log("handlePurchase Access Token:", accessToken); // Debug
      console.log("eBilling Object:", eBilling); // Debug
      if (!accessToken) {
        toast.error("No access token found. Please log in.");
        navigate("/login");
        return;
      }
      const { valid, payload: tokenPayload } = decodeToken(accessToken);
      if (!valid) {
        accessToken = await refreshAccessToken();
        if (!accessToken) return;
      }
      let userId = eBilling.user?.id;
      if (!userId) {
        console.log("No userId in eBilling.user, checking token payload"); // Debug
        userId = tokenPayload?.userId || tokenPayload?.sub;
        if (!userId) {
          toast.error("User ID not found. Please log in again.");
          navigate("/login");
          return;
        }
      }
      console.log("User ID:", userId); // Debug
      console.log("Purchase Payload:", {
        userId,
        subscriptionPlanId: selectedPlan.subscriptionPlanId,
      }); // Debug
      console.log("handlePurchase Authorization Header:", `Bearer ${accessToken}`); // Debug
      const payload = {
        userId,
        subscriptionPlanId: selectedPlan.subscriptionPlanId,
      };
      const response = await axios.post(
        `${config.BASE_URL}/buy/subscription-plan`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Subscription purchased successfully!");
      console.log("Purchase response:", response.data); // Debug
      // Check if the response includes a new accessToken
      let checkSubscriptionToken = accessToken;
      if (response.data.accessToken) {
        console.log("New accessToken from purchase:", response.data.accessToken); // Debug
        checkSubscriptionToken = response.data.accessToken;
        localStorage.setItem(
          "eBilling",
          JSON.stringify({ ...eBilling, accessToken: checkSubscriptionToken })
        );
      }
      // Verify subscription status
      console.log("check-subscription Authorization Header:", `Bearer ${checkSubscriptionToken}`); // Debug
      const planResponse = await axios.get(`${config.BASE_URL}/check-subscription`, {
        headers: {
          Authorization: `Bearer ${checkSubscriptionToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Post-purchase plan response:", planResponse.data); // Debug
      if (planResponse.data.active) {
        navigate("/create-company");
      } else {
        toast.error("Subscription not activated. Contact support.");
      }
    } catch (error) {
      console.error("Purchase error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error("Purchase failed. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading plans...</div>;

  return (
    <div className={styles.plansContainer}>
      <h1 className={styles.title}>Choose a Subscription Plan</h1>
      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          <div key={plan.subscriptionPlanId} className={styles.planCard}>
            <h2>{plan.name}</h2>
            <p className={styles.price}>₹{plan.price}</p>
            <p className={styles.duration}>{plan.durationDays} days</p>
            <p className={styles.description}>{plan.description}</p>
            <ul className={styles.features}>
              {plan.featureResponseDtos.map((feature) => (
                <li key={feature.featureId}>
                  {feature.name}: {feature.description} (Limit: {feature.usageLimit})
                </li>
              ))}
            </ul>
            <Button
              variant="primary"
              onClick={() => handlePlanSelect(plan)}
              disabled={
                selectedPlan &&
                selectedPlan.subscriptionPlanId !== plan.subscriptionPlanId
              }
            >
              {selectedPlan &&
              selectedPlan.subscriptionPlanId === plan.subscriptionPlanId
                ? "Selected"
                : "Select Plan"}
            </Button>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div className={styles.purchaseSection}>
          <Button variant="primary" onClick={handlePurchase} loading={false}>
            Buy {selectedPlan.name} for ₹{selectedPlan.price}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;