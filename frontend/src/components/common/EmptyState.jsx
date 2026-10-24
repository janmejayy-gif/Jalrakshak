import { classNames } from '../../utils';
import { Button } from './Button';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div className={classNames('empty-state', className)} {...props}>
      {icon && (
        <div className="empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-text">{description}</p>}
      {action && (
        <Button variant={action.variant || 'primary'} onClick={action.onClick} size={action.size}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;