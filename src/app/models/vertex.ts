import { LatLng } from '@agm/core';

export class Vertex {
  latLng: LatLng;
  position: Number;
  constructor(latLng: LatLng, position: Number) {
    this.latLng = latLng;
    this.position = position;
  }
}
