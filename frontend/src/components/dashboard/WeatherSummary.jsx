import { Card, CardHeader, CardBody } from '../common';
import { formatDate, formatNumber, classNames } from '../../utils';

export function WeatherSummary({ current, forecast, loading, error }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-primary">Weather</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
                <div className="h-4 bg-border-light rounded w-3/4 mb-2" />
                <div className="h-8 bg-border-light rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-primary">Weather</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4 text-secondary">
            <p>Unable to load weather data</p>
            <p className="text-sm text-muted mt-1">{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!current) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-primary">Weather</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4 text-secondary">
            <p>No weather data available</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const weatherAge = current.observedAt ? getDataAge(current.observedAt) : null;
  const isStale = weatherAge && weatherAge > 24;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="font-semibold text-primary">Weather Summary</h3>
        <div className={classNames('flex items-center gap-2 text-xs', isStale ? 'text-warning' : 'text-success')}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isStale ? 'var(--color-warning)' : 'var(--color-success)' }} aria-hidden="true" />
          <span>{isStale ? 'Data may be stale' : 'Data is fresh'}</span>
          {weatherAge && <span>({weatherAge}h ago)</span>}
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <WeatherMetric
            label="Temperature"
            value={`${formatNumber(current.data?.temperatureC)}°C`}
            icon={<TemperatureIcon />}
          />
          <WeatherMetric
            label="Humidity"
            value={`${formatNumber(current.data?.humidityPct)}%`}
            icon={<HumidityIcon />}
          />
          <WeatherMetric
            label="Wind"
            value={`${formatNumber(current.data?.windSpeedMs)} m/s`}
            icon={<WindIcon />}
          />
          <WeatherMetric
            label="Rainfall (24h)"
            value={`${formatNumber(current.data?.rainfallMm)} mm`}
            icon={<RainIcon />}
          />
        </div>

        {forecast && forecast.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-primary mb-3">72-Hour Forecast</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="text-left text-muted border-b border-border-light">
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Temp</th>
                    <th className="pb-2 font-medium">Rain</th>
                    <th className="pb-2 font-medium">Humidity</th>
                    <th className="pb-2 font-medium">ET₀</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.slice(0, 12).map((item, index) => (
                    <tr key={index} className="border-b border-border-light/50 hover:bg-pale-aqua/50">
                      <td className="py-2">{formatDate(item.validAt, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</td>
                      <td className="py-2">{formatNumber(item.temperatureC)}°C</td>
                      <td className="py-2">{formatNumber(item.rainfallMm)} mm</td>
                      <td className="py-2">{formatNumber(item.humidityPct)}%</td>
                      <td className="py-2">{item.et0Mm ? formatNumber(item.et0Mm) + ' mm' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted mt-4">
          Source: {current.source || 'Weather API'} · Last updated: {formatDate(current.observedAt)}
        </p>
      </CardBody>
    </Card>
  );
}

function WeatherMetric({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-pale-aqua)' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary" style={{ backgroundColor: 'var(--color-white)' }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-semibold text-base">{value}</p>
      </div>
    </div>
  );
}

function TemperatureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M12 9a4 4 0 0 0-2 7.5" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 14 19H2" />
    </svg>
  );
}

function RainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <line x1="12" y1="6" x2="12" y2="22" />
      <path d="M17 14v5" />
      <path d="M7 14v5" />
      <path d="M19 14v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function getDataAge(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  return Math.floor(diffMs / 3600000);
}

export default WeatherSummary;