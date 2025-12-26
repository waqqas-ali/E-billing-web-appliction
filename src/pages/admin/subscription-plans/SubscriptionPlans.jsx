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
//       let userId = eBilling.user?.id;
//       if (!userId) {
//         console.log("No userId in eBilling.user, checking token payload"); // Debug
//         userId = tokenPayload?.userId || tokenPayload?.sub;
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
//       console.log("Purchase response:", response.data); // Debug
//       // Check if the response includes a new accessToken
//       let checkSubscriptionToken = accessToken;
//       if (response.data.accessToken) {
//         console.log("New accessToken from purchase:", response.data.accessToken); // Debug
//         checkSubscriptionToken = response.data.accessToken;
//         localStorage.setItem(
//           "eBilling",
//           JSON.stringify({ ...eBilling, accessToken: checkSubscriptionToken })
//         );
//       }
//       // Verify subscription status
//       console.log("check-subscription Authorization Header:", `Bearer ${checkSubscriptionToken}`); // Debug
//       const planResponse = await axios.get(`${config.BASE_URL}/check-subscription`, {
//         headers: {
//           Authorization: `Bearer ${checkSubscriptionToken}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Post-purchase plan response:", planResponse.data); // Debug
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







import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import api from '../../../utils/axiosInstance'; // Your axios instance with auth/interceptors
import { toast } from 'react-toastify';
import styles from '../Styles/SubscriptionPlans.module.css';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/get/subscription-plan');

        // Handle different possible response structures
        const data = response.data;
        const planList = Array.isArray(data) 
          ? data 
          : data?.plans || data?.data || data?.subscriptionPlans || [];

        // Optional: sort by price or add any client-side transformation
        const sortedPlans = planList.sort((a, b) => a.price - b.price);

        setPlans(sortedPlans);
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
        const message = err.response?.data?.message 
          || 'Unable to load subscription plans. Please try again later.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    // You can pass the selected plan to checkout/payment page
    navigate('/checkout', { 
      state: { 
        selectedPlan: plan 
      }
    });

    // Alternative approaches you might want later:
    // navigate(`/checkout/${plan.id}`);
    // window.location.href = plan.checkoutUrl; // if backend provides direct link
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Loading available plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <XCircle size={64} color="var(--error)" />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryBtn}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Choose Your Plan</h1>
          <p className={styles.subtitle}>
            Pick the perfect plan for your business needs
          </p>
        </div>

        {plans.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No subscription plans available at the moment.</p>
          </div>
        ) : (
          <div className={styles.plansGrid}>
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`${styles.planCard} ${plan.isPopular ? styles.popular : ''}`}
              >
                {plan.isPopular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}

                <h2 className={styles.planName}>{plan.name}</h2>

                <div className={styles.pricing}>
                  <span className={styles.currency}>
                    {plan.currency || '$'}
                  </span>
                  <span className={styles.amount}>{plan.price}</span>
                  <span className={styles.period}>
                    /{plan.interval || 'month'}
                  </span>
                </div>

                <ul className={styles.featuresList}>
                  {plan.features?.map((feature, index) => (
                    <li key={index}>
                      <Check size={18} className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={styles.selectBtn}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={!plan.isActive}
                >
                  {plan.isActive ? 'Select Plan' : 'Coming Soon'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.securityNote}>
          <ShieldCheck size={16} />
          <span>Secure payments • Cancel anytime</span>
        </div>
      </div>
    </main>
  );
};

export default SubscriptionPlans;
