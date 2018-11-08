import { LatLng } from '@agm/core';
import { Point } from '@agm/core/services/google-maps-types';
import { CellPosition } from './cell-position';

export class Cell {
  shape: CellType;
  center: LatLng;
  vertices: LatLng[];
  position: CellPosition;

  constructor(shape: CellType, cellCenter: LatLng, vertices: LatLng[], position: CellPosition) {
    this.shape = shape;
    this.center = cellCenter;
    this.vertices = vertices;
    this.position = position;
  }
}

export enum CellType {
  Hexagonal,
  Square
}
