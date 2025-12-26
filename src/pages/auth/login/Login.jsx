// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import { toast } from "react-toastify";
// import styles from "./Login.module.css";
// import Input from "../../../components/ui/Input/Input";
// import Button from "../../../components/ui/Button/Button";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     emailId: "",
//     password: "",
//     rememberMe: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Toggle password visibility
//   const togglePassword = () => setShowPassword((prev) => !prev);

//   // Validation logic
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.emailId) {
//       newErrors.emailId = "Email is required.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
//       newErrors.emailId = "Invalid email format.";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required.";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${config.BASE_URL}/auth/login`,
//         formData
//       );

//       toast.success("Login successful!");
//       console.log("Login Response:", response.data);

//       // Build eBilling object from flat API fields
//       const eBillingData = {
//         accessToken: response.data.accessToken,
//         refreshToken: response.data.refreshToken,
//         user: {
//           id: response.data.userId,
//           name: response.data.userName,
//           email: response.data.emailId,
//           roles: response.data.roleName, // Array of roles
//         },
//       };

//       // Save everything under one key
//       localStorage.setItem("eBilling", JSON.stringify(eBillingData));
//       console.log("eBilling object saved:", eBillingData);

//       // 👉 Role-based redirect
//       const roles = response.data.roleName; // Array ["ADMIN"] or ["SUPER_ADMIN"]

//       if (roles.includes("SUPER_ADMIN")) {
//         navigate("/super-admin");
//       } else if (roles.includes("ADMIN")) {
//         // Check subscription before redirecting admins
//         const userId = response.data.userId;
//         const accessToken = response.data.accessToken;

//         try {
//           const planRes = await axios.get(
//             `${config.BASE_URL}/user/${userId}/subscription/isActive`,
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//               },
//             }
//           );

//           console.log("Plan response:", planRes.data);

//           if (planRes.data && planRes.data.active) {
//             toast.success("User has an active plan ✅");

//             // Fetch companies to check if any exist and handle redirection
//             const companiesRes = await axios.get(
//               `${config.BASE_URL}/owner/${userId}/companies`,
//               {
//                 headers: { Authorization: `Bearer ${accessToken}` },
//               }
//             );

//             const companies = companiesRes.data;

//             if (companies.length === 0) {
//               // No companies, redirect to create company
//               navigate("/create-company");
//             } else {
//               // Check for previously selected company
//               const eBilling = JSON.parse(localStorage.getItem("eBilling"));
//               const selectedId = eBilling?.selectedCompany?.id;
//               const hasSelected = companies.some(
//                 (c) => c.companyId === selectedId
//               );

//               if (hasSelected) {
//                 // Redirect to dashboard with selected company
//                 navigate("/");
//               } else {
//                 // Redirect to company list to choose one
//                 navigate("/company-list");
//               }
//             }
//           } else {
//             toast.warning("User does not have an active plan ⚠");
//             // navigate("/subscription-plans");
//             navigate("/company-list");
//           }
//         } catch (planError) {
//           console.error("Error fetching plan or companies:", planError);
//           toast.error("Failed to fetch user plan or companies.");
//           // navigate("/subscription-plans");
//           navigate("/company-list");
//         }
//       } else {
//         // Unknown role fallback
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error(
//         "Login error:",
//         error.response ? error.response.data : error.message
//       );
//       toast.error("Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.container}>
//         <div className={styles.formContainer}>
//           <div className={styles.formCard}>
//             <h1 className={styles.title}>Sign in to our platform</h1>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               <Input
//                 label="Your Email"
//                 type="email"
//                 name="emailId"
//                 value={formData.emailId}
//                 onChange={handleInputChange}
//                 placeholder="example@company.com"
//                 error={errors.emailId}
//                 icon={Mail}
//                 disabled={loading}
//               />

//               <Input
//                 label="Your Password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Password"
//                 error={errors.password}
//                 showPasswordToggle
//                 onTogglePassword={togglePassword}
//                 icon={Lock}
//                 disabled={loading}
//               />

//               <div className={styles.formOptions}>
//                 <div className={styles.checkboxWrapper}>
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className={styles.checkbox}
//                     disabled={loading}
//                   />
//                   <label htmlFor="rememberMe" className={styles.checkboxLabel}>
//                     Remember me
//                   </label>
//                 </div>
//                 <Link to="/forgot-password" className={styles.forgotLink}>
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 variant="primary"
//                 size="medium"
//                 disabled={loading}
//                 loading={loading}
//               >
//                 Sign in
//               </Button>
//             </form>

//             <div className={styles.signupText}>
//               Not registered?{" "}
//               {/* <Link to="/register" className={styles.signupLink}>
//                 Create account
//               </Link> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Login;












// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import api from "../../../utils/axiosInstance"; 
// import styles from "./Login.module.css";
// import Input from "../../../components/ui/Input/Input";
// import Button from "../../../components/ui/Button/Button";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     emailId: "",
//     password: "",
//     rememberMe: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const togglePassword = () => setShowPassword((prev) => !prev);

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.emailId) {
//       newErrors.emailId = "Email is required.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
//       newErrors.emailId = "Invalid email format.";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required.";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);

//     try {
//       // 👈 Use api instance instead of axios directly
//       const response = await api.post("/auth/login", formData);

//       toast.success("Login successful!");
//       console.log("Login Response:", response.data);

//       const eBillingData = {
//         accessToken: response.data.accessToken,
//         refreshToken: response.data.refreshToken,
//         user: {
//           id: response.data.userId,
//           name: response.data.userName,
//           email: response.data.emailId,
//           roles: Array.isArray(response.data.roleName)
//             ? response.data.roleName
//             : [response.data.roleName].filter(Boolean),
//         },
//       };

//       localStorage.setItem("eBilling", JSON.stringify(eBillingData));
//       console.log("eBilling object saved:", eBillingData);

//       const roles = eBillingData.user.roles;

//       if (roles.includes("SUPER_ADMIN")) {
//         navigate("/super-admin");
//       } else if (roles.includes("ADMIN")) {
//         const userId = response.data.userId;

//         try {
//           // These calls will automatically use the access token + refresh if needed
//           const planRes = await api.get(`/user/${userId}/subscription/isActive`);
//           console.log("Plan response:", planRes.data);

//           if (planRes.data && planRes.data.active) {
//             toast.success("User has an active plan ✅");

//             const companiesRes = await api.get(`/owner/${userId}/companies`);
//             const companies = companiesRes.data || [];

//             if (companies.length === 0) {
//               navigate("/create-company");
//             } else {
//               const stored = JSON.parse(localStorage.getItem("eBilling"));
//               const selectedId = stored?.selectedCompany?.id;
//               const hasValidSelection = companies.some(
//                 (c) => c.companyId === selectedId
//               );

//               navigate(hasValidSelection ? "/" : "/company-list");
//             }
//           } else {
//             toast.warning("User does not have an active plan ⚠");
//             navigate("/company-list"); // or "/subscription-plans"
//           }
//         } catch (planError) {
//           console.error("Error checking plan/companies:", planError);
//           toast.error("Failed to load user data.");
//           navigate("/company-list");
//         }
//       } else {
//         toast.warning("Unauthorized role.");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       const msg =
//         error.response?.data?.message ||
//         "Login failed. Please check your credentials.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.container}>
//         <div className={styles.formContainer}>
//           <div className={styles.formCard}>
//             <h1 className={styles.title}>Sign in to our platform</h1>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               <Input
//                 label="Your Email"
//                 type="email"
//                 name="emailId"
//                 value={formData.emailId}
//                 onChange={handleInputChange}
//                 placeholder="example@company.com"
//                 error={errors.emailId}
//                 icon={Mail}
//                 disabled={loading}
//               />

//               <Input
//                 label="Your Password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Password"
//                 error={errors.password}
//                 showPasswordToggle
//                 onTogglePassword={togglePassword}
//                 icon={Lock}
//                 disabled={loading}
//               />

//               <div className={styles.formOptions}>
//                 <div className={styles.checkboxWrapper}>
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className={styles.checkbox}
//                     disabled={loading}
//                   />
//                   <label htmlFor="rememberMe" className={styles.checkboxLabel}>
//                     Remember me
//                   </label>
//                 </div>
//                 <Link to="/forgot-password" className={styles.forgotLink}>
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 variant="primary"
//                 size="medium"
//                 disabled={loading}
//                 loading={loading}
//               >
//                 Sign in
//               </Button>
//             </form>

//             <div className={styles.signupText}>
//               Not registered?{" "}
//               <Link to="/register" className={styles.signupLink}>
//                 Create account
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Login;








import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify'; // assuming you're using react-toastify
import api from '../../../utils/axiosInstance';
import styles from './Login.module.css';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';

// Optional: better error messages mapping (can be moved to separate file)
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Your account is temporarily locked. Please try again later.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address first.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'Something went wrong on our side. Please try again later.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
};

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized change handler
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Also clear global api error when user starts typing again
    if (apiError) setApiError('');
  }, [errors, apiError]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // More complete validation (can be extended)
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId.trim())) {
      newErrors.emailId = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getFriendlyErrorMessage = (error) => {
    if (!error) return ERROR_MESSAGES.DEFAULT;

    // From backend response
    if (error.response?.data?.message) {
      const backendMsg = error.response.data.message.toUpperCase();

      if (backendMsg.includes('INVALID') || backendMsg.includes('INCORRECT')) {
        return ERROR_MESSAGES.INVALID_CREDENTIALS;
      }
      if (backendMsg.includes('LOCKED') || backendMsg.includes('BLOCKED')) {
        return ERROR_MESSAGES.ACCOUNT_LOCKED;
      }
      if (backendMsg.includes('VERIFY') || backendMsg.includes('CONFIRM EMAIL')) {
        return ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
      }

      return error.response.data.message;
    }

    // Network / timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (error.response?.status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }

    return ERROR_MESSAGES.DEFAULT;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      setApiError('');

      try {
        const payload = {
          emailId: formData.emailId.trim(),
          password: formData.password,
          // rememberMe usually handled on backend or via longer token lifetime
        };

        const response = await api.post('/auth/login', payload, {
          // Optional: can add custom timeout if needed
          timeout: 10000,
        });

        const { accessToken, refreshToken, userId, userName, emailId, roleName } =
          response.data;

        // Normalize roles (array or single value)
        const roles = Array.isArray(roleName)
          ? roleName
          : [roleName].filter(Boolean);

        const eBillingData = {
          accessToken,
          refreshToken,
          user: {
            id: userId,
            name: userName,
            email: emailId,
            roles,
          },
          // Optional: timestamp for token expiration check
          loginTimestamp: Date.now(),
        };

        localStorage.setItem('eBilling', JSON.stringify(eBillingData));

        toast.success('Welcome back!', {
          position: 'top-center',
          autoClose: 2000,
        });

        // Role-based navigation
        if (roles.includes('SUPER_ADMIN')) {
          navigate('/super-admin', { replace: true });
        } else if (roles.includes('ADMIN')) {
          try {
            // Check active subscription
            // const { data: planData } = await api.get(`/user/${userId}/subscription/isActive`);

            // if (!planData?.active) {
            //   toast.warning("You don't have an active subscription plan");
            //   navigate('/subscription-plans', { replace: true });
            //   return;
            // }

            // Get companies
            const { data: companies } = await api.get(`/owner/${userId}/companies`);
            const companyList = Array.isArray(companies) ? companies : [];

            if (companyList.length === 0) {
              navigate('/create-company', { replace: true });
            } else {
              const stored = JSON.parse(localStorage.getItem('eBilling') || '{}');
              const selectedId = stored?.selectedCompany?.id;

              const hasValidSelection = companyList.some((c) => c.companyId === selectedId);

              navigate(hasValidSelection ? '/' : '/company-list', { replace: true });
            }
          } catch (innerErr) {
            console.error('Post-login check failed:', innerErr);
            toast.error('Could not load your account details. Please login again.');
            navigate('/company-list', { replace: true });
          }
        } else {
          toast.warning('Your account role is not authorized for this platform.');
          localStorage.removeItem('eBilling'); // Important!
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Login failed:', error);

        const friendlyMessage = getFriendlyErrorMessage(error);
        setApiError(friendlyMessage);
        toast.error(friendlyMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, navigate]
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>Sign in</h1>

            {apiError && (
              <div className={styles.globalError} role="alert">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <Input
                label="Email"
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="name@company.com"
                error={errors.emailId}
                icon={Mail}
                autoComplete="email"
                disabled={isSubmitting}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                error={errors.password}
                showPasswordToggle
                onTogglePassword={togglePasswordVisibility}
                icon={Lock}
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />

              <div className={styles.formOptions}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                    Remember me
                  </label>
                </div>

                <Link to="/forgot-password" className={styles.forgotLink} tabIndex={0}>
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth
              >
                Sign In
              </Button>
            </form>

            <div className={styles.signupText}>
              Don't have an account?{' '}
              <Link to="/register" className={styles.signupLink}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;