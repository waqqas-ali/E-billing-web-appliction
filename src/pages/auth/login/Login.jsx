import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import config from "../../../config/apiconfig";
import { toast } from "react-toastify";
import styles from "./login.module.css";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Validation logic
  const validate = () => {
    const newErrors = {};

    if (!formData.emailId) {
      newErrors.emailId = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Invalid email format.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${config.BASE_URL}/auth/login`,
        formData
      );

      toast.success("Login successful!");
      console.log("Login Response:", response.data);

      // Build eBilling object from flat API fields
      const eBillingData = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: {
          id: response.data.userId,
          name: response.data.userName,
          email: response.data.emailId,
          roles: response.data.roleName, // Array of roles
        },
      };

      // Save everything under one key
      localStorage.setItem("eBilling", JSON.stringify(eBillingData));
      console.log("eBilling object saved:", eBillingData);

      // 👉 Role-based redirect
      const roles = response.data.roleName; // Array ["ADMIN"] or ["SUPER_ADMIN"]

      if (roles.includes("SUPER_ADMIN")) {
        navigate("/super-admin");
      } else if (roles.includes("ADMIN")) {
        // Check subscription before redirecting admins
        const userId = response.data.userId;
        const accessToken = response.data.accessToken;

        try {
          const planRes = await axios.get(
            `${config.BASE_URL}/user/${userId}/subscription/isActive`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("Plan response:", planRes.data);

          if (planRes.data && planRes.data.active) {
            toast.success("User has an active plan ✅");

            // Fetch companies to check if any exist and handle redirection
            const companiesRes = await axios.get(
              `${config.BASE_URL}/owner/${userId}/companies`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            const companies = companiesRes.data;

            if (companies.length === 0) {
              // No companies, redirect to create company
              navigate("/create-company");
            } else {
              // Check for previously selected company
              const eBilling = JSON.parse(localStorage.getItem("eBilling"));
              const selectedId = eBilling?.selectedCompany?.id;
              const hasSelected = companies.some(
                (c) => c.companyId === selectedId
              );

              if (hasSelected) {
                // Redirect to dashboard with selected company
                navigate("/");
              } else {
                // Redirect to company list to choose one
                navigate("/company-list");
              }
            }
          } else {
            toast.warning("User does not have an active plan ⚠");
            navigate("/subscription-plans");
          }
        } catch (planError) {
          console.error("Error fetching plan or companies:", planError);
          toast.error("Failed to fetch user plan or companies.");
          navigate("/subscription-plans");
        }
      } else {
        // Unknown role fallback
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>Sign in to our platform</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Your Email"
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="example@company.com"
                error={errors.emailId}
                icon={Mail}
                disabled={loading}
              />

              <Input
                label="Your Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                error={errors.password}
                showPasswordToggle
                onTogglePassword={togglePassword}
                icon={Lock}
                disabled={loading}
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
                    disabled={loading}
                  />
                  <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={loading}
                loading={loading}
              >
                Sign in
              </Button>
            </form>

            <div className={styles.signupText}>
              Not registered?{" "}
              <Link to="/register" className={styles.signupLink}>
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;

// -----------------------------------------

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft, Mail, Lock } from 'lucide-react'; // Removed Eye/EyeOff—handled by Input
// import axios from 'axios';
// import config from '../../../config/apiconfig';
// import { toast } from 'react-toastify';
// import styles from './login.module.css';
// import Input from '../../../components/ui/Input/Input';
// import Button from '../../../components/ui/Button/Button';

// const Login = () => {
//   const [formData, setFormData] = useState({ emailId: '', password: '', rememberMe: false });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Toggle password visibility
//   const togglePassword = () => setShowPassword((prev) => !prev);

//   // Validation logic
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.emailId) {
//       newErrors.emailId = 'Email is required.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
//       newErrors.emailId = 'Invalid email format.';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required.';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters.';
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
//         formData // Sending emailId and password
//       );

//       toast.success('Login successful!');
//       console.log('Response:', response.data);

//       // Save tokens and user info
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
//       localStorage.setItem(
//         'user',
//         JSON.stringify({
//           id: response.data.userId,
//           name: response.data.userName,
//           email: response.data.emailId,
//           roles: response.data.roleName,
//         })
//       );

//       // Redirect to home
//       navigate('/');
//     } catch (error) {
//       console.error(
//         'Login error:',
//         error.response ? error.response.data : error.message
//       );
//       toast.error('Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className={styles.main}>
//       {/* Uncomment if you want the back link */}
//       {/* <div className={styles.backToHome}>
//         <Link to="/" className={styles.backLink}>
//           <ArrowLeft className={styles.backIcon} />
//           Back to homepage
//         </Link>
//       </div> */}

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
//                 type="password"
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
//               Not registered?{' '}
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

// ---------------------------------------------

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';
// import config from '../../../config/apiconfig';
// import { toast } from 'react-toastify';
// import styles from './login.module.css';

// const Login = () => {
//   const [formData, setFormData] = useState({ emailId: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Toggle password visibility
//   const togglePassword = () => setShowPassword((prev) => !prev);

//   // Validation logic
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.emailId) {
//       newErrors.emailId = 'Email is required.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
//       newErrors.emailId = 'Invalid email format.';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required.';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters.';
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
//         formData // Sending emailId and password
//       );

//       toast.success('Login successful!');
//       console.log('Response:', response.data);

//       // Save tokens and user info
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
//       localStorage.setItem(
//         'user',
//         JSON.stringify({
//           id: response.data.userId,
//           name: response.data.userName,
//           email: response.data.emailId,
//           roles: response.data.roleName,
//         })
//       );

//       // Redirect to home
//       navigate('/');
//     } catch (error) {
//       console.error(
//         'Login error:',
//         error.response ? error.response.data : error.message
//       );
//       toast.error('Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className={styles.main}>
//       {/* <div className={styles.backToHome}>
//         <Link to="/" className={styles.backLink}>
//           <ArrowLeft className={styles.backIcon} />
//           Back to homepage
//         </Link>
//       </div> */}

//       <div className={styles.container}>
//         <div className={styles.formContainer}>
//           <div className={styles.formCard}>
//             <h1 className={styles.title}>Sign in to our platform</h1>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Your Email</label>
//                 <div className={styles.inputWrapper}>
//                   <Mail className={styles.inputIcon} />

//                   <input
//                     type="email"
//                     name="emailId" // Updated to match state
//                     value={formData.emailId}
//                     onChange={handleInputChange}
//                     className={`${styles.input} ${errors.emailId ? styles.inputError : ''}`}
//                     placeholder="example@company.com"
//                     required
//                     disabled={loading}
//                   />
//                   {errors.emailId && <span className={styles.error}>{errors.emailId}</span>}
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Your Password</label>
//                 <div className={styles.inputWrapper}>
//                   <Lock className={styles.inputIcon} />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password" // Updated to match state
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
//                     placeholder="Password"
//                     required
//                     disabled={loading}
//                   />

//                   <button
//                     type="button"
//                     onClick={togglePassword}
//                     className={styles.passwordToggle}
//                   >
//                     {showPassword ? <EyeOff className={styles.toggleIcon} /> : <Eye className={styles.toggleIcon} />}
//                   </button>
//                   {errors.password && <span className={styles.error}>{errors.password}</span>}
//                 </div>
//               </div>

//               <div className={styles.formOptions}>
//                 <div className={styles.checkboxWrapper}>
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe || false} // Default to false if undefined
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

//               <button
//                 type="submit"
//                 className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//             </form>

//             <div className={styles.signupText}>
//               Not registered?{' '}
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
