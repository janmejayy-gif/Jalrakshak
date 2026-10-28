import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { apiClient } from './api/client';
import { loadDemoState, saveDemoState } from './api/mockAdapter';
import IrrigationPrediction from './components/IrrigationPrediction';
import Icon from './components/Icon';

const CORE_ROUTES = [
  { id: 'overview', label: 'Overview', hi: 'सारांश', icon: 'overview' },
  { id: 'farms', label: 'My Farms', hi: 'मेरे खेत', icon: 'farms' },
  { id: 'irrigation', label: 'Irrigation', hi: 'सिंचाई पूर्वानुमान', icon: 'irrigation' },
  { id: 'recommendations', label: 'Recommendations', hi: 'सलाह', icon: 'recommendations' },
  { id: 'weather', label: 'Weather', hi: 'मौसम', icon: 'weather' },
  { id: 'analytics', label: 'Analytics', hi: 'जल विश्लेषण', icon: 'analytics' },
  { id: 'history', label: 'History', hi: 'इतिहास', icon: 'history' },
  { id: 'alerts', label: 'Alerts', hi: 'चेतावनी', icon: 'alerts' },
  { id: 'settings', label: 'Settings', hi: 'सेटिंग्स', icon: 'settings' },
];

const CROP_ICON_MAP = {
  Wheat: 'wheat',
  Rice: 'rice',
  Sugarcane: 'sugarcane',
  Cotton: 'cotton',
  Maize: 'maize',
};

function getHoursAge(isoString) {
  if (!isoString) return 999;
  const diffMs = Date.now() - new Date(isoString).getTime();
  return Math.max(0.1, Number((diffMs / (1000 * 3600)).toFixed(1)));
}

function App() {
  const [demoState, setDemoState] = useState(() => loadDemoState());
  const [activeRoute, setActiveRoute] = useState('overview');
  const [selectedFarmId, setSelectedFarmId] = useState(
    () => loadDemoState().farms[0]?.id || '550e8400-e29b-41d4-a716-446655440001'
  );
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('jr_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [bilingual, setBilingual] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Top-right Login / Register drawer state
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | 'forgot' | null
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    fullName: '',
    phone: '+91 ',
    email: '',
    password: '',
  });
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');

  // Service health state
  const [health, setHealth] = useState({
    status: 'SIMULATED',
    checks: { database: 'SIMULATED', 'ml-service': 'SIMULATED' },
  });
  const [mlHealth, setMlHealth] = useState({ status: 'SIMULATED' });
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Expanded input snapshot ID in Recommendations route
  const [expandedSnapshotId, setExpandedSnapshotId] = useState(null);

  // New Farm + Crop Cycle form state
  const [newFarmForm, setNewFarmForm] = useState({
    name: '',
    address: '',
    totalAreaHectares: '2.0',
    soilType: 'LOAMY',
    irrigationMethod: 'DRIP',
    cropType: 'Wheat',
    variety: 'HD-3086',
    growthStage: 'VEGETATIVE',
    soilMoisturePct: '22.0',
  });

  // New Weather Observation form state
  const [weatherForm, setWeatherForm] = useState({
    temperatureCelsius: '29.0',
    humidityPercent: '56',
    rainfallMm: '0.0',
    windSpeedKmh: '11.5',
    source: 'Field Agromet Gauge',
  });

  // New Farmer Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    recommendationId: '770e8400-e29b-41d4-a716-446655440904',
    actualOutcome: 'IRRIGATE',
    appliedMm: '25.0',
    rating: '5',
    feedbackText: '',
  });

  // Status banner notification
  const [bannerNotice, setBannerNotice] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('jr_theme', theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  useEffect(() => {
    saveDemoState(demoState);
  }, [demoState]);

  useEffect(() => {
    let mounted = true;
    const checkServices = async () => {
      try {
        const [backendRes, mlRes] = await Promise.all([
          apiClient.getHealth(),
          apiClient.checkMlHealth(),
        ]);
        if (!mounted) return;
        const apiUp = backendRes?.status === 'UP';
        setHealth(backendRes || { status: 'DOWN' });
        setMlHealth(mlRes || { status: 'DOWN' });
        setIsLiveBackend(Boolean(apiUp));
      } catch {
        if (!mounted) return;
        setHealth({
          status: 'DEMO_FALLBACK',
          checks: { database: 'DEMO_FALLBACK', 'ml-service': 'DEMO_FALLBACK' },
        });
        setMlHealth({ status: 'DEMO_FALLBACK' });
        setIsLiveBackend(false);
      }
    };

    checkServices();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedFarm = useMemo(
    () => demoState.farms.find((f) => f.id === selectedFarmId) || demoState.farms[0],
    [demoState.farms, selectedFarmId]
  );

  const selectedCropCycle = useMemo(
    () =>
      demoState.cropCycles.find((c) => c.farmId === selectedFarm?.id) ||
      demoState.cropCycles[0],
    [demoState.cropCycles, selectedFarm]
  );

  const selectedRecommendation = useMemo(
    () =>
      demoState.recommendations.find((r) => r.farmId === selectedFarm?.id) ||
      demoState.recommendations[0],
    [demoState.recommendations, selectedFarm]
  );

  const latestWeather = useMemo(
    () =>
      demoState.weatherObservations.find((w) => w.farmId === selectedFarm?.id) ||
      demoState.weatherObservations[0],
    [demoState.weatherObservations, selectedFarm]
  );

  const weatherAgeHours = getHoursAge(latestWeather?.observedAt);
  const weatherFresh = weatherAgeHours <= 6;
  const moistureAgeHours = getHoursAge(selectedFarm?.moistureObservedAt);
  const moistureFresh = moistureAgeHours <= 24;

  function navigateTo(routeId) {
    setActiveRoute(routeId);
    setMobileNavOpen(false);
  }

  function handleExecuteRecommendation(recId) {
    setDemoState((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec) =>
        rec.id === recId
          ? {
              ...rec,
              status: 'EXECUTED',
              executedAt: new Date().toISOString(),
            }
          : rec
      ),
    }));
    setBannerNotice(
      'Farmer execution recorded. Recommendation marked EXECUTED and logged to History.'
    );
  }

  function handleAddPredictionToRecommendations(payload, mlResult) {
    const newRec = {
      id: `rec-${Date.now()}`,
      code: `REC-${Math.floor(905 + Math.random() * 90)}`,
      farmId: payload.farmId || selectedFarm?.id,
      cropCycleId: selectedCropCycle?.id,
      recommendation: mlResult.recommendation,
      confidence: mlResult.confidence ?? 0.82,
      reasoning: mlResult.reasoning,
      irrigationAmountMm:
        mlResult.recommendation === 'IRRIGATE' ||
        mlResult.recommendation === 'PARTIAL_IRRIGATION'
          ? mlResult.irrigationAmountMm
          : null,
      status: 'PENDING',
      modelVersion: mlResult.modelVersion || 'baseline-heuristic-v1',
      createdAt: new Date().toISOString(),
      executedAt: null,
      snapshot: {
        soilMoisturePct: payload.soilMoisture,
        moistureAgeHours: 0.1,
        temperatureCelsius: payload.temperature,
        humidityPercent: payload.humidity,
        rainfallForecast72hMm: payload.rainfallForecast,
        windSpeedKmh: 12.0,
        et0Mm: 4.8,
        kc: 1.05,
        deficitMm:
          mlResult.irrigationAmountMm != null ? Number(mlResult.irrigationAmountMm) : 0,
        soilType: selectedFarm?.soilType || 'LOAMY',
        irrigationMethod: selectedFarm?.irrigationMethod || 'DRIP',
      },
    };

    setDemoState((prev) => ({
      ...prev,
      recommendations: [newRec, ...prev.recommendations],
    }));
  }

  function handleCreateFarm(event) {
    event.preventDefault();
    if (!newFarmForm.name.trim()) return;
    const farmId = `farm-${Date.now()}`;
    const newFarm = {
      id: farmId,
      name: newFarmForm.name.trim(),
      description: `${newFarmForm.cropType} (${newFarmForm.variety}) parcel on ${newFarmForm.irrigationMethod}`,
      locationLatitude: 28.615,
      locationLongitude: 77.212,
      address: newFarmForm.address.trim() || 'Village Plot, Karnal District',
      totalAreaHectares: Number(newFarmForm.totalAreaHectares) || 1.5,
      soilType: newFarmForm.soilType,
      irrigationMethod: newFarmForm.irrigationMethod,
      soilMoisturePct: Number(newFarmForm.soilMoisturePct) || 20.0,
      moistureObservedAt: new Date().toISOString(),
      wiltingPointPct: 12.0,
      fieldCapacityPct: 32.0,
      createdAt: new Date().toISOString(),
    };

    const newCycle = {
      id: `cycle-${Date.now()}`,
      farmId,
      cropType: newFarmForm.cropType,
      variety: newFarmForm.variety.trim() || 'Local Improved',
      plantingDate: new Date().toISOString().slice(0, 10),
      expectedHarvestDate: '2027-02-15',
      growthStage: newFarmForm.growthStage,
      phenologyDay: 25,
      totalCycleDays: 120,
      kc: 1.0,
      areaHectares: newFarm.totalAreaHectares,
      irrigationMethod: newFarmForm.irrigationMethod,
      notes: 'Newly registered farm plot and active crop cycle',
    };

    setDemoState((prev) => ({
      ...prev,
      farms: [...prev.farms, newFarm],
      cropCycles: [...prev.cropCycles, newCycle],
    }));
    setSelectedFarmId(farmId);
    setNewFarmForm((prev) => ({ ...prev, name: '', address: '' }));
    setBannerNotice(`Farm parcel "${newFarm.name}" and ${newCycle.cropType} cycle saved.`);
  }

  function handleDeleteFarm(farmId) {
    if (demoState.farms.length <= 1) return;
    setDemoState((prev) => {
      const remaining = prev.farms.filter((f) => f.id !== farmId);
      if (selectedFarmId === farmId && remaining[0]) {
        setSelectedFarmId(remaining[0].id);
      }
      return {
        ...prev,
        farms: remaining,
        cropCycles: prev.cropCycles.filter((c) => c.farmId !== farmId),
      };
    });
    setBannerNotice('Farm plot removed from active roster.');
  }

  function handleRefreshMoisture(farmId, moisturePct) {
    setDemoState((prev) => ({
      ...prev,
      farms: prev.farms.map((f) =>
        f.id === farmId
          ? {
              ...f,
              soilMoisturePct: Number(moisturePct),
              moistureObservedAt: new Date().toISOString(),
            }
          : f
      ),
    }));
    setBannerNotice('Fresh root-zone soil moisture reading recorded (<24h SLA restored).');
  }

  function handleCreateWeather(event) {
    event.preventDefault();
    const obs = {
      id: `weather-${Date.now()}`,
      farmId: selectedFarm?.id,
      observedAt: new Date().toISOString(),
      temperatureCelsius: Number(weatherForm.temperatureCelsius),
      humidityPercent: Number(weatherForm.humidityPercent),
      rainfallMm: Number(weatherForm.rainfallMm),
      windSpeedKmh: Number(weatherForm.windSpeedKmh),
      solarRadiationWm2: 590,
      pressureHpa: 1009,
      source: weatherForm.source || 'Farmer Field Entry',
    };
    setDemoState((prev) => ({
      ...prev,
      weatherObservations: [obs, ...prev.weatherObservations],
    }));
    setBannerNotice('Weather observation recorded. 6-hour freshness window updated.');
  }

  function handleCreateFeedback(event) {
    event.preventDefault();
    const targetRec =
      demoState.recommendations.find((r) => r.id === feedbackForm.recommendationId) ||
      selectedRecommendation;
    const targetFarm =
      demoState.farms.find((f) => f.id === targetRec?.farmId) || selectedFarm;

    const entry = {
      id: `fb-${Date.now()}`,
      recommendationId: targetRec?.id,
      recommendationCode: targetRec?.code || 'REC-NEW',
      farmName: `${targetFarm?.name || 'Plot'}`,
      actualOutcome: feedbackForm.actualOutcome,
      appliedMm: Number(feedbackForm.appliedMm) || 0,
      rating: Number(feedbackForm.rating) || 5,
      wasHelpful: Number(feedbackForm.rating) >= 4,
      feedbackText:
        feedbackForm.feedbackText.trim() ||
        'Field moisture verified after irrigation window.',
      createdAt: new Date().toISOString(),
    };

    setDemoState((prev) => ({
      ...prev,
      feedbackList: [entry, ...prev.feedbackList],
    }));
    setFeedbackForm((prev) => ({ ...prev, feedbackText: '' }));
    setBannerNotice('Farmer outcome feedback saved for model monitoring.');
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');

    try {
      if (authModalMode === 'forgot') {
        await apiClient.forgotPassword(authForm.email);
        setAuthMessage(
          'If the email is registered, a password reset link has been dispatched.'
        );
        return;
      }

      if (authModalMode === 'register') {
        try {
          const res = await apiClient.register({
            email: authForm.email,
            password: authForm.password,
            fullName: authForm.fullName,
            phone: authForm.phone,
          });
          setCurrentUser(
            res?.user || {
              fullName: authForm.fullName || 'Rameshwar Patel',
              email: authForm.email,
              phone: authForm.phone,
              role: 'FARMER',
            }
          );
        } catch {
          setCurrentUser({
            fullName: authForm.fullName || 'Rameshwar Patel',
            email: authForm.email || 'farmer@krishisetu.in',
            phone: authForm.phone || '+91 98765 43210',
            role: 'FARMER',
          });
        }
        setAuthModalMode(null);
        setBannerNotice('Farmer account registered and active.');
        return;
      }

      // Login flow
      try {
        const res = await apiClient.login({
          email: authForm.email,
          password: authForm.password,
        });
        setCurrentUser(
          res?.user || {
            fullName: 'Rameshwar Patel',
            email: authForm.email,
            phone: '+91 98765 43210',
            role: 'FARMER',
          }
        );
      } catch {
        setCurrentUser({
          fullName: authForm.email.split('@')[0] || 'Rameshwar Patel',
          email: authForm.email || 'farmer@krishisetu.in',
          phone: '+91 98765 43210',
          role: 'FARMER',
        });
      }
      setAuthModalMode(null);
      setBannerNotice('Signed in to JALRAKSHAK farmer session.');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    }
  }

  const moisturePinPercent = Math.min(
    94,
    Math.max(6, Math.round(((selectedFarm?.soilMoisturePct || 15) / 45) * 100))
  );

  const showSelectedWaterQty =
    selectedRecommendation &&
    selectedRecommendation.irrigationAmountMm != null &&
    (selectedRecommendation.recommendation === 'IRRIGATE' ||
      selectedRecommendation.recommendation === 'PARTIAL_IRRIGATION');

  return (
    <div className="jr-shell">
      {/* LEFT SIDEBAR: 9 CORE ROUTES + SERVICE HEALTH */}
      <aside
        className={`jr-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}
        aria-label="Primary Sidebar Navigation"
      >
        <div>
          <div className="jr-brand">
            <div className="jr-brand-row">
              <h1>JALRAKSHAK</h1>
              {mobileNavOpen && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
            <p className="jr-brand-sub">
              Smart Irrigation Decision-Support Platform · जलक्षक (KrishiSetu)
            </p>
          </div>

          <nav className="jr-nav" aria-label="Farmer Application Routes">
            {CORE_ROUTES.map((route) => (
              <button
                key={route.id}
                type="button"
                className={`jr-nav-btn ${activeRoute === route.id ? 'active' : ''}`}
                onClick={() => navigateTo(route.id)}
              >
                <span className="jr-nav-left">
                  <Icon name={route.icon} size={17} />
                  <span>{route.label}</span>
                </span>
                {bilingual && <span className="jr-nav-hi">{route.hi}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="jr-probe-panel">
          <div className="jr-probe-title">Service Telemetry</div>
          <div className="jr-probe-row">
            <span>Spring API :8080</span>
            <span className={`jr-probe-status ${isLiveBackend ? '' : 'down'}`}>
              {isLiveBackend ? 'LIVE UP' : 'DEMO MODE'}
            </span>
          </div>
          <div className="jr-probe-row">
            <span>FastAPI ML :8000</span>
            <span
              className={`jr-probe-status ${
                mlHealth?.status === 'healthy' ? '' : 'down'
              }`}
            >
              {mlHealth?.status === 'healthy' ? 'HEALTHY' : 'FALLBACK'}
            </span>
          </div>
          <div className="jr-probe-row">
            <span>PostgreSQL :5432</span>
            <span
              className={`jr-probe-status ${
                health?.checks?.database === 'UP' ? '' : 'down'
              }`}
            >
              {health?.checks?.database === 'UP' ? 'ONLINE' : 'LOCAL STATE'}
            </span>
          </div>
        </div>
      </aside>

      {/* TOPBAR WITH FARM SWITCHER, FRESHNESS TAGS & TOP-RIGHT LOGIN/REGISTER */}
      <header className="jr-topbar">
        <div className="jr-topbar-left">
          <button
            type="button"
            className="jr-mobile-menu-btn"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label="Open navigation menu"
          >
            <Icon name="menu" size={20} />
          </button>

          <select
            className="jr-farm-selector"
            aria-label="Select Active Farm Plot"
            value={selectedFarm?.id || ''}
            onChange={(e) => setSelectedFarmId(e.target.value)}
          >
            {demoState.farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} ({farm.totalAreaHectares} ha · {farm.soilType} ·{' '}
                {farm.irrigationMethod})
              </option>
            ))}
          </select>

          <span className={`mono-tag ${weatherFresh ? 'ok-tag' : 'warn-tag'}`}>
            Weather: {weatherAgeHours}h ({weatherFresh ? '<6h OK' : '>6h Stale'})
          </span>

          <span className={`mono-tag ${isLiveBackend ? 'ok-tag' : 'warn-tag'}`}>
            {isLiveBackend ? 'LIVE API' : 'DEMO TELEMETRY'}
          </span>
        </div>

        <div className="jr-topbar-right" aria-label="Account and Display Controls">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setBilingual((prev) => !prev)}
          >
            {bilingual ? 'EN + हिंदी' : 'EN Only'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle daylight or night theme"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            <span>{theme === 'dark' ? 'Sunlight Mode' : 'Night Mode'}</span>
          </button>

          {currentUser ? (
            <>
              <span className="mono-tag ok-tag">
                <Icon name="user" size={14} />
                <span>{currentUser.fullName}</span>
              </span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  apiClient.logout();
                  setCurrentUser(null);
                  setBannerNotice('Logged out of farmer account.');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setAuthError('');
                  setAuthMessage('');
                  setAuthModalMode('login');
                }}
              >
                <Icon name="user" size={15} />
                <span>{bilingual ? 'Login / लॉगिन' : 'Login'}</span>
              </button>
              <button
                type="button"
                className="btn-cobalt"
                onClick={() => {
                  setAuthError('');
                  setAuthMessage('');
                  setAuthModalMode('register');
                }}
              >
                <Icon name="plus" size={15} />
                <span>{bilingual ? 'Register / पंजीकरण' : 'Register'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* CENTRAL ROUTE WORKSPACE */}
      <main className="jr-main">
        {bannerNotice && (
          <div className="jr-panel" role="status">
            <div className="panel-header-bar" style={{ marginBottom: 0 }}>
              <span>{bannerNotice}</span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setBannerNotice('')}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ROUTE 1: OVERVIEW */}
        {activeRoute === 'overview' && (
          <>
            <section className="jr-panel">
              <div className="panel-header-bar">
                <h2>
                  ICAR Crop Phenology Calendar — {selectedCropCycle?.cropType} (
                  {selectedCropCycle?.variety})
                </h2>
                <span className="mono-tag cobalt-tag">
                  Day {selectedCropCycle?.phenologyDay || 48} of{' '}
                  {selectedCropCycle?.totalCycleDays || 125} · Crop Coefficient Kc ={' '}
                  {selectedCropCycle?.kc || 1.05}
                </span>
              </div>
              <p className="section-lead">
                Planted {selectedCropCycle?.plantingDate} on {selectedFarm?.name} (
                {selectedFarm?.totalAreaHectares} ha · {selectedFarm?.soilType} soil ·{' '}
                {selectedFarm?.irrigationMethod} system).
              </p>

              <div className="phenology-stages">
                {[
                  {
                    stage: 'GERMINATION',
                    title: bilingual ? 'Germination · अंकुरण' : 'Germination',
                    meta: 'Days 1–20 · Emergence',
                  },
                  {
                    stage: 'VEGETATIVE',
                    title: bilingual
                      ? 'Vegetative / CRI · वानस्पतिक'
                      : 'Vegetative / CRI',
                    meta: 'Days 21–55 · Root & Tiller Growth',
                  },
                  {
                    stage: 'REPRODUCTIVE',
                    title: bilingual
                      ? 'Flowering / Panicle · फूल आना'
                      : 'Flowering / Panicle',
                    meta: 'Days 56–95 · Peak Water Sensitivity',
                  },
                  {
                    stage: 'MATURITY',
                    title: bilingual ? 'Maturity · परिपक्वता' : 'Maturity',
                    meta: 'Days 96–125 · Grain Fill & Harvest',
                  },
                ].map((item) => (
                  <div
                    key={item.stage}
                    className={`phenology-stage-item ${
                      selectedCropCycle?.growthStage === item.stage ? 'active-stage' : ''
                    }`}
                  >
                    <span className="phenology-stage-name">{item.title}</span>
                    <span className="phenology-stage-meta">{item.meta}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="jr-panel-emphasis">
              <div className="panel-header-bar">
                <h2>
                  Field Irrigation Advisory — {selectedFarm?.name} (
                  {selectedCropCycle?.cropType})
                </h2>
                <span className="mono-tag">
                  Model: {selectedRecommendation?.modelVersion} · Farmer Retains Final
                  Decision
                </span>
              </div>

              <div className="decision-split">
                <div>
                  <div className="decision-stamp-bar">
                    <span
                      className={`action-stamp ${
                        selectedRecommendation?.recommendation || 'IRRIGATE'
                      }`}
                    >
                      <Icon name="irrigation" size={18} />
                      <span>
                        {selectedRecommendation?.recommendation === 'IRRIGATE' &&
                          (bilingual ? 'IRRIGATE · सिंचाई करें' : 'IRRIGATE')}
                        {selectedRecommendation?.recommendation === 'WAIT' &&
                          (bilingual ? 'WAIT · प्रतीक्षा करें' : 'WAIT')}
                        {selectedRecommendation?.recommendation ===
                          'PARTIAL_IRRIGATION' &&
                          (bilingual
                            ? 'PARTIAL IRRIGATION · आंशिक सिंचाई'
                            : 'PARTIAL IRRIGATION')}
                        {selectedRecommendation?.recommendation ===
                          'INSUFFICIENT_DATA' &&
                          (bilingual
                            ? 'INSUFFICIENT DATA · अपर्याप्त डेटा'
                            : 'INSUFFICIENT DATA')}
                      </span>
                    </span>

                    {showSelectedWaterQty ? (
                      <span className="water-depth-figure">
                        {selectedRecommendation.irrigationAmountMm} mm
                      </span>
                    ) : (
                      <span className="mono-tag warn-tag">
                        Water Quantity Suppressed ({selectedRecommendation?.recommendation})
                      </span>
                    )}

                    {selectedRecommendation?.confidence > 0 && (
                      <span className="mono-tag cobalt-tag">
                        Confidence: {(selectedRecommendation.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <p className="section-lead" style={{ color: 'var(--ink-primary)' }}>
                    <strong>Why this recommendation:</strong>{' '}
                    {selectedRecommendation?.reasoning}
                  </p>

                  {showSelectedWaterQty && (
                    <p className="mono-tag ok-tag">
                      Field Volume: {selectedRecommendation.irrigationAmountMm} mm across{' '}
                      {selectedFarm?.totalAreaHectares} ha ={' '}
                      {Math.round(
                        Number(selectedRecommendation.irrigationAmountMm) *
                          10 *
                          Number(selectedFarm?.totalAreaHectares || 1)
                      )}{' '}
                      m³ via {selectedFarm?.irrigationMethod}
                    </p>
                  )}

                  <div className="decision-actions-row">
                    {selectedRecommendation?.recommendation !== 'INSUFFICIENT_DATA' && (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                          handleExecuteRecommendation(selectedRecommendation.id)
                        }
                      >
                        <Icon name="check" size={16} />
                        <span>
                          {selectedRecommendation?.status === 'EXECUTED'
                            ? 'Executed by Farmer ✓'
                            : 'Record Executed Irrigation'}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigateTo('recommendations')}
                    >
                      Inspect Input Snapshot
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigateTo('history')}
                    >
                      Log Outcome Feedback
                    </button>
                  </div>
                </div>

                <div className="threshold-rail-box">
                  <h3>Calibrated Root-Zone Moisture Rail (0–45% Vol)</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
                    Reading age: {moistureAgeHours}h ago (
                    {moistureFresh ? 'Valid <24h' : 'Stale >24h — Needs Fresh Sample'})
                  </p>

                  <div className="threshold-track">
                    <div
                      className="threshold-pin"
                      style={{ left: `${moisturePinPercent}%` }}
                    >
                      <span className="threshold-pin-callout">
                        NOW: {selectedFarm?.soilMoisturePct}%
                      </span>
                    </div>
                  </div>

                  <div className="threshold-scale-labels">
                    <span>Wilting: {selectedFarm?.wiltingPointPct || 12}%</span>
                    <span>Stress: 20%</span>
                    <span>Field Cap: {selectedFarm?.fieldCapacityPct || 32}%</span>
                    <span>Sat: 45%</span>
                  </div>

                  {!moistureFresh && (
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        className="btn-cobalt"
                        onClick={() => handleRefreshMoisture(selectedFarm.id, 21.0)}
                      >
                        <Icon name="refresh" size={15} />
                        <span>Record Fresh 21.0% Moisture Sample</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="jr-two-col">
              <section className="jr-panel">
                <h2>7-Day Root-Zone Moisture (%) &amp; Rainfall Trajectory</h2>
                <p className="section-lead">
                  Millimeter-ruled gauge comparing past 4 days, today&apos;s deficit, and
                  post-irrigation recovery.
                </p>
                <div className="mm-chart-stage">
                  {demoState.forecast7Day.map((d) => (
                    <div key={d.day} className="mm-bar-col">
                      <div
                        className={`mm-bar-fill ${
                          d.current ? 'critical' : d.projectedAfterIrrigation ? 'projected' : ''
                        }`}
                        style={{ height: `${Math.max(24, d.moisturePct * 3.6)}px` }}
                      />
                      <span className="mm-bar-caption">
                        {d.day}
                        <br />
                        <strong>{d.moisturePct}%</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="jr-panel">
                <h2>All Registered Farm Plots Status</h2>
                <p className="section-lead">
                  Select any plot to switch the active phenology calendar and advisory.
                </p>
                <div className="table-scroll">
                  <table className="jr-table">
                    <thead>
                      <tr>
                        <th>Plot &amp; Crop</th>
                        <th>Moisture</th>
                        <th>Action</th>
                        <th>Water (mm)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoState.farms.map((farm) => {
                        const cycle = demoState.cropCycles.find(
                          (c) => c.farmId === farm.id
                        );
                        const rec = demoState.recommendations.find(
                          (r) => r.farmId === farm.id
                        );
                        const mFresh = getHoursAge(farm.moistureObservedAt) <= 24;
                        return (
                          <tr
                            key={farm.id}
                            onClick={() => setSelectedFarmId(farm.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>
                              <strong>{farm.name}</strong> ({cycle?.cropType || 'Crop'})
                            </td>
                            <td>
                              {mFresh ? `${farm.soilMoisturePct}%` : 'Stale (>24h)'}
                            </td>
                            <td>
                              <strong>{rec?.recommendation || 'IRRIGATE'}</strong>
                            </td>
                            <td>
                              {rec?.irrigationAmountMm != null &&
                              (rec.recommendation === 'IRRIGATE' ||
                                rec.recommendation === 'PARTIAL_IRRIGATION')
                                ? `${rec.irrigationAmountMm} mm`
                                : '—'}
                            </td>
                            <td>{rec?.status || 'PENDING'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </>
        )}

        {/* ROUTE 2: MY FARMS (& CROP CYCLES) */}
        {activeRoute === 'farms' && (
          <>
            <section className="jr-panel">
              <div className="panel-header-bar">
                <h2>My Farms &amp; Active Crop Cycles (मेरे खेत और फसल चक्र)</h2>
                <span className="mono-tag ok-tag">
                  {demoState.farms.length} Registered Plots
                </span>
              </div>
              <p className="section-lead">
                Manage field boundaries, soil classifications, irrigation delivery
                methods, and crop varieties (<code>/api/farms</code> &amp;{' '}
                <code>/api/crops</code>).
              </p>

              <div className="table-scroll">
                <table className="jr-table">
                  <thead>
                    <tr>
                      <th>Plot Name &amp; Address</th>
                      <th>Area (ha)</th>
                      <th>Soil &amp; Method</th>
                      <th>Active Crop Cycle</th>
                      <th>Root Moisture</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoState.farms.map((farm) => {
                      const cycle = demoState.cropCycles.find(
                        (c) => c.farmId === farm.id
                      );
                      const mAge = getHoursAge(farm.moistureObservedAt);
                      return (
                        <tr key={farm.id}>
                          <td>
                            <strong>{farm.name}</strong>
                            <br />
                            <small>{farm.address}</small>
                          </td>
                          <td>{farm.totalAreaHectares} ha</td>
                          <td>
                            {farm.soilType} · {farm.irrigationMethod}
                          </td>
                          <td>
                            {cycle
                              ? `${cycle.cropType} (${cycle.variety}) · ${cycle.growthStage}`
                              : 'No cycle'}
                          </td>
                          <td>
                            {farm.soilMoisturePct}% ({mAge}h ago)
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => {
                                  setSelectedFarmId(farm.id);
                                  navigateTo('overview');
                                }}
                              >
                                Inspect
                              </button>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => handleRefreshMoisture(farm.id, 22.0)}
                              >
                                Sync Moisture
                              </button>
                              {demoState.farms.length > 1 && (
                                <button
                                  type="button"
                                  className="btn-danger"
                                  onClick={() => handleDeleteFarm(farm.id)}
                                  aria-label={`Delete ${farm.name}`}
                                >
                                  <Icon name="trash" size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="jr-panel">
              <h2>Register New Farm Parcel &amp; Crop Cycle (नया खेत जोड़ें)</h2>
              <form className="jr-form-grid" onSubmit={handleCreateFarm}>
                <label className="field-label">
                  <span>Farm Plot Name (खेत का नाम)</span>
                  <input
                    value={newFarmForm.name}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. West Tube-Well Block"
                    required
                  />
                </label>

                <label className="field-label">
                  <span>Village / Survey Address (पता)</span>
                  <input
                    value={newFarmForm.address}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder="e.g. Survey No. 82, Nilokheri"
                  />
                </label>

                <label className="field-label">
                  <span>Area in Hectares (क्षेत्रफल ha)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newFarmForm.totalAreaHectares}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({
                        ...p,
                        totalAreaHectares: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="field-label">
                  <span>Soil Type (मिट्टी का प्रकार)</span>
                  <select
                    value={newFarmForm.soilType}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({ ...p, soilType: e.target.value }))
                    }
                  >
                    <option value="LOAMY">LOAMY (दोमट)</option>
                    <option value="CLAY">CLAY (चिकनी)</option>
                    <option value="SILTY">SILTY (गादयुक्त)</option>
                    <option value="SANDY">SANDY (बलुई)</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Irrigation Method (सिंचाई विधि)</span>
                  <select
                    value={newFarmForm.irrigationMethod}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({
                        ...p,
                        irrigationMethod: e.target.value,
                      }))
                    }
                  >
                    <option value="DRIP">DRIP (ड्रिप)</option>
                    <option value="SPRINKLER">SPRINKLER (स्प्रिंकलर)</option>
                    <option value="FURROW">FURROW (कूंड)</option>
                    <option value="FLOOD">FLOOD (सतही बाढ़)</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Primary Crop (फसल)</span>
                  <select
                    value={newFarmForm.cropType}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({ ...p, cropType: e.target.value }))
                    }
                  >
                    <option value="Wheat">Wheat (गेहूँ)</option>
                    <option value="Rice">Rice (धान)</option>
                    <option value="Sugarcane">Sugarcane (गन्ना)</option>
                    <option value="Cotton">Cotton (कपास)</option>
                    <option value="Maize">Maize (मक्का)</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Seed Variety (किस्म)</span>
                  <input
                    value={newFarmForm.variety}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({ ...p, variety: e.target.value }))
                    }
                    placeholder="e.g. HD-3086"
                  />
                </label>

                <label className="field-label">
                  <span>Initial Soil Moisture (% Vol)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={newFarmForm.soilMoisturePct}
                    onChange={(e) =>
                      setNewFarmForm((p) => ({
                        ...p,
                        soilMoisturePct: e.target.value,
                      }))
                    }
                  />
                </label>

                <div className="form-submit-row">
                  <button type="submit" className="btn-primary">
                    <Icon name="plus" size={16} />
                    <span>Save Farm Parcel &amp; Crop Cycle</span>
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {/* ROUTE 3: IRRIGATION PREDICTOR */}
        {activeRoute === 'irrigation' && (
          <>
            <IrrigationPrediction
              farms={demoState.farms}
              onNewRecommendation={handleAddPredictionToRecommendations}
            />

            <section className="jr-panel">
              <h2>Agronomic Water-Balance Reference (ET0 × Kc Formula)</h2>
              <p className="section-lead">
                JALRAKSHAK combines FastAPI ML predictions with physical crop
                evapotranspiration rules before advising irrigation depth.
              </p>
              <div className="table-scroll">
                <table className="jr-table">
                  <thead>
                    <tr>
                      <th>Growth Stage</th>
                      <th>Typical Crop Coefficient (Kc)</th>
                      <th>Moisture Stress Trigger</th>
                      <th>Decision Engine Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Germination / Emergence</td>
                      <td>0.40 – 0.55</td>
                      <td>&lt; 22% Vol</td>
                      <td>Light frequent irrigation for uniform stand</td>
                    </tr>
                    <tr>
                      <td>Vegetative / CRI</td>
                      <td>0.85 – 1.05</td>
                      <td>&lt; 20% Vol</td>
                      <td>Full root-zone replenishment (IRRIGATE)</td>
                    </tr>
                    <tr>
                      <td>Reproductive / Flowering</td>
                      <td>1.15 – 1.25</td>
                      <td>&lt; 24% Vol</td>
                      <td>Priority irrigation; zero moisture deficit</td>
                    </tr>
                    <tr>
                      <td>Maturity / Ripening</td>
                      <td>0.50 – 0.75</td>
                      <td>&lt; 15% Vol</td>
                      <td>Hold water prior to harvest (WAIT)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ROUTE 4: RECOMMENDATIONS */}
        {activeRoute === 'recommendations' && (
          <section className="jr-panel">
            <div className="panel-header-bar">
              <h2>Irrigation Recommendations &amp; Input Snapshots (सिंचाई सलाह सूची)</h2>
              <button
                type="button"
                className="btn-cobalt"
                onClick={() => navigateTo('irrigation')}
              >
                <Icon name="plus" size={15} />
                <span>Request New Prediction</span>
              </button>
            </div>
            <p className="section-lead">
              Every recommendation stores its immutable input snapshot (
              <code>GET /api/recommendations/:id/input-snapshot</code>). Water depth is
              shown only for <code>IRRIGATE</code> and <code>PARTIAL_IRRIGATION</code>.
            </p>

            <div className="table-scroll">
              <table className="jr-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Farm Plot</th>
                    <th>Recommendation</th>
                    <th>Water Depth</th>
                    <th>Confidence</th>
                    <th>Reasoning</th>
                    <th>Snapshot &amp; Execution</th>
                  </tr>
                </thead>
                <tbody>
                  {demoState.recommendations.map((rec) => {
                    const farm = demoState.farms.find((f) => f.id === rec.farmId);
                    const hasQty =
                      rec.irrigationAmountMm != null &&
                      (rec.recommendation === 'IRRIGATE' ||
                        rec.recommendation === 'PARTIAL_IRRIGATION');
                    const isExpanded = expandedSnapshotId === rec.id;

                    return (
                      <tr key={rec.id}>
                        <td>
                          <strong>{rec.code || 'REC'}</strong>
                        </td>
                        <td>{farm?.name || 'Plot'}</td>
                        <td>
                          <span className={`action-stamp ${rec.recommendation}`}>
                            {rec.recommendation}
                          </span>
                        </td>
                        <td>{hasQty ? `${rec.irrigationAmountMm} mm` : '—'}</td>
                        <td>
                          {rec.confidence > 0
                            ? `${(rec.confidence * 100).toFixed(0)}%`
                            : 'N/A'}
                        </td>
                        <td>
                          <p style={{ fontSize: '0.8rem' }}>{rec.reasoning}</p>
                          {isExpanded && rec.snapshot && (
                            <div
                              style={{
                                marginTop: 8,
                                padding: 10,
                                background: 'var(--bg-Subtle)',
                                borderRadius: 6,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.74rem',
                              }}
                            >
                              Snapshot: Moisture {rec.snapshot.soilMoisturePct}% (
                              {rec.snapshot.moistureAgeHours}h age) · Temp{' '}
                              {rec.snapshot.temperatureCelsius}°C · Rain 72h{' '}
                              {rec.snapshot.rainfallForecast72hMm} mm · ET0{' '}
                              {rec.snapshot.et0Mm} mm · Soil {rec.snapshot.soilType}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() =>
                                setExpandedSnapshotId(isExpanded ? null : rec.id)
                              }
                            >
                              {isExpanded ? 'Hide Snapshot' : 'Input Snapshot'}
                            </button>
                            {rec.recommendation !== 'INSUFFICIENT_DATA' &&
                              rec.status !== 'EXECUTED' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleExecuteRecommendation(rec.id)}
                                >
                                  Execute
                                </button>
                              )}
                            {rec.status === 'EXECUTED' && (
                              <span className="mono-tag ok-tag">EXECUTED</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ROUTE 5: WEATHER */}
        {activeRoute === 'weather' && (
          <>
            <section className="jr-panel">
              <div className="panel-header-bar">
                <h2>
                  Weather Observations &amp; 6-Hour Freshness Guard (मौसम अवलोकन)
                </h2>
                <span className={`mono-tag ${weatherFresh ? 'ok-tag' : 'warn-tag'}`}>
                  Latest Observation: {weatherAgeHours}h ago (
                  {weatherFresh ? 'FRESH <6h' : 'STALE >6h'})
                </span>
              </div>
              <p className="section-lead">
                Observations from <code>/api/weather/farm/:farmId/latest</code>. Readings
                older than 6 hours automatically trigger stale-data warnings.
              </p>

              <div className="table-scroll">
                <table className="jr-table">
                  <thead>
                    <tr>
                      <th>Observed Age</th>
                      <th>Temperature (°C)</th>
                      <th>Humidity (%)</th>
                      <th>Rainfall (mm)</th>
                      <th>Wind (km/h)</th>
                      <th>Solar (W/m²)</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoState.weatherObservations.map((obs) => (
                      <tr key={obs.id}>
                        <td>{getHoursAge(obs.observedAt)}h ago</td>
                        <td>{obs.temperatureCelsius} °C</td>
                        <td>{obs.humidityPercent}%</td>
                        <td>{obs.rainfallMm} mm</td>
                        <td>{obs.windSpeedKmh} km/h</td>
                        <td>{obs.solarRadiationWm2} W/m²</td>
                        <td>{obs.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="jr-panel">
              <h2>Log Field Weather Observation (POST /api/weather)</h2>
              <form className="jr-form-grid" onSubmit={handleCreateWeather}>
                <label className="field-label">
                  <span>Temperature (°C)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={weatherForm.temperatureCelsius}
                    onChange={(e) =>
                      setWeatherForm((p) => ({
                        ...p,
                        temperatureCelsius: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="field-label">
                  <span>Relative Humidity (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weatherForm.humidityPercent}
                    onChange={(e) =>
                      setWeatherForm((p) => ({
                        ...p,
                        humidityPercent: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="field-label">
                  <span>Observed Rainfall (mm)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weatherForm.rainfallMm}
                    onChange={(e) =>
                      setWeatherForm((p) => ({ ...p, rainfallMm: e.target.value }))
                    }
                    required
                  />
                </label>

                <label className="field-label">
                  <span>Wind Speed (km/h)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weatherForm.windSpeedKmh}
                    onChange={(e) =>
                      setWeatherForm((p) => ({
                        ...p,
                        windSpeedKmh: e.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <div className="form-submit-row">
                  <button type="submit" className="btn-primary">
                    Record Weather Observation
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {/* ROUTE 6: ANALYTICS */}
        {activeRoute === 'analytics' && (
          <section className="jr-panel">
            <div className="panel-header-bar">
              <h2>Seasonal Water-Balance &amp; Evapotranspiration Ledger (जल विश्लेषण)</h2>
              <span className="mono-tag warn-tag">
                DEMO / SIMULATED TELEMETRY — NO UNVALIDATED SAVINGS CLAIMS
              </span>
            </div>
            <p className="section-lead">
              Tracks applied irrigation depth (<code>mm</code>), effective rainfall, and
              estimated crop evapotranspiration (<code>ETc = ET0 × Kc</code>) per plot.
              Water savings or yield gains are never claimed without field pilot
              validation.
            </p>

            <div className="table-scroll">
              <table className="jr-table">
                <thead>
                  <tr>
                    <th>Plot &amp; Crop Cycle</th>
                    <th>Stage &amp; Kc</th>
                    <th>Logged Irrigation (mm)</th>
                    <th>Effective Rain (mm)</th>
                    <th>Estimated ETc Demand</th>
                    <th>Current Root Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>North Canal Field · Wheat (HD-2967)</td>
                    <td>Vegetative · Kc 1.05</td>
                    <td>120.0 mm</td>
                    <td>14.5 mm</td>
                    <td>160.9 mm</td>
                    <td>-26.4 mm (Deficit — IRRIGATE 25 mm)</td>
                  </tr>
                  <tr>
                    <td>East Lowland Paddy · Rice (PB-1509)</td>
                    <td>Reproductive · Kc 1.20</td>
                    <td>410.0 mm</td>
                    <td>185.0 mm</td>
                    <td>590.0 mm</td>
                    <td>+5.0 mm (Surplus — WAIT)</td>
                  </tr>
                  <tr>
                    <td>Canal Block B · Sugarcane (Co-0238)</td>
                    <td>Vegetative · Kc 1.15</td>
                    <td>620.0 mm</td>
                    <td>210.0 mm</td>
                    <td>846.0 mm</td>
                    <td>-16.0 mm (Moderate — PARTIAL 15 mm)</td>
                  </tr>
                  <tr>
                    <td>South Dryland Plot · Cotton (Bt)</td>
                    <td>Maturity · Kc 0.75</td>
                    <td>240.0 mm</td>
                    <td>110.0 mm</td>
                    <td>Unknown (Stale &gt;24h)</td>
                    <td>INSUFFICIENT_DATA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ROUTE 7: HISTORY & FEEDBACK */}
        {activeRoute === 'history' && (
          <>
            <section className="jr-panel">
              <h2>Farmer Execution History &amp; Outcome Feedback (सिंचाई इतिहास)</h2>
              <p className="section-lead">
                Records what action the farmer actually took and how the crop responded (
                <code>GET /api/feedback/my</code>).
              </p>

              <div className="table-scroll">
                <table className="jr-table">
                  <thead>
                    <tr>
                      <th>Recommendation</th>
                      <th>Plot</th>
                      <th>Action Taken</th>
                      <th>Water Applied</th>
                      <th>Rating</th>
                      <th>Farmer Field Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoState.feedbackList.map((fb) => (
                      <tr key={fb.id}>
                        <td>
                          <strong>{fb.recommendationCode}</strong>
                        </td>
                        <td>{fb.farmName}</td>
                        <td>{fb.actualOutcome}</td>
                        <td>{fb.appliedMm > 0 ? `${fb.appliedMm} mm` : '0 mm (Waited)'}</td>
                        <td>{fb.rating} / 5</td>
                        <td>{fb.feedbackText}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="jr-panel">
              <h2>Submit Field Outcome Feedback (POST /api/feedback)</h2>
              <form className="jr-form-grid" onSubmit={handleCreateFeedback}>
                <label className="field-label">
                  <span>Recommendation Reference</span>
                  <select
                    value={feedbackForm.recommendationId}
                    onChange={(e) =>
                      setFeedbackForm((p) => ({
                        ...p,
                        recommendationId: e.target.value,
                      }))
                    }
                  >
                    {demoState.recommendations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code || 'REC'} — {r.recommendation}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  <span>Actual Action Taken by Farmer</span>
                  <select
                    value={feedbackForm.actualOutcome}
                    onChange={(e) =>
                      setFeedbackForm((p) => ({
                        ...p,
                        actualOutcome: e.target.value,
                      }))
                    }
                  >
                    <option value="IRRIGATE">Full Irrigation Applied</option>
                    <option value="PARTIAL_IRRIGATION">Partial Irrigation Applied</option>
                    <option value="WAIT">Waited / Did Not Irrigate</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Water Applied (mm)</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={feedbackForm.appliedMm}
                    onChange={(e) =>
                      setFeedbackForm((p) => ({ ...p, appliedMm: e.target.value }))
                    }
                  />
                </label>

                <label className="field-label">
                  <span>Advisory Helpfulness Rating (1–5)</span>
                  <select
                    value={feedbackForm.rating}
                    onChange={(e) =>
                      setFeedbackForm((p) => ({ ...p, rating: e.target.value }))
                    }
                  >
                    <option value="5">5 — Accurate &amp; Helpful</option>
                    <option value="4">4 — Good Guidance</option>
                    <option value="3">3 — Neutral</option>
                    <option value="2">2 — Needed Adjustment</option>
                    <option value="1">1 — Inaccurate for Plot</option>
                  </select>
                </label>

                <label className="field-label" style={{ gridColumn: '1 / -1' }}>
                  <span>Field Outcome Notes (टिप्पणी)</span>
                  <input
                    value={feedbackForm.feedbackText}
                    onChange={(e) =>
                      setFeedbackForm((p) => ({
                        ...p,
                        feedbackText: e.target.value,
                      }))
                    }
                    placeholder="e.g. Soil moist to 25 cm root depth; good leaf turgor"
                  />
                </label>

                <div className="form-submit-row">
                  <button type="submit" className="btn-primary">
                    Save Farmer Feedback
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {/* ROUTE 8: ALERTS */}
        {activeRoute === 'alerts' && (
          <section className="jr-panel">
            <h2>Field Alerts, Stale-Data Guards &amp; Irrigation Windows (चेतावनी)</h2>
            <p className="section-lead">
              Automatic agronomy and data-freshness checks protecting farms from stale or
              unsupported irrigation quantities.
            </p>
            <div className="alert-list">
              <div className="alert-entry danger-entry">
                <div className="alert-entry-title">
                  <Icon name="alerts" size={16} />
                  <span>
                    South Dryland Plot — Soil Moisture Stale (29h age exceeds 24h limit)
                  </span>
                </div>
                <p>
                  System returned <code>INSUFFICIENT_DATA</code> and suppressed water
                  quantity. Record a fresh moisture reading in My Farms to unlock
                  prediction.
                </p>
              </div>

              <div className="alert-entry warn-entry">
                <div className="alert-entry-title">
                  <Icon name="irrigation" size={16} />
                  <span>
                    North Canal Field — Crown Root Initiation Moisture Deficit (15.0% Vol)
                  </span>
                </div>
                <p>
                  Apply 25.0 mm via Drip between 06:00–10:00 AM or after 05:00 PM to
                  avoid midday wind evaporation (12.4 km/h).
                </p>
              </div>

              <div className="alert-entry">
                <div className="alert-entry-title">
                  <Icon name="weather" size={16} />
                  <span>
                    East Lowland Paddy — 18.0 mm Rain Window Confirmed
                  </span>
                </div>
                <p>
                  Hold canal gate opening; forecast rain satisfies panicle flowering water
                  requirement.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ROUTE 9: SETTINGS & SYSTEM HEALTH */}
        {activeRoute === 'settings' && (
          <>
            <section className="jr-panel">
              <h2>Farmer Preferences &amp; Regional Settings (सेटिंग्स)</h2>
              <p className="section-lead">
                Configure display mode, bilingual Hindi/English agronomic labels, and
                measurement units.
              </p>
              <div className="jr-form-grid">
                <label className="field-label">
                  <span>Active Farmer Profile</span>
                  <input
                    readOnly
                    value={
                      currentUser
                        ? `${currentUser.fullName} (${currentUser.email})`
                        : 'Demo Farmer — Rameshwar Patel (+91 98765 43210)'
                    }
                  />
                </label>

                <label className="field-label">
                  <span>Bilingual Labels (English + हिंदी)</span>
                  <select
                    value={bilingual ? 'bilingual' : 'en'}
                    onChange={(e) => setBilingual(e.target.value === 'bilingual')}
                  >
                    <option value="bilingual">English + हिंदी (Bilingual)</option>
                    <option value="en">English Only</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Surface Contrast Theme</span>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="light">Sunlight Chart Stock (Outdoor Day)</option>
                    <option value="dark">Deccan Basalt Dark (Pre-Dawn / Night)</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="jr-panel">
              <h2>Backend, ML Service &amp; Database Diagnostics (/api/health)</h2>
              <div className="table-scroll">
                <table className="jr-table">
                  <thead>
                    <tr>
                      <th>Service Layer</th>
                      <th>Endpoint</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Spring Boot 3.3 API</td>
                      <td>
                        <code>http://localhost:8080/api/health</code>
                      </td>
                      <td>{health?.status || 'DEMO_FALLBACK'}</td>
                      <td>JWT Auth, Farm/Crop CRUD, Decision Engine</td>
                    </tr>
                    <tr>
                      <td>FastAPI ML Service</td>
                      <td>
                        <code>http://localhost:8000/health</code>
                      </td>
                      <td>{mlHealth?.status || 'DEMO_FALLBACK'}</td>
                      <td>Model: baseline-heuristic-v1 (/predict/irrigation)</td>
                    </tr>
                    <tr>
                      <td>PostgreSQL 16</td>
                      <td>
                        <code>localhost:5432/jalrakshak</code>
                      </td>
                      <td>{health?.checks?.database || 'LOCAL_STORAGE_DEMO'}</td>
                      <td>Flyway schema + immutable input snapshots</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {/* RIGHT RAIL: FIELD ALERTS & MULTI-CROP PLOT SWITCHER */}
      <aside className="jr-right-rail" aria-label="Field Alerts and Plot Switcher">
        <div>
          <h2>Field Alerts &amp; Freshness</h2>
          <div className="alert-list" style={{ marginTop: 10 }}>
            <div className="alert-entry danger-entry">
              <div className="alert-entry-title">
                <Icon name="alerts" size={15} />
                <span>Stale Moisture — South Plot</span>
              </div>
              <p>
                Reading is 29h old (&gt;24h limit). System returned{' '}
                <code>INSUFFICIENT_DATA</code> instead of guessing water depth.
              </p>
            </div>

            <div className="alert-entry warn-entry">
              <div className="alert-entry-title">
                <Icon name="weather" size={15} />
                <span>Irrigation Timing Note</span>
              </div>
              <p>
                Daytime wind 12.4 km/h; irrigate before 10:00 AM or after 05:00 PM to
                reduce evaporation loss.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2>Active Multi-Crop Plots</h2>
          <div className="plot-roster" style={{ marginTop: 10 }}>
            {demoState.farms.map((farm) => {
              const cycle = demoState.cropCycles.find((c) => c.farmId === farm.id);
              const iconName = CROP_ICON_MAP[cycle?.cropType] || 'wheat';
              const fresh = getHoursAge(farm.moistureObservedAt) <= 24;
              return (
                <button
                  key={farm.id}
                  type="button"
                  className={`plot-roster-item ${
                    selectedFarm?.id === farm.id ? 'selected-plot' : ''
                  }`}
                  onClick={() => setSelectedFarmId(farm.id)}
                >
                  <span className="plot-roster-name">
                    <Icon name={iconName} size={17} />
                    <span>
                      {farm.name} · {cycle?.cropType || 'Crop'}
                    </span>
                  </span>
                  <span className={`mono-tag ${fresh ? 'ok-tag' : 'danger-tag'}`}>
                    {fresh ? `${farm.soilMoisturePct}%` : 'Stale'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="jr-mobile-bottom-nav" aria-label="Mobile Quick Navigation">
        {[
          CORE_ROUTES[0],
          CORE_ROUTES[1],
          CORE_ROUTES[2],
          CORE_ROUTES[3],
          CORE_ROUTES[7],
        ].map((r) => (
          <button
            key={r.id}
            type="button"
            className={`jr-mobile-tab ${activeRoute === r.id ? 'active' : ''}`}
            onClick={() => navigateTo(r.id)}
          >
            <Icon name={r.icon} size={17} />
            <span>{r.label}</span>
          </button>
        ))}
      </nav>

      {/* TOP-RIGHT LOGIN / REGISTER DRAWER */}
      {authModalMode && (
        <div
          className="auth-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthModalMode(null);
          }}
        >
          <section
            className="auth-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={
              authModalMode === 'register'
                ? 'Register Farmer Account'
                : 'Farmer Login'
            }
          >
            <div className="panel-header-bar">
              <h2>
                {authModalMode === 'register' &&
                  (bilingual ? 'Register Farmer · किसान पंजीकरण' : 'Register Farmer')}
                {authModalMode === 'login' &&
                  (bilingual ? 'Farmer Login · किसान लॉगिन' : 'Farmer Login')}
                {authModalMode === 'forgot' && 'Reset Password'}
              </h2>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAuthModalMode(null)}
                aria-label="Close authentication dialog"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <p className="section-lead">
              {authModalMode === 'register'
                ? 'Create your KrishiSetu farmer profile to sync farm parcels and irrigation logs with PostgreSQL.'
                : 'Sign in with your registered email to access your farm recommendations.'}
            </p>

            <form
              onSubmit={handleAuthSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {authModalMode === 'register' && (
                <>
                  <label className="field-label">
                    <span>Full Name (पूरा नाम)</span>
                    <input
                      value={authForm.fullName}
                      onChange={(e) =>
                        setAuthForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      placeholder="e.g. Rameshwar Patel"
                      required
                    />
                  </label>
                  <label className="field-label">
                    <span>Mobile Number (मोबाइल नंबर)</span>
                    <input
                      value={authForm.phone}
                      onChange={(e) =>
                        setAuthForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      required
                    />
                  </label>
                </>
              )}

              <label className="field-label">
                <span>Email Address (ईमेल)</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="farmer@krishisetu.in"
                  required
                />
              </label>

              {authModalMode !== 'forgot' && (
                <label className="field-label">
                  <span>Password (पासवर्ड)</span>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) =>
                      setAuthForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Minimum 8 characters"
                    required
                  />
                </label>
              )}

              {authError && (
                <p className="prediction-error" role="alert">
                  {authError}
                </p>
              )}
              {authMessage && <p className="mono-tag ok-tag">{authMessage}</p>}

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 6,
                  flexWrap: 'wrap',
                }}
              >
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {authModalMode === 'register' && 'Create Farmer Account'}
                  {authModalMode === 'login' && 'Login to JALRAKSHAK'}
                  {authModalMode === 'forgot' && 'Send Reset Link'}
                </button>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setAuthModalMode('register')}
                  >
                    Switch to Register
                  </button>
                )}
                {authModalMode === 'register' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setAuthModalMode('login')}
                  >
                    Switch to Login
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
