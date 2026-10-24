import { useId } from 'react';
import { classNames } from '../../utils';

export function Input({
  label,
  error,
  hint,
  id,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  className,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span aria-hidden="true" className="text-error"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={classNames('form-input', error && 'error', className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={required}
        {...props}
      />
      {error && (
        <p id={errorId} className="form-error" role="alert" aria-live="polite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="form-hint">{hint}</p>
      )}
    </div>
  );
}

export default Input;