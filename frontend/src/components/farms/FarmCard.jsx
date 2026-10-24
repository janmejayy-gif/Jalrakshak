import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from '../common';
import { formatSoilType, formatIrrigationMethod, formatWaterSource, classNames } from '../../utils';

export function FarmCard({ farm, activeCropCycle, onSelect, onEdit, onDelete, selected }) {
  return (
    <Card
      variant={selected ? 'elevated' : 'default'}
      className={classNames('transition-all', selected && 'border-primary border-2')}
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-primary">{farm.name}</h3>
          <p className="text-sm text-muted mt-1">
            {farm.district && farm.state ? `${farm.district}, ${farm.state}` : 'Location not specified'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeCropCycle && (
            <Badge variant={activeCropCycle.status === 'ACTIVE' ? 'wait' : 'default'} className="capitalize">
              {activeCropCycle.crop}
            </Badge>
          )}
          {selected && (
            <Badge variant="confidence-high">Active</Badge>
          )}
        </div>
      </CardHeader>

      <CardBody>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Area</dt>
            <dd className="font-medium">{farm.areaHectares} ha</dd>
          </div>
          <div>
            <dt className="text-muted">Soil Type</dt>
            <dd className="font-medium">{formatSoilType(farm.soilType)}</dd>
          </div>
          <div>
            <dt className="text-muted">Irrigation</dt>
            <dd className="font-medium">{formatIrrigationMethod(farm.irrigationMethod)}</dd>
          </div>
          <div>
            <dt className="text-muted">Water Source</dt>
            <dd className="font-medium">{formatWaterSource(farm.waterSource)}</dd>
          </div>
        </dl>

        {activeCropCycle && (
          <div className="mt-4 pt-4 border-t border-border-light space-y-2">
            <p className="text-sm font-medium text-primary">Active Crop Cycle</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted">Variety: </span>
                <span className="font-medium">{activeCropCycle.variety || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-muted">Stage: </span>
                <span className="font-medium capitalize">{activeCropCycle.growthStage?.replace(/_/g, ' ').toLowerCase()}</span>
              </div>
              <div>
                <span className="text-muted">Planted: </span>
                <span className="font-medium">{activeCropCycle.plantingDate ? new Date(activeCropCycle.plantingDate).toLocaleDateString('en-IN') : '-'}</span>
              </div>
              <div>
                <span className="text-muted">Status: </span>
                <span className="font-medium capitalize">{activeCropCycle.status?.toLowerCase()}</span>
              </div>
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter>
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onSelect?.(farm.farmId)}>
              View Details
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit?.(farm.farmId)}>
              Edit
            </Button>
          </div>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(farm.farmId)}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default FarmCard;