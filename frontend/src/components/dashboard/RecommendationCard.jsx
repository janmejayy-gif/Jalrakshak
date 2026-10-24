import { Badge } from '../common';
import { getStatusConfig, formatDate, formatWaterQuantity } from '../../utils';

export function RecommendationCard({ recommendation, onActionClick }) {
  if (!recommendation) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-secondary">No recommendation available</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(recommendation.action);
  const waterQty = recommendation.estimatedWaterQuantityMm && recommendation.estimatedWaterVolumeLitres
    ? formatWaterQuantity(recommendation.estimatedWaterQuantityMm, recommendation.estimatedWaterVolumeLitres / (recommendation.estimatedWaterQuantityMm * 10000))
    : null;

  return (
    <div className="card" role="region" aria-labelledby="recommendation-title">
      <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
            aria-hidden="true"
          >
            {getStatusIcon(recommendation.action)}
          </div>
          <div>
            <h2 id="recommendation-title" className="text-lg font-semibold text-primary">
              {statusConfig.label}
            </h2>
            <p className="text-sm text-muted">
              Generated {formatDate(recommendation.generatedAt)} · Valid until {formatDate(recommendation.validUntil)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={recommendation.confidence?.toLowerCase() || 'low'} className="capitalize">
            {recommendation.confidence || 'Low'} Confidence
          </Badge>
        </div>
      </div>

      <div className="card-body space-y-4">
        {waterQty && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-success-light)' }}>
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <div>
                <p className="text-sm text-muted">Estimated Water Quantity</p>
                <p className="font-semibold text-lg text-success">
                  {waterQty.mm} mm ({waterQty.litres} L)
                </p>
              </div>
            </div>
          </div>
        )}

        {recommendation.reasons && recommendation.reasons.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-primary mb-2">Why this recommendation</h3>
            <ul className="space-y-1" role="list">
              {recommendation.reasons.map((reason, index) => (
                <li key={index} className="text-sm text-secondary flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.warnings && recommendation.warnings.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-warning mb-2">Warnings</h3>
            <ul className="space-y-1" role="list">
              {recommendation.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-warning flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.dataFreshness && (
          <div className="pt-2 border-t border-border-light">
            <h3 className="font-medium text-sm text-primary mb-2">Data Freshness</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                <p className="text-xs text-muted">Weather Data</p>
                <p className="font-medium text-sm">
                  {recommendation.dataFreshness.weatherDataAgeHours !== null
                    ? `${recommendation.dataFreshness.weatherDataAgeHours}h ago`
                    : 'Unavailable'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                <p className="text-xs text-muted">Soil Moisture</p>
                <p className="font-medium text-sm">
                  {recommendation.dataFreshness.soilMoistureAgeHours !== null
                    ? `${recommendation.dataFreshness.soilMoistureAgeHours}h ago`
                    : 'Unavailable'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                <p className="text-xs text-muted">Forecast Horizon</p>
                <p className="font-medium text-sm">
                  {recommendation.dataFreshness.forecastHorizonHours}h
                </p>
              </div>
            </div>
          </div>
        )}

        {recommendation.decisionRulesApplied && recommendation.decisionRulesApplied.length > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 text-sm text-secondary cursor-pointer list-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="transition-transform group-open:rotate-90" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Decision Rules Applied
            </summary>
            <ul className="mt-2 space-y-1 pl-6" role="list">
              {recommendation.decisionRulesApplied.map((rule, index) => (
                <li key={index} className="text-xs text-muted">
                  {rule}
                </li>
              ))}
            </ul>
          </details>
        )}

        {onActionClick && (
          <div className="pt-4 border-t border-border-light flex gap-3">
            <button
              type="button"
              className="btn-primary btn-sm flex-1"
              onClick={() => onActionClick('IRRIGATED')}
            >
              Record: Irrigated
            </button>
            <button
              type="button"
              className="btn-outline btn-sm flex-1"
              onClick={() => onActionClick('WAITED')}
            >
              Record: Waited
            </button>
            <button
              type="button"
              className="btn-outline btn-sm flex-1"
              onClick={() => onActionClick('PARTIAL_IRRIGATED')}
            >
              Record: Partial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusIcon(action) {
  switch (action) {
    case 'IRRIGATE':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'WAIT':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'PARTIAL_IRRIGATION':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    case 'INSUFFICIENT_DATA':
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

export default RecommendationCard;