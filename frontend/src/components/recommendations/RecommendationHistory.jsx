import { Card, CardBody, Badge, Button, EmptyState, LoadingCard } from '../common';
import { getStatusConfig, formatDate, formatWaterQuantity } from '../../utils';

export function RecommendationHistory({ recommendations, loading, error, onViewDetail, onRecordAction, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <LoadingCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <EmptyState
            title="Unable to load history"
            description={error}
            action={{ label: 'Retry', onClick: onPageChange, variant: 'outline' }}
          />
        </CardBody>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <EmptyState
            icon={
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            }
            title="No recommendations yet"
            description="Recommendations will appear here once you have an active farm and crop cycle."
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <RecommendationHistoryItem
          key={rec.recommendationId}
          recommendation={rec}
          onViewDetail={onViewDetail}
          onRecordAction={onRecordAction}
        />
      ))}

      {pagination && (pagination.totalPages > 1) && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <span className="text-sm text-secondary">
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function RecommendationHistoryItem({ recommendation, onViewDetail, onRecordAction }) {
  const statusConfig = getStatusConfig(recommendation.action);
  const waterQty = recommendation.estimatedWaterQuantityMm
    ? formatWaterQuantity(recommendation.estimatedWaterQuantityMm, recommendation.estimatedWaterVolumeLitres / (recommendation.estimatedWaterQuantityMm * 10000))
    : null;

  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
              aria-hidden="true"
            >
              {getStatusIcon(recommendation.action)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={recommendation.action.toLowerCase()}>
                  {statusConfig.label}
                </Badge>
                <Badge variant={recommendation.confidence?.toLowerCase() || 'low'} className="capitalize">
                  {recommendation.confidence || 'Low'}
                </Badge>
              </div>
              <p className="text-sm text-muted mt-1">
                {formatDate(recommendation.generatedAt)} · Farm: {recommendation.farmId?.slice(0, 8)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {waterQty && (
              <div className="text-sm">
                <span className="text-muted">Water: </span>
                <span className="font-medium">{waterQty.mm} mm ({waterQty.litres} L)</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => onViewDetail?.(recommendation.recommendationId)}>
              View Details
            </Button>
            {onRecordAction && recommendation.action !== 'INSUFFICIENT_DATA' && (
              <Button variant="primary" size="sm" onClick={() => onRecordAction?.(recommendation.recommendationId)}>
                Record Action
              </Button>
            )}
          </div>
        </div>

        {recommendation.reasons && recommendation.reasons.length > 0 && (
          <details className="mt-3 group">
            <summary className="text-sm text-secondary cursor-pointer list-none flex items-center gap-1">
              <span>Reasons</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="transition-transform group-open:rotate-90" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <ul className="mt-2 space-y-1 pl-4" role="list">
              {recommendation.reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="text-sm text-muted flex items-start gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {reason}
                </li>
              ))}
              {recommendation.reasons.length > 3 && (
                <li className="text-sm text-muted">+{recommendation.reasons.length - 3} more...</li>
              )}
            </ul>
          </details>
        )}
      </CardBody>
    </Card>
  );
}

function getStatusIcon(action) {
  switch (action) {
    case 'IRRIGATE':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'WAIT':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'PARTIAL_IRRIGATION':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

export default RecommendationHistory;