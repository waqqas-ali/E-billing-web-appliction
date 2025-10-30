import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  icon: Icon, // Pass Lucide icon components (e.g., <Mail />)
  showPasswordToggle = false,
  onTogglePassword,
  className,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
    if (onTogglePassword) onTogglePassword();
  };

  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
        {Icon && <Icon className={styles.inputIcon} />}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value || ''} // Default to empty string to avoid uncontrolled input warnings
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${className || ''}`}
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className={styles.passwordToggle}
            disabled={disabled}
          >
            {showPassword ? <EyeOff className={styles.toggleIcon} /> : <Eye className={styles.toggleIcon} />}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;