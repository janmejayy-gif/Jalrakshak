import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Alert } from '../components/common';
import { authService } from '../services';
import { validateEmail, validatePhone } from '../utils';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    if (name === 'identifier') {
      if (!value.trim()) return 'Email or phone is required';
      if (!validateEmail(value) && !validatePhone(value)) return 'Enter a valid email or phone number';
    }
    if (name === 'password') {
      if (!value) return 'Password is required';
    }
    return null;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
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

    ['identifier', 'password'].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.login(formData.identifier, formData.password);
      authService.setTokens(response.accessToken, response.refreshToken);
      authService.setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      if (error.status === 401) {
        setGeneralError('Invalid email/phone or password');
      } else if (error.status === 429) {
        setGeneralError('Too many attempts. Please try again later.');
      } else {
        setGeneralError(error.message || 'Login failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-secondary">Sign in to access your irrigation dashboard</p>
        </CardHeader>

        <CardBody className="space-y-4">
          {generalError && (
            <Alert variant="error">{generalError}</Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email or Phone"
              type="text"
              autoComplete="username"
              error={touched.identifier ? errors.identifier : undefined}
              value={formData.identifier}
              onChange={(e) => handleChange('identifier', e.target.value)}
              onBlur={() => handleBlur('identifier')}
              placeholder="farmer@example.com or +91-9876543210"
              disabled={submitting}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                error={touched.password ? errors.password : undefined}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  disabled={submitting}
                />
                <span className="text-sm text-secondary">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={submitting} className="mt-2">
              Sign In
            </Button>
          </form>
        </CardBody>

        <CardFooter className="flex flex-col items-center gap-3 border-t border-border-light pt-6">
          <p className="text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;