import { classNames } from '../../utils';

export function Badge({ children, variant = 'default', className, ...props }) {
  const variantClasses = {
    default: '',
    irrigate: 'badge-irrigate',
    wait: 'badge-wait',
    partial: 'badge-partial',
    insufficient: 'badge-insufficient',
    'confidence-high': 'badge-confidence-high',
    'confidence-medium': 'badge-confidence-medium',
    'confidence-low': 'badge-confidence-low',
  };

  return (
    <span className={classNames('badge', variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;