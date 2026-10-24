import { useState } from 'react';
import { CardHeader, CardBody, CardFooter, Button, Input, Select, Textarea, Alert } from '../common';
import { ACTION_TAKEN_OPTIONS, validateRequired } from '../../utils';

const DEFAULT_TIMESTAMP = new Date().toISOString().slice(0, 16);

export function ActionFeedbackForm({ recommendation, onSubmit, onCancel, submitting = false }) {
  const [formData, setFormData] = useState(() => ({
    actionTaken: '',
    actionTimestamp: DEFAULT_TIMESTAMP,
    waterAppliedMm: '',
    durationMinutes: '',
    notes: '',
    feedback: '',
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const validateField = (name, value) => {
    if (name === 'actionTaken') {
      return validateRequired(value);
    }
    if (name === 'waterAppliedMm' && value !== '' && (formData.actionTaken === 'IRRIGATED' || formData.actionTaken === 'PARTIAL_IRRIGATED')) {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) return 'Must be a valid positive number';
    }
    if (name === 'durationMinutes' && value !== '') {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) return 'Must be a valid positive number';
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

    Object.keys(formData).forEach((key) => {
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

    try {
      await onSubmit({
        ...formData,
        waterAppliedMm: formData.waterAppliedMm ? parseFloat(formData.waterAppliedMm) : undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes, 10) : undefined,
      });
    } catch (error) {
      setGeneralError(error.message || 'Failed to record action. Please try again.');
    }
  };

  const showWaterFields = formData.actionTaken === 'IRRIGATED' || formData.actionTaken === 'PARTIAL_IRRIGATED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} noValidate>
          <CardHeader className="p-6 border-b border-border-light">
            <h2 id="feedback-title" className="text-xl font-semibold text-primary">Record Action Taken</h2>
            <p className="text-sm text-muted mt-1">
              Recommendation: <span className="font-medium capitalize">{recommendation?.action?.toLowerCase().replace('_', ' ')}</span>
            </p>
          </CardHeader>

          <CardBody className="p-6 space-y-4">
            {generalError && (
              <Alert variant="error">{generalError}</Alert>
            )}

            <Select
              label="Action Taken"
              error={touched.actionTaken ? errors.actionTaken : undefined}
              required
              options={ACTION_TAKEN_OPTIONS}
              value={formData.actionTaken}
              onChange={(e) => handleChange('actionTaken', e.target.value)}
              onBlur={() => handleBlur('actionTaken')}
              disabled={submitting}
            />

            <Input
              label="Action Timestamp"
              type="datetime-local"
              error={touched.actionTimestamp ? errors.actionTimestamp : undefined}
              required
              value={formData.actionTimestamp}
              onChange={(e) => handleChange('actionTimestamp', e.target.value)}
              onBlur={() => handleBlur('actionTimestamp')}
              disabled={submitting}
            />

            {showWaterFields && (
              <>
                <Input
                  label="Water Applied (mm)"
                  type="number"
                  error={touched.waterAppliedMm ? errors.waterAppliedMm : undefined}
                  required
                  placeholder="e.g., 25"
                  value={formData.waterAppliedMm}
                  onChange={(e) => handleChange('waterAppliedMm', e.target.value)}
                  onBlur={() => handleBlur('waterAppliedMm')}
                  min={0}
                  step={0.1}
                  disabled={submitting}
                />
                <Input
                  label="Duration (minutes, optional)"
                  type="number"
                  error={touched.durationMinutes ? errors.durationMinutes : undefined}
                  placeholder="e.g., 120"
                  value={formData.durationMinutes}
                  onChange={(e) => handleChange('durationMinutes', e.target.value)}
                  onBlur={() => handleBlur('durationMinutes')}
                  min={0}
                  step={1}
                  disabled={submitting}
                />
              </>
            )}

            <Textarea
              label="Notes (optional)"
              placeholder="Any observations about the irrigation..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              rows={3}
              disabled={submitting}
            />

            <Textarea
              label="Feedback (optional)"
              placeholder="How accurate was the recommendation? Any suggestions?"
              value={formData.feedback}
              onChange={(e) => handleChange('feedback', e.target.value)}
              onBlur={() => handleBlur('feedback')}
              rows={3}
              disabled={submitting}
            />
          </CardBody>

          <CardFooter>
            <div className="flex w-full justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Submit Action
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </div>
  );
}

export default ActionFeedbackForm;