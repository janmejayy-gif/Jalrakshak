import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi, useAuth } from '../hooks';
import { farmService, recommendationService, weatherService } from '../services';
import { RecommendationCard, WeatherSummary, CropSoilOverview, FarmSelector } from '../components/dashboard';
import { Card, CardHeader, CardBody, Button, Alert, LoadingSpinner, EmptyState } from '../components/common';
import { getRelativeTime, classNames } from '../utils';

async function loadFarmDetailsApi(farmId) {
  try {
    const [farmData, cropData, soilData] = await Promise.allSettled([
      farmService.get(farmId),
      farmService.getActiveCropCycle(farmId),
      farmService.getLatestSoilReading(farmId),
    ]);

    return {
      farm: farmData.status === 'fulfilled' ? farmData.value : null,
      cropCycle: cropData.status === 'fulfilled' ? cropData.value : null,
      soilReading: soilData.status === 'fulfilled' ? soilData.value : null,
    };
  } catch (error) {
    console.error('Failed to load farm details:', error);
    return { farm: null, cropCycle: null, soilReading: null };
  }
}

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [activeCropCycle, setActiveCropCycle] = useState(null);
  const [soilReading, setSoilReading] = useState(null);
  const [farmsLoading, setFarmsLoading] = useState(true);
  const [generalError, setGeneralError] = useState(null);

  const loadFarms = useCallback(async () => {
    try {
      setFarmsLoading(true);
      const data = await farmService.list({ size: 50 });
      const farmList = data.content || data;
      setFarms(farmList);
      if (farmList.length > 0 && !selectedFarmId) {
        setSelectedFarmId(farmList[0].farmId);
      }
    } catch {
      setGeneralError('Failed to load farms. Please try again.');
    } finally {
      setFarmsLoading(false);
    }
  }, [selectedFarmId]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const handleFarmSelect = useCallback((farmId) => {
    setSelectedFarmId(farmId);
    setActiveCropCycle(null);
    setSoilReading(null);
  }, []);

  const {
    data: recommendation,
    loading: recommendationLoading,
    error: recommendationError,
    refetch: refetchRecommendation,
  } = useApi(
    () => selectedFarmId ? recommendationService.getLatest(selectedFarmId) : null,
    [selectedFarmId]
  );

  const {
    data: weather,
    loading: weatherLoading,
    error: weatherError,
  } = useApi(
    () => selectedFarmId ? weatherService.getCurrent(selectedFarmId) : null,
    [selectedFarmId]
  );

  const {
    data: forecast,
    loading: forecastLoading,
  } = useApi(
    () => selectedFarmId ? weatherService.getForecast(selectedFarmId) : null,
    [selectedFarmId]
  );

  useEffect(() => {
    if (selectedFarmId) {
      loadFarmDetailsApi(selectedFarmId).then(({ cropCycle, soilReading: soil }) => {
        setActiveCropCycle(cropCycle);
        setSoilReading(soil);
      });
    }
  }, [selectedFarmId]);

  const handleRecordAction = (actionTaken) => {
    if (recommendation) {
      navigate(`/recommendations/${recommendation.recommendationId}/action`, {
        state: { recommendation, actionTaken },
      });
    }
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-content">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.fullName || 'Farmer'}. Here's your irrigation overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FarmSelector
            farms={farms}
            selectedFarmId={selectedFarmId}
            onSelect={handleFarmSelect}
            loading={farmsLoading}
          />
          <Button variant="secondary" onClick={() => navigate('/farms/new')}>
            + Add Farm
          </Button>
        </div>
      </div>

      {generalError && (
        <Alert variant="error" className="mb-6" onDismiss={() => setGeneralError(null)}>
          {generalError}
        </Alert>
      )}

      {selectedFarmId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section aria-labelledby="recommendation-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 id="recommendation-heading" className="section-title">Latest Recommendation</h2>
                <Button variant="ghost" size="sm" onClick={refetchRecommendation} disabled={recommendationLoading}>
                  <LoadingSpinner size="sm" className={classNames(recommendationLoading && 'animate-spin')} />
                  Refresh
                </Button>
              </div>
              {recommendationLoading ? (
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  </CardBody>
                </Card>
              ) : recommendationError ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <EmptyState
                      title="Unable to load recommendation"
                      description={recommendationError?.message || 'Please try again later'}
                      action={{ label: 'Retry', onClick: refetchRecommendation, variant: 'outline' }}
                    />
                  </CardBody>
                </Card>
              ) : (
                <RecommendationCard
                  recommendation={recommendation}
                  onActionClick={handleRecordAction}
                />
              )}
            </section>

            <section aria-labelledby="weather-heading">
              <h2 id="weather-heading" className="section-title">Weather & Forecast</h2>
              <WeatherSummary
                current={weather}
                forecast={forecast}
                loading={weatherLoading || forecastLoading}
                error={weatherError?.message}
              />
            </section>

            <section aria-labelledby="crop-soil-heading">
              <h2 id="crop-soil-heading" className="section-title">Crop & Soil Overview</h2>
              <CropSoilOverview
                farm={farms.find(f => f.farmId === selectedFarmId)}
                cropCycle={activeCropCycle}
                soilReading={soilReading}
              />
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-primary">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button variant="outline" fullWidth onClick={() => navigate('/farms/new')}>
                  + Add New Farm
                </Button>
                <Button variant="outline" fullWidth onClick={handleViewHistory}>
                  View History
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate('/settings')}>
                  Settings
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-primary">Your Farms</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                {farmsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 animate-pulse bg-pale-aqua rounded" />
                    ))}
                  </div>
                ) : farms.length === 0 ? (
                  <EmptyState
                    title="No farms yet"
                    description="Add your first farm to start getting irrigation recommendations."
                    action={{ label: 'Add Farm', onClick: () => navigate('/farms/new'), variant: 'primary' }}
                  />
                ) : (
                  farms.map((farm) => (
                    <div
                      key={farm.farmId}
                      className={classNames(
                        'p-3 rounded-lg cursor-pointer transition-colors',
                        farm.farmId === selectedFarmId
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-pale-aqua'
                      )}
                      onClick={() => handleFarmSelect(farm.farmId)}
                    >
                      <p className="font-medium">{farm.name}</p>
                      <p className="text-xs text-muted">
                        {farm.areaHectares} ha · {farm.soilType?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-primary">Data Freshness</h3>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary">Weather Data</span>
                  <span className={classNames('font-medium', weather?.dataFreshness?.weatherDataAgeHours > 24 ? 'text-warning' : 'text-success')}>
                    {weather?.dataFreshness?.weatherDataAgeHours !== undefined
                      ? `${weather.dataFreshness.weatherDataAgeHours}h ago`
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary">Soil Moisture</span>
                  <span className={classNames('font-medium', soilReading ? 'text-success' : 'text-warning')}>
                    {soilReading ? `${getRelativeTime(soilReading.recordedAt)}` : 'No sensor data'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary">Last Recommendation</span>
                  <span className="font-medium">
                    {recommendation ? getRelativeTime(recommendation.generatedAt) : 'None'}
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardBody className="text-center py-12">
            <EmptyState
              icon={
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M21 10V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                  <path d="M18 10V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5" />
                  <path d="M3 10v10a2 2 0 0 0 2 2h14" />
                </svg>
              }
              title="No farms configured"
              description="Add your first farm to start receiving irrigation recommendations tailored to your fields."
              action={{ label: 'Add Farm', onClick: () => navigate('/farms/new'), variant: 'primary', size: 'lg' }}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default DashboardPage;