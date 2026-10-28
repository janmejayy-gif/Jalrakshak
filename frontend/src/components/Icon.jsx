import React from 'react';

export function Icon({ name, size = 18, className = '' }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: `jr-icon ${className}`.trim(),
    'aria-hidden': 'true',
  };

  switch (name) {
    case 'overview':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
    case 'farms':
      return (
        <svg {...props}>
          <path d="M3 19h18" />
          <path d="M4 15l5-4 5 4 6-5" />
          <path d="M7 11V6l3-2 3 2v5" />
          <path d="M4 19v-4" />
          <path d="M20 19v-9" />
        </svg>
      );
    case 'irrigation':
      return (
        <svg {...props}>
          <path d="M12 2.5c-3.5 4.8-6 8-6 11.5a6 6 0 0 0 12 0c0-3.5-2.5-6.7-6-11.5Z" />
          <path d="M9.5 15a2.5 2.5 0 0 0 5 0" />
        </svg>
      );
    case 'recommendations':
      return (
        <svg {...props}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12l2 2 4-4" />
          <path d="M9 17h6" />
        </svg>
      );
    case 'weather':
      return (
        <svg {...props}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg {...props}>
          <path d="M3 3v18h18" />
          <rect x="7" y="11" width="3" height="7" rx="0.5" />
          <rect x="12" y="7" width="3" height="11" rx="0.5" />
          <rect x="17" y="13" width="3" height="5" rx="0.5" />
        </svg>
      );
    case 'history':
      return (
        <svg {...props}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'alerts':
      return (
        <svg {...props}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      );
    case 'wheat':
      return (
        <svg {...props}>
          <path d="M12 21V5" />
          <path d="M12 8c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Z" />
          <path d="M12 8c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z" />
          <path d="M12 13c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Z" />
          <path d="M12 13c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z" />
          <path d="M12 18c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Z" />
          <path d="M12 18c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z" />
        </svg>
      );
    case 'rice':
      return (
        <svg {...props}>
          <path d="M12 21v-9" />
          <path d="M12 12C9 9 6 9 4 11" />
          <path d="M12 12c3-3 6-3 8-1" />
          <path d="M12 15c-2.5-4-2.5-8 0-12 2.5 4 2.5 8 0 12Z" />
        </svg>
      );
    case 'sugarcane':
      return (
        <svg {...props}>
          <path d="M9 3v18" />
          <path d="M15 3v18" />
          <path d="M7 8h4" />
          <path d="M7 14h4" />
          <path d="M13 10h4" />
          <path d="M13 16h4" />
        </svg>
      );
    case 'cotton':
      return (
        <svg {...props}>
          <circle cx="9.5" cy="9.5" r="3.2" />
          <circle cx="14.5" cy="9.5" r="3.2" />
          <circle cx="12" cy="13.5" r="3.2" />
          <path d="M12 16.7V21" />
          <path d="M9 17.5l3-1 3 1" />
        </svg>
      );
    case 'maize':
      return (
        <svg {...props}>
          <rect x="9" y="4" width="6" height="12" rx="3" />
          <path d="M12 16v5" />
          <path d="M9 12c-2.5 0-4 2-4 5 2.5 0 4-1.5 4-5Z" />
          <path d="M15 12c2.5 0 4 2 4 5-2.5 0-4-1.5-4-5Z" />
        </svg>
      );
    case 'check':
      return (
        <svg {...props}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...props}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...props}>
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...props}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case 'close':
      return (
        <svg {...props}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...props}>
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default Icon;
