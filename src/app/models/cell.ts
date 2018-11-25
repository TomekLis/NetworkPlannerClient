import { LatLng } from '@agm/core';
import { CellPosition } from './cell-position';
import { Vertex } from './vertex';

export class Cell {
  shape: CellType;
  center: LatLng;
  vertices: Vertex[];
  position: CellPosition;
  id: number;
  vertexPaths: LatLng[];

  constructor(
    shape: CellType,
    cellCenter: LatLng,
    vertices: Vertex[],
    position: CellPosition
  ) {
    this.shape = shape;
    this.center = cellCenter;
    this.vertices = vertices;
    this.position = position;
    this.vertexPaths = [];
  }
}

export enum CellType {
  Hexagonal,
  Square
}
