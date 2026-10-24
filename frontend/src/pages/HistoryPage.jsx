import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks';
import { recommendationService } from '../services';
import { RecommendationHistory, RecommendationDetail, ActionFeedbackForm } from '../components/recommendations';
import { Card, CardBody, Button } from '../components/common';

export function HistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [showActionForm, setShowActionForm] = useState(false);

  const {
    data: historyData,
    loading,
    error,
    refetch,
  } = useApi(
    () => recommendationService.list(null, { page, size: 10, sort: 'generatedAt,desc' }),
    [page]
  );

  const handleViewDetail = useCallback((recommendationId) => {
    const rec = historyData?.content?.find(r => r.recommendationId === recommendationId);
    if (rec) {
      setSelectedRecommendation(rec);
    }
  }, [historyData]);

  const handleRecordAction = useCallback((recommendationId) => {
    const rec = historyData?.content?.find(r => r.recommendationId === recommendationId);
    if (rec) {
      setSelectedRecommendation(rec);
      setShowActionForm(true);
    }
  }, [historyData]);

  const handleActionSubmit = async (actionData) => {
    if (!selectedRecommendation) return;
    await recommendationService.submitFeedback(selectedRecommendation.recommendationId, actionData);
    setShowActionForm(false);
    setSelectedRecommendation(null);
    refetch();
  };

  const handleCloseDetail = () => {
    setSelectedRecommendation(null);
  };

  const handleCloseActionForm = () => {
    setShowActionForm(false);
  };

  return (
    <div className="page-content">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Recommendation History</h1>
          <p className="page-subtitle">
            View past irrigation recommendations and your recorded actions.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/farms/new')}>
          + Add Farm
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          <RecommendationHistory
            recommendations={historyData?.content || []}
            loading={loading}
            error={error?.message}
            onViewDetail={handleViewDetail}
            onRecordAction={handleRecordAction}
            pagination={historyData ? { page: historyData.page, totalPages: historyData.totalPages } : null}
            onPageChange={setPage}
          />
        </CardBody>
      </Card>

      {selectedRecommendation && (
        <RecommendationDetail
          recommendation={selectedRecommendation}
          onClose={handleCloseDetail}
          onRecordAction={() => setShowActionForm(true)}
        />
      )}

      {showActionForm && selectedRecommendation && (
        <ActionFeedbackForm
          recommendation={selectedRecommendation}
          onSubmit={handleActionSubmit}
          onCancel={handleCloseActionForm}
        />
      )}
    </div>
  );
}

export default HistoryPage;