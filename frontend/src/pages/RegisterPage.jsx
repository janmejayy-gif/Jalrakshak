import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Alert } from '../components/common';
import { authService } from '../services';
import { validateRequired, validateEmail, validatePhone, validatePassword, classNames } from '../utils';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return validateRequired(value);
      case 'email':
        if (value && !validateEmail(value)) return 'Enter a valid email address';
        if (!formData.phone && !value) return 'Email or phone is required';
        return null;
      case 'phone':
        if (value && !validatePhone(value)) return 'Enter a valid phone number';
        if (!formData.email && !value) return 'Email or phone is required';
        return null;
      case 'password':
        const pwdValidation = validatePassword(value);
        if (!pwdValidation.valid) return pwdValidation.errors[0];
        return null;
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
    // Cross-field validation for email/phone
    if (name === 'email' || name === 'phone') {
      const otherField = name === 'email' ? 'phone' : 'email';
      if (touched[otherField]) {
        const error = validateField(otherField, formData[otherField]);
        setErrors((prev) => ({ ...prev, [otherField]: error }));
      }
    }
    if (name === 'password') {
      if (touched.confirmPassword) {
        const error = validateField('confirmPassword', formData.confirmPassword);
        setErrors((prev) => ({ ...prev, confirmPassword: error }));
      }
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    const newErrors = {};
    let hasErrors = false;

    ['fullName', 'email', 'phone', 'password', 'confirmPassword'].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    // Ensure at least one of email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Email or phone is required';
      newErrors.phone = 'Email or phone is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage,
      });
      authService.setTokens(response.accessToken, response.refreshToken);
      authService.setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      if (error.status === 400 && error.data?.errors) {
        const fieldErrors = {};
        error.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error.status === 409) {
        setGeneralError('An account with this email or phone already exists');
      } else if (error.status === 429) {
        setGeneralError('Too many attempts. Please try again later.');
      } else {
        setGeneralError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M8 20L16 12L24 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <path d="M16 12V20" stroke="white" stroke-width="2.5" stroke-linecap="round" />
            </svg>
            <span className="font-bold text-2xl text-primary">JALRAKSHAK</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Create Your Account</h1>
          <p className="text-secondary">Join thousands of farmers making smarter irrigation decisions</p>
        </CardHeader>

        <CardBody className="space-y-4">
          {generalError && (
            <Alert variant="error">{generalError}</Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              type="text"
              autoComplete="name"
              error={touched.fullName ? errors.fullName : undefined}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="Ramesh Patil"
              disabled={submitting}
            />

            <Input
              label="Email (optional if phone provided)"
              type="email"
              autoComplete="email"
              error={touched.email ? errors.email : undefined}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="farmer@example.com"
              disabled={submitting}
            />

            <Input
              label="Phone (optional if email provided)"
              type="tel"
              autoComplete="tel"
              error={touched.phone ? errors.phone : undefined}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+91-9876543210"
              disabled={submitting}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={touched.password ? errors.password : undefined}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Create a strong password"
                disabled={submitting}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-secondary hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirm your password"
              disabled={submitting}
            />

            <div className="space-y-3 text-sm">
              <p className="text-secondary">Password requirements:</p>
              <ul className="space-y-1 pl-4" role="list">
                <li className={classNames('flex items-center gap-2', formData.password.length >= 8 ? 'text-success' : 'text-secondary')}>
                  <span className={classNames('w-4 h-4 rounded-full border flex items-center justify-center text-[10px]', formData.password.length >= 8 ? 'bg-success border-success text-white' : 'border-border text-transparent')}>
                    {formData.password.length >= 8 && '✓'}
                  </span>
                  At least 8 characters
                </li>
                <li className={classNames('flex items-center gap-2', /[A-Z]/.test(formData.password) ? 'text-success' : 'text-secondary')}>
                  <span className={classNames('w-4 h-4 rounded-full border flex items-center justify-center text-[10px]', /[A-Z]/.test(formData.password) ? 'bg-success border-success text-white' : 'border-border text-transparent')}>
                    {/[A-Z]/.test(formData.password) && '✓'}
                  </span>
                  One uppercase letter
                </li>
                <li className={classNames('flex items-center gap-2', /[a-z]/.test(formData.password) ? 'text-success' : 'text-secondary')}>
                  <span className={classNames('w-4 h-4 rounded-full border flex items-center justify-center text-[10px]', /[a-z]/.test(formData.password) ? 'bg-success border-success text-white' : 'border-border text-transparent')}>
                    {/[a-z]/.test(formData.password) && '✓'}
                  </span>
                  One lowercase letter
                </li>
                <li className={classNames('flex items-center gap-2', /[0-9]/.test(formData.password) ? 'text-success' : 'text-secondary')}>
                  <span className={classNames('w-4 h-4 rounded-full border flex items-center justify-center text-[10px]', /[0-9]/.test(formData.password) ? 'bg-success border-success text-white' : 'border-border text-transparent')}>
                    {/[0-9]/.test(formData.password) && '✓'}
                  </span>
                  One number
                </li>
                <li className={classNames('flex items-center gap-2', /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-success' : 'text-secondary')}>
                  <span className={classNames('w-4 h-4 rounded-full border flex items-center justify-center text-[10px]', /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-success border-success text-white' : 'border-border text-transparent')}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && '✓'}
                  </span>
                  One special character
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-secondary">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={submitting} className="mt-2">
              Create Account
            </Button>
          </form>
        </CardBody>

        <CardFooter className="flex flex-col items-center gap-3 border-t border-border-light pt-6">
          <p className="text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;