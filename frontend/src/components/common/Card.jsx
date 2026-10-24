import { classNames } from '../../utils';

export function Card({ children, className, variant = 'default', ...props }) {
  const variantClasses = {
    default: '',
    elevated: 'shadow-md',
    outlined: 'border',
  };

  return (
    <div
      className={classNames('card', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={classNames('card-header', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={classNames('card-body', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={classNames('card-footer', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;