import { Grid } from './Grid';
import { LatLng } from '@agm/core';

export class Plan {
  grid: Grid = {
    cells: []
  };
  cirf: number;
  channelReuseDistance: number;
  cellRange: number;
  clusterSize: number;
  requiredCi: number;
  requiredTransmissionQuality: number;
  systemCapacity: number;
  eirp: number;
  longitude: number;
  latitude: number;
  antennaGain: number;
  cableLoss: number;
  transmitterPower: number;
  channelMax: number;
  channelMin: number;
  channelReuseDistnace: number;
  constructor() {}
}
