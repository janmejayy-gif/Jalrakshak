export function formatDate(dateString, options = {}) {
  if (!dateString) return '-';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  try {
    return new Date(dateString).toLocaleDateString('en-IN', defaultOptions);
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString) {
  return formatDate(dateString, { hour: undefined, minute: undefined });
}

export function formatTime(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-IN', options).format(value);
}

export function formatWaterQuantity(mm, areaHectares) {
  if (mm === null || mm === undefined) return null;
  const litres = mm * (areaHectares || 1) * 10000;
  return {
    mm: formatNumber(mm, { maximumFractionDigits: 1 }),
    litres: formatNumber(litres, { maximumFractionDigits: 0 }),
  };
}

export function getRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(dateString);
}

export function getStatusConfig(action) {
  const configs = {
    IRRIGATE: {
      label: 'Irrigate Now',
      labelHi: 'अभी सिंचाई करें',
      color: 'var(--color-status-irrigate)',
      bgColor: 'var(--color-status-irrigate-bg)',
      badgeClass: 'badge-irrigate',
      icon: 'irrigate',
    },
    WAIT: {
      label: 'Wait',
      labelHi: 'प्रतीक्षा करें',
      color: 'var(--color-status-wait)',
      bgColor: 'var(--color-status-wait-bg)',
      badgeClass: 'badge-wait',
      icon: 'wait',
    },
    PARTIAL_IRRIGATION: {
      label: 'Partial Irrigation',
      labelHi: 'आंशिक सिंचाई',
      color: 'var(--color-status-partial)',
      bgColor: 'var(--color-status-partial-bg)',
      badgeClass: 'badge-partial',
      icon: 'partial',
    },
    INSUFFICIENT_DATA: {
      label: 'Data Insufficient',
      labelHi: 'डेटा अपर्याप्त',
      color: 'var(--color-status-insufficient)',
      bgColor: 'var(--color-status-insufficient-bg)',
      badgeClass: 'badge-insufficient',
      icon: 'insufficient',
    },
  };
  return configs[action] || configs.INSUFFICIENT_DATA;
}

export function getConfidenceConfig(confidence) {
  const configs = {
    HIGH: { label: 'High', class: 'badge-confidence-high' },
    MEDIUM: { label: 'Medium', class: 'badge-confidence-medium' },
    LOW: { label: 'Low', class: 'badge-confidence-low' },
  };
  return configs[confidence] || configs.LOW;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
}

export function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return { valid: errors.length === 0, errors };
}

export function validateRequired(value) {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'This field is required';
  }
  return null;
}

export function validateNumberRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num < min) return `Must be at least ${min}`;
  if (num > max) return `Must be at most ${max}`;
  return null;
}

export function generateId() {
  return crypto.randomUUID();
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}

export const SOIL_TYPES = [
  { value: 'LOAM', label: 'Loam' },
  { value: 'CLAY', label: 'Clay' },
  { value: 'SANDY_LOAM', label: 'Sandy Loam' },
  { value: 'SILT', label: 'Silt' },
  { value: 'CLAY_LOAM', label: 'Clay Loam' },
  { value: 'BLACK_COTTON', label: 'Black Cotton' },
  { value: 'RED_LATERITIC', label: 'Red Lateritic' },
  { value: 'ALLUVIAL', label: 'Alluvial' },
  { value: 'OTHER', label: 'Other' },
];

export const IRRIGATION_METHODS = [
  { value: 'FLOOD', label: 'Flood' },
  { value: 'SPRINKLER', label: 'Sprinkler' },
  { value: 'DRIP', label: 'Drip' },
  { value: 'RAINFED', label: 'Rainfed' },
  { value: 'OTHER', label: 'Other' },
];

export const WATER_SOURCES = [
  { value: 'CANAL', label: 'Canal' },
  { value: 'BOREWELL', label: 'Borewell' },
  { value: 'TANK', label: 'Tank' },
  { value: 'RIVER', label: 'River' },
  { value: 'MUNICIPAL', label: 'Municipal' },
  { value: 'MIXED', label: 'Mixed' },
];

export const CROPS = [
  { value: 'RICE', label: 'Rice (धान)' },
  { value: 'WHEAT', label: 'Wheat (गेहूं)' },
  { value: 'COTTON', label: 'Cotton (कपास)' },
  { value: 'MAIZE', label: 'Maize (मक्का)' },
  { value: 'SUGARCANE', label: 'Sugarcane (गन्ना)' },
  { value: 'SOYBEAN', label: 'Soybean (सोयाबीन)' },
  { value: 'PIGEON_PEA', label: 'Pigeon Pea (अरहर)' },
  { value: 'CHICKPEA', label: 'Chickpea (चना)' },
  { value: 'OTHER', label: 'Other' },
];

export const GROWTH_STAGES = [
  { value: 'SEEDLING', label: 'Seedling' },
  { value: 'TILLERING', label: 'Tillering' },
  { value: 'PANICLE_INITIATION', label: 'Panicle Initiation' },
  { value: 'FLOWERING', label: 'Flowering' },
  { value: 'GRAIN_FILLING', label: 'Grain Filling' },
  { value: 'MATURITY', label: 'Maturity' },
  { value: 'HARVESTED', label: 'Harvested' },
];

export const ACTION_TAKEN_OPTIONS = [
  { value: 'IRRIGATED', label: 'Irrigated' },
  { value: 'WAITED', label: 'Waited' },
  { value: 'PARTIAL_IRRIGATED', label: 'Partial Irrigation' },
  { value: 'OTHER', label: 'Other' },
];

export function formatSoilType(type) {
  if (!type) return '-';
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatIrrigationMethod(method) {
  if (!method) return '-';
  return method.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatWaterSource(source) {
  if (!source) return '-';
  return source.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}