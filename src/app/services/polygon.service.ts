import { Injectable } from '@angular/core';
import { AgmPolygon, LatLng } from '@agm/core';
import * as jsts from 'jsts';
import { CellPosition } from '../models/cell-position';
import { Vertex } from '../models/vertex';

declare const google: any;
@Injectable({
  providedIn: 'root'
})
export class PolygonService {
  geometryFactory = new jsts.geom.GeometryFactory();

  constructor() {}

  async getPolygonPoints(agmPolygon: AgmPolygon) {
    const polygon = await (agmPolygon as any)._polygonManager._polygons.get(
      agmPolygon
    );
    const points: LatLng[] = [];
    polygon.getPath().forEach(coordinate => {
      points.push(new google.maps.LatLng(coordinate.lat(), coordinate.lng()));
    });
    return points;
  }

  containsLocation(
    mainAreaVertices: LatLng[],
    cellVertices: LatLng[]
  ): boolean {
    const mainAreaPolygon = this.createJstsPolygon(mainAreaVertices);
    const cellPolygon = this.createJstsPolygon(cellVertices);
    return mainAreaPolygon.intersects(cellPolygon);
  }
  private createJstsPolygon(polygonVertices: LatLng[]) {
    const coords = polygonVertices.map(polygonVertex => {
      return new jsts.geom.Coordinate(polygonVertex.lat(), polygonVertex.lng());
    });

    coords.push(
      new jsts.geom.Coordinate(
        polygonVertices[0].lat(),
        polygonVertices[0].lng()
      )
    );
    const shell = this.geometryFactory.createLinearRing(coords);
    return this.geometryFactory.createPolygon(shell);
  }

  generatePolygon(
    polygonCharacteristics: any,
    centerPoint: LatLng,
    size: number,
    offset: number,
    fillingLevel?: number,
    cellSize?: number,
    fillingFunction?: (
      startingPoint: LatLng,
      currentLevel: number,
      fillingOffset: number,
      cellSize: number,
      sphericalApi: any,
      polygonCharacteristics: any,
      side: number
    ) => { geoLocation: LatLng; position: CellPosition }[]
  ): { geoLocation: LatLng; position: CellPosition }[] {
    const sphericalApi = google.maps.geometry.spherical;
    let polygonVertices: { geoLocation: LatLng; position: CellPosition }[] = [];
    let side = 0;
    for (
      let heading = polygonCharacteristics.offset + offset;
      heading < 360 + offset;
      heading += polygonCharacteristics.step
    ) {
      const newPoint: LatLng = sphericalApi.computeOffset(
        centerPoint,
        size,
        heading
      );

      polygonVertices.push({
        geoLocation: newPoint,
        position: {
          depth: 0,
          level: fillingLevel,
          side: side
        }
      });
      side++;

      if (fillingFunction) {
        const fillingPoints = fillingFunction(
          newPoint,
          fillingLevel,
          heading + polygonCharacteristics.fillingOffset,
          cellSize,
          sphericalApi,
          polygonCharacteristics,
          side
        );
        polygonVertices = polygonVertices.concat(fillingPoints);
      }
    }
    return polygonVertices;
  }
}
