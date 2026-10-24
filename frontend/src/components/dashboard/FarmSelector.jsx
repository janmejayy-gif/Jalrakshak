import { useState, useRef, useEffect } from 'react';
import { classNames } from '../../utils';

export function FarmSelector({ farms, selectedFarmId, onSelect, loading, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedFarm = farms.find((f) => f.farmId === selectedFarmId);

  if (loading) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="btn-outline w-full justify-between animate-pulse"
          disabled
          aria-label="Loading farms"
        >
          <span className="h-4 bg-pale-aqua rounded w-32" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button type="button" className="btn-outline w-full justify-between" disabled>
          <span className="text-secondary">No farms available</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={classNames('btn-outline w-full justify-between', disabled && 'opacity-50')}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select farm"
      >
        <span className="truncate">
          {selectedFarm ? selectedFarm.name : 'Select a farm'}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          className={classNames('transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden"
          role="listbox"
          aria-label="Farm options"
        >
          {farms.map((farm) => (
            <button
              key={farm.farmId}
              type="button"
              role="option"
              aria-selected={farm.farmId === selectedFarmId}
              className={classNames(
                'w-full px-4 py-3 text-left hover:bg-pale-aqua transition-colors',
                farm.farmId === selectedFarmId && 'bg-primary/10 text-primary'
              )}
              onClick={() => {
                onSelect(farm.farmId);
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{farm.name}</div>
              <div className="text-xs text-muted mt-0.5">
                {farm.areaHectares} ha · {formatSoilType(farm.soilType)} · {formatIrrigationMethod(farm.irrigationMethod)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatSoilType(type) {
  if (!type) return '';
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatIrrigationMethod(method) {
  if (!method) return '';
  return method.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default FarmSelector;