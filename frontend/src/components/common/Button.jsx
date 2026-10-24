import { classNames } from '../../utils';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className,
  'aria-label': ariaLabel,
  ...props
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  const widthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      type={type}
      className={classNames(baseClasses, variantClasses[variant], sizeClasses[size], widthClass, className)}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="loading-spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}

export default Button;