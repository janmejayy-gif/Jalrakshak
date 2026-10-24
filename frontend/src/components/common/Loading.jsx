export function LoadingSpinner({ size = 'md', className, 'aria-label': ariaLabel = 'Loading' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-5 h-5 border-[2px]',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-[4px]',
  };

  return (
    <span
      className={classNames('loading-spinner', sizeClasses[size], className)}
      role="status"
      aria-label={ariaLabel}
      aria-hidden="false"
    >
      <span className="visually-hidden">{ariaLabel}</span>
    </span>
  );
}

export function LoadingOverlay({ isVisible, message = 'Loading...' }) {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label={message}>
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="xl" />
        <p className="text-secondary">{message}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ className }) {
  return (
    <div className={classNames('card animate-pulse', className)}>
      <div className="card-body space-y-4">
        <div className="h-4 bg-earth-light rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-earth-light rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-earth-light rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default LoadingSpinner;