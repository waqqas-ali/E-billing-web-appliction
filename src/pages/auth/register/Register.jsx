import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react'; // Removed Eye/EyeOff—handled by Input
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../../config/apiconfig';
import styles from './register.module.css';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    emailId: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Validation logic
  const validate = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required.';
    }

    if (!formData.emailId) {
      newErrors.emailId = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Invalid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
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
        `${config.BASE_URL}/auth/register/admin`,
        formData
      );

      toast.success('Registration successful!');
      console.log('Response:', response.data);

      // Redirect to login after registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.backToHome}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          Back to login
        </Link>
      </div>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>Create your account</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Your Username"
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter Username"
                error={errors.userName}
                icon={User}
                disabled={loading}
              />

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
                type="password"
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
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={loading}
                loading={loading}
              >
                Create account
              </Button>
            </form>

            <div className={styles.signupText}>
              Already have an account?{' '}
              <Link to="/login" className={styles.signupLink}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;



// -----------------------------------

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Added Eye/EyeOff for password visibility
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import config from '../../../config/apiconfig';
// import styles from './register.module.css';

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     userName: '',
//     emailId: '',
//     password: '',
//     rememberMe: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

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

//     if (!formData.userName.trim()) {
//       newErrors.userName = 'Name is required.';
//     }

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
//         `${config.BASE_URL}/auth/register/admin`,
//         formData
//       );

//       toast.success('Registration successful!');
//       console.log('Response:', response.data);

//       // Redirect to login after registration
//       navigate('/login');
//     } catch (error) {
//       console.error('Registration error:', error.response ? error.response.data : error.message);
//       toast.error('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.backToHome}>
//         <Link to="/login" className={styles.backLink}>
//           <ArrowLeft className={styles.backIcon} />
//           Back to login
//         </Link>
//       </div>

//       <div className={styles.container}>
//         <div className={styles.formContainer}>
//           <div className={styles.formCard}>
//             <h1 className={styles.title}>Create your account</h1>

//             <form onSubmit={handleSubmit} className={styles.form}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Your Username</label>
//                 <div className={styles.inputWrapper}>
//                   <User className={styles.inputIcon} />
//                   <input
//                     type="text"
//                     name="userName"
//                     value={formData.userName}
//                     onChange={handleInputChange}
//                     className={`${styles.input} ${errors.userName ? styles.inputError : ''}`}
//                     placeholder="Enter username"
//                     required
//                     disabled={loading}
//                   />
//                   {errors.userName && <span className={styles.error}>{errors.userName}</span>}
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Your Email</label>
//                 <div className={styles.inputWrapper}>
//                   <Mail className={styles.inputIcon} />
//                   <input
//                     type="email"
//                     name="emailId"
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
//                     name="password"
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
//                     checked={formData.rememberMe}
//                     onChange={handleInputChange}
//                     className={styles.checkbox}
//                     disabled={loading}
//                   />
//                   <label htmlFor="rememberMe" className={styles.checkboxLabel}>
//                     Remember me
//                   </label>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Creating account...' : 'Create account'}
//               </button>
//             </form>

//             <div className={styles.signupText}>
//               Already have an account?{' '}
//               <Link to="/login" className={styles.signupLink}>
//                 Sign in
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Register;