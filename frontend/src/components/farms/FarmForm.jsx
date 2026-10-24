import { useState } from 'react';
import { Input, Select, Textarea, Button, Alert } from '../common';
import { SOIL_TYPES, IRRIGATION_METHODS, WATER_SOURCES, CROPS, validateRequired, validateNumberRange } from '../../utils';
import { classNames } from '../../utils';

const FARM_FIELDS = [
  { name: 'name', label: 'Farm Name', type: 'text', required: true, placeholder: 'e.g., East Field' },
  { name: 'areaHectares', label: 'Area (hectares)', type: 'number', required: true, placeholder: 'e.g., 2.5', min: 0.001, max: 1000, step: 0.1 },
  { name: 'soilType', label: 'Soil Type', type: 'select', required: true, options: SOIL_TYPES },
  { name: 'irrigationMethod', label: 'Irrigation Method', type: 'select', required: true, options: IRRIGATION_METHODS },
  { name: 'waterSource', label: 'Water Source', type: 'select', required: true, options: WATER_SOURCES },
];

const CROP_FIELDS = [
  { name: 'crop', label: 'Crop', type: 'select', required: true, options: CROPS },
  { name: 'variety', label: 'Variety (optional)', type: 'text', required: false, placeholder: 'e.g., Swarna, PBW 343' },
  { name: 'plantingDate', label: 'Planting Date', type: 'date', required: true },
  { name: 'expectedHarvestDate', label: 'Expected Harvest Date (optional)', type: 'date', required: false },
];

const TODAY_DATE = new Date();
TODAY_DATE.setHours(0, 0, 0, 0);

export function FarmForm({ initialData = {}, onSubmit, submitting = false }) {
  const [formData, setFormData] = useState({
    name: '',
    areaHectares: '',
    soilType: '',
    irrigationMethod: '',
    waterSource: '',
    latitude: '',
    longitude: '',
    crop: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [generalError, setGeneralError] = useState(null);

  const validateField = (name, value) => {
    const field = [...FARM_FIELDS, ...CROP_FIELDS].find((f) => f.name === name);
    if (!field) return null;

    if (field.required) {
      const requiredError = validateRequired(value);
      if (requiredError) return requiredError;
    }

    if (field.type === 'number' && value !== '') {
      const numError = validateNumberRange(value, field.min, field.max);
      if (numError) return numError;
    }

    if (name === 'plantingDate' && value) {
      const selected = new Date(value);
      if (selected > TODAY_DATE) return 'Planting date cannot be in the future';
    }

    if (name === 'expectedHarvestDate' && value && formData.plantingDate) {
      const harvest = new Date(value);
      const planting = new Date(formData.plantingDate);
      if (harvest <= planting) return 'Harvest date must be after planting date';
    }

    return null;
  };

  const validateStep = (stepNum) => {
    const fields = stepNum === 1 ? FARM_FIELDS : CROP_FIELDS;
    const newErrors = {};
    let hasErrors = false;

    fields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
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

    const isValid = validateStep(1) && validateStep(2);
    if (!isValid) return;

    try {
      const submitData = {
        name: formData.name,
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.longitude),
            parseFloat(formData.latitude),
          ],
        },
        areaHectares: parseFloat(formData.areaHectares),
        soilType: formData.soilType,
        irrigationMethod: formData.irrigationMethod,
        waterSource: formData.waterSource,
        cropCycle: formData.crop ? {
          crop: formData.crop,
          variety: formData.variety || undefined,
          plantingDate: formData.plantingDate,
          expectedHarvestDate: formData.expectedHarvestDate || undefined,
        } : undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      setGeneralError(error.message || 'Failed to create farm. Please try again.');
    }
  };

  const handleNext = () => {
    if (validateStep(1)) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const currentFields = step === 1 ? FARM_FIELDS : CROP_FIELDS;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {generalError && (
        <Alert variant="error" title="Error">
          {generalError}
        </Alert>
      )}

      <div className="flex items-center gap-4 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2} aria-label="Form progress">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={classNames(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                s < step ? 'bg-primary text-white' : s === step ? 'bg-primary text-white' : 'bg-pale-aqua text-muted'
              )}
            >
              {s}
            </div>
            {s < 2 && (
              <div className={classNames('h-1 flex-1 max-w-xs transition-colors', s < step ? 'bg-primary' : 'bg-pale-aqua')} />
            )}
            <span className={classNames('text-sm font-medium hidden sm:block', s <= step ? 'text-primary' : 'text-muted')}>
              {s === 1 ? 'Farm Details' : 'Crop Cycle'}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {currentFields.map((field) => (
          <div key={field.name}>
            {field.type === 'select' ? (
              <Select
                label={field.label}
                error={touched[field.name] ? errors[field.name] : undefined}
                required={field.required}
                options={field.options}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                disabled={submitting}
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                label={field.label}
                error={touched[field.name] ? errors[field.name] : undefined}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                disabled={submitting}
              />
            ) : (
              <Input
                label={field.label}
                type={field.type}
                error={touched[field.name] ? errors[field.name] : undefined}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                min={field.min}
                max={field.max}
                step={field.step}
                disabled={submitting}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-border-light">
        {step === 1 && (
          <Button type="button" variant="ghost" onClick={handleBack} disabled={submitting}>
            Cancel
          </Button>
        )}
        {step === 2 && (
          <Button type="button" variant="ghost" onClick={handleBack} disabled={submitting}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step === 1 ? (
          <Button type="button" variant="primary" onClick={handleNext} disabled={submitting}>
            Next
          </Button>
        ) : (
          <Button type="submit" variant="primary" loading={submitting}>
            {initialData.farmId ? 'Update Farm' : 'Create Farm'}
          </Button>
        )}
      </div>
    </form>
  );
}

export default FarmForm;