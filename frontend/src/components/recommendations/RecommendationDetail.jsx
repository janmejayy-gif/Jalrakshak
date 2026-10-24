import { Badge, Alert, Button } from '../common';
import { getStatusConfig, formatDate, formatWaterQuantity } from '../../utils';

export function RecommendationDetail({ recommendation, loading, error, onClose, onRecordAction }) {
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-pale-aqua rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <Alert variant="error" title="Error loading recommendation">
            {error}
          </Alert>
          <Button variant="primary" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const statusConfig = getStatusConfig(recommendation.action);
  const waterQty = recommendation.estimatedWaterQuantityMm && recommendation.estimatedWaterVolumeLitres
    ? formatWaterQuantity(recommendation.estimatedWaterQuantityMm, recommendation.estimatedWaterVolumeLitres / (recommendation.estimatedWaterQuantityMm * 10000))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-border-light sticky top-0 bg-white z-10">
          <div>
            <h2 id="detail-title" className="text-xl font-semibold text-primary">Recommendation Details</h2>
            <p className="text-sm text-muted mt-1">
              {formatDate(recommendation.generatedAt)} · Valid until {formatDate(recommendation.validUntil)}
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: statusConfig.bgColor, border: `1px solid ${statusConfig.color}` }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: statusConfig.color, color: 'white' }} aria-hidden="true">
              {getStatusIcon(recommendation.action)}
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: statusConfig.color }}>{statusConfig.label}</h3>
              <p className="text-sm mt-1" style={{ color: statusConfig.color }}>
                Confidence: <span className="capitalize">{recommendation.confidence || 'Low'}</span>
              </p>
            </div>
            <div className="flex-1" />
            <Badge variant={recommendation.confidence?.toLowerCase() || 'low'} className="capitalize">
              {recommendation.confidence || 'Low'} Confidence
            </Badge>
          </div>

          {waterQty && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid var(--color-success)' }}>
              <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                Estimated Water Quantity
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-muted">Depth</p>
                  <p className="font-semibold text-lg text-success">{waterQty.mm} mm</p>
                </div>
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-muted">Volume</p>
                  <p className="font-semibold text-lg text-success">{waterQty.litres} L</p>
                </div>
              </div>
            </div>
          )}

          {recommendation.reasons && recommendation.reasons.length > 0 && (
            <div>
              <h4 className="font-medium text-primary mb-3">Why this recommendation</h4>
              <ul className="space-y-2" role="list">
                {recommendation.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-secondary flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
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
              <h4 className="font-medium text-warning mb-3">Warnings</h4>
              <ul className="space-y-2" role="list">
                {recommendation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-warning flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-warning-light)' }}>
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
            <div>
              <h4 className="font-medium text-primary mb-3">Data Freshness</h4>
              <div className="grid grid-cols-3 gap-4">
                <DataFreshnessItem
                  label="Weather Data"
                  value={recommendation.dataFreshness.weatherDataAgeHours !== null ? `${recommendation.dataFreshness.weatherDataAgeHours}h ago` : 'Unavailable'}
                  fresh={recommendation.dataFreshness.weatherDataAgeHours !== null && recommendation.dataFreshness.weatherDataAgeHours <= 24}
                />
                <DataFreshnessItem
                  label="Soil Moisture"
                  value={recommendation.dataFreshness.soilMoistureAgeHours !== null ? `${recommendation.dataFreshness.soilMoistureAgeHours}h ago` : 'Unavailable'}
                  fresh={recommendation.dataFreshness.soilMoistureAgeHours !== null && recommendation.dataFreshness.soilMoistureAgeHours <= 48}
                />
                <DataFreshnessItem
                  label="Forecast Horizon"
                  value={`${recommendation.dataFreshness.forecastHorizonHours}h`}
                  fresh={true}
                />
              </div>
            </div>
          )}

          {recommendation.modelPrediction && (
            <details className="group">
              <summary className="font-medium text-secondary cursor-pointer list-none flex items-center gap-2">
                <span>ML Prediction Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="transition-transform group-open:rotate-90" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                  <span className="text-muted">Predicted Need</span>
                  <span className="font-medium">{recommendation.modelPrediction.irrigationNeedMm} mm</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                  <span className="text-muted">Prediction Confidence</span>
                  <span className="font-medium">{(recommendation.modelPrediction.predictionConfidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                  <span className="text-muted">Features Used</span>
                  <span className="font-medium">{recommendation.modelPrediction.featuresUsed?.join(', ')}</span>
                </div>
              </div>
            </details>
          )}

          {recommendation.decisionRulesApplied && recommendation.decisionRulesApplied.length > 0 && (
            <details className="group">
              <summary className="font-medium text-secondary cursor-pointer list-none flex items-center gap-2">
                <span>Decision Rules Applied</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="transition-transform group-open:rotate-90" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <ul className="mt-3 space-y-1 pl-4" role="list">
                {recommendation.decisionRulesApplied.map((rule, index) => (
                  <li key={index} className="text-sm text-muted p-2 rounded" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                    {rule}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {recommendation.inputSnapshot && (
            <details className="group">
              <summary className="font-medium text-secondary cursor-pointer list-none flex items-center gap-2">
                <span>Input Snapshot</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="transition-transform group-open:rotate-90" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="mt-3 p-3 rounded-lg font-mono text-xs overflow-x-auto" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                <pre>{JSON.stringify(recommendation.inputSnapshot, null, 2)}</pre>
              </div>
            </details>
          )}

          <div className="flex gap-3 pt-4 border-t border-border-light">
            <Button variant="primary" onClick={() => onRecordAction?.('IRRIGATED')} disabled={!onRecordAction}>
              Record: Irrigated
            </Button>
            <Button variant="outline" onClick={() => onRecordAction?.('WAITED')} disabled={!onRecordAction}>
              Record: Waited
            </Button>
            <Button variant="outline" onClick={() => onRecordAction?.('PARTIAL_IRRIGATED')} disabled={!onRecordAction}>
              Record: Partial
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataFreshnessItem({ label, value, fresh }) {
  return (
    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-medium text-sm mt-1">{value}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fresh ? 'var(--color-success)' : 'var(--color-warning)' }} aria-hidden="true" />
        <span className="text-xs" style={{ color: fresh ? 'var(--color-success)' : 'var(--color-warning)' }}>
          {fresh ? 'Fresh' : 'Stale'}
        </span>
      </div>
    </div>
  );
}

function getStatusIcon(action) {
  switch (action) {
    case 'IRRIGATE':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'WAIT':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'PARTIAL_IRRIGATION':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

export default RecommendationDetail;