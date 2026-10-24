import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmForm } from '../components/farms';
import { farmService } from '../services';
import { Card, CardHeader, CardBody, Alert } from '../components/common';

export function FarmSetupPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setGeneralError(null);
    try {
      await farmService.create(data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error.status === 400 && error.data?.errors) {
        // Field errors are handled by the form component
        throw error;
      } else if (error.status === 401) {
        setGeneralError('Your session has expired. Please log in again.');
      } else if (error.status === 429) {
        setGeneralError('Too many requests. Please try again later.');
      } else {
        setGeneralError(error.message || 'Failed to create farm. Please try again.');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="page-content max-w-3xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title">Add New Farm</h1>
        <p className="page-subtitle">
          Enter your farm details and crop information to start receiving irrigation recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-primary">Farm Setup Wizard</h2>
          <p className="text-sm text-muted mt-1">
            This is a 2-step process: first your farm details, then your crop cycle.
          </p>
        </CardHeader>
        <CardBody className="pt-0">
          {generalError && (
            <Alert variant="error" className="mb-6" onDismiss={() => setGeneralError(null)}>
              {generalError}
            </Alert>
          )}
          <FarmForm onSubmit={handleSubmit} onCancel={handleCancel} submitting={submitting} />
        </CardBody>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          Need help?{' '}
          <a href="/help" className="text-primary hover:underline">View the guide</a>
          {' '}or{' '}
          <a href="/contact" className="text-primary hover:underline">contact support</a>.
        </p>
      </div>
    </div>
  );
}

export default FarmSetupPage;