import { Card, CardHeader, CardBody } from '../common';
import { formatDate } from '../../utils';

export function CropSoilOverview({ farm, cropCycle, soilReading, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-4">
          <p className="text-secondary">Unable to load farm details</p>
          <p className="text-sm text-muted mt-1">{error}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-primary">Crop Information</h3>
        </CardHeader>
        <CardBody>
          {cropCycle ? (
            <dl className="space-y-3">
              <CropSoilRow label="Crop" value={cropCycle.crop} />
              {cropCycle.variety && <CropSoilRow label="Variety" value={cropCycle.variety} />}
              <CropSoilRow label="Planting Date" value={formatDate(cropCycle.plantingDate, { hour: undefined, minute: undefined })} />
              <CropSoilRow label="Growth Stage" value={formatGrowthStage(cropCycle.growthStage)} />
              {cropCycle.expectedHarvestDate && (
                <CropSoilRow label="Expected Harvest" value={formatDate(cropCycle.expectedHarvestDate, { hour: undefined, minute: undefined })} />
              )}
              <CropSoilRow
                label="Days After Planting"
                value={cropCycle.plantingDate ? getDaysAfterPlanting(cropCycle.plantingDate) : '-'}
              />
              <CropSoilRow label="Status" value={cropCycle.status} />
            </dl>
          ) : (
            <div className="text-center py-4 text-secondary">
              <p>No active crop cycle</p>
              <p className="text-sm text-muted mt-1">Add a crop cycle to get recommendations</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-primary">Soil & Farm Details</h3>
        </CardHeader>
        <CardBody>
          {farm ? (
            <dl className="space-y-3">
              <CropSoilRow label="Farm Name" value={farm.name} />
              <CropSoilRow label="Area" value={`${farm.areaHectares} hectares`} />
              <CropSoilRow label="Soil Type" value={formatSoilType(farm.soilType)} />
              <CropSoilRow label="Irrigation Method" value={formatIrrigationMethod(farm.irrigationMethod)} />
              <CropSoilRow label="Water Source" value={formatWaterSource(farm.waterSource)} />
              {farm.district && <CropSoilRow label="Location" value={`${farm.district}, ${farm.state}`} />}
              {soilReading && (
                <>
                  <CropSoilRow
                    label="Soil Moisture"
                    value={`${soilReading.moisturePct}% at ${soilReading.depthCm}cm`}
                  />
                  <CropSoilRow
                    label="Reading Time"
                    value={formatDate(soilReading.recordedAt)}
                  />
                  <CropSoilRow label="Quality" value={soilReading.quality} />
                </>
              )}
            </dl>
          ) : (
            <div className="text-center py-4 text-secondary">
              <p>Farm details not available</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function CropSoilRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-primary text-right sm:text-left">{value || '-'}</dd>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 bg-pale-aqua rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-pale-aqua rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-pale-aqua rounded w-1/3 animate-pulse" />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function formatGrowthStage(stage) {
  if (!stage) return '-';
  return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSoilType(type) {
  if (!type) return '-';
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatIrrigationMethod(method) {
  if (!method) return '-';
  return method.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatWaterSource(source) {
  if (!source) return '-';
  return source.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDaysAfterPlanting(plantingDate) {
  const planting = new Date(plantingDate);
  const now = new Date();
  const diffMs = now - planting;
  const diffDays = Math.floor(diffMs / 86400000);
  return diffDays >= 0 ? `${diffDays} days` : 'Not planted yet';
}

export default CropSoilOverview;