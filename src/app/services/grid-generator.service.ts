import { Injectable } from '@angular/core';
import { LatLng, LatLngBounds } from '@agm/core';
import { Cell, CellType } from '../models/cell';
import { Grid } from '../models/Grid';
import { PolygonService } from './polygon.service';
import { CellPosition } from '../models/cell-position';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GridGeneratorService {
  sphericalApi: any;
  constructor(private polygonService: PolygonService) {}

  public async GenerateGrid(
    gridType: any,
    areaVertices: LatLng[],
    cellSize: number
  ): Promise<Grid> {
    this.sphericalApi = google.maps.geometry.spherical;
    const polygonBounds = new google.maps.LatLngBounds();

    areaVertices.forEach(polygonCoord => {
      polygonBounds.extend(polygonCoord);
    });

    const areaCenter = this.getAreaCenter(polygonBounds);

    const farthestPoint = this.getFarthestPoint(areaVertices, areaCenter);

    const numOfLevels = this.getNumberOfLevels(
      farthestPoint.distance,
      cellSize,
      gridType
    );

    const centerPoints = this.getCenterPoints(
      numOfLevels,
      areaCenter,
      cellSize,
      farthestPoint.heading,
      gridType
    );

    const grid: Grid = new Grid();
    centerPoints.forEach(async centerPoint => {
      const newPolygonCell = await this.generateCell(
        centerPoint.geoLocation,
        cellSize,
        farthestPoint.heading + gridType.offset,
        gridType,
        centerPoint.position
      );
      if (
        this.polygonService.containsLocation(
          areaVertices,
          newPolygonCell.vertices
        )
      ) {
        grid.cells.push(newPolygonCell);
      }
    });
    return grid;
  }

  async generateCell(
    centerPoint: LatLng,
    size: number,
    offset: number,
    polygonCharacteristics: any,
    position: CellPosition
  ): Promise<Cell> {
    const vertices = this.polygonService
      .generatePolygon(
        polygonCharacteristics,
        centerPoint,
        size,
        offset +
          (polygonCharacteristics.cellType === CellType.Square
            ? polygonCharacteristics.offset
            : 0)
      )
      .map(cell => cell.geoLocation);
    const polygonCell: Cell = new Cell(
      polygonCharacteristics.cellType,
      centerPoint,
      vertices,
      position
    );
    return polygonCell;
  }

  private getNumberOfLevels(
    furthestPointDistance: number,
    cellSize: number,
    polygonCharacteristics: any
  ): number {
    return Math.ceil(
      furthestPointDistance /
        (polygonCharacteristics.distanceFromCenterFunction(cellSize) / 2)
    );
  }

  private getFarthestPoint(
    areaVertices: LatLng[],
    areaCenter: LatLng
  ): { farthestPoint: LatLng; distance: number; heading: number } {
    let farthestPointDistance;
    const farthestPoint = areaVertices.reduce(
      (prev, current): LatLng => {
        const prevDistance = google.maps.geometry.spherical.computeDistanceBetween(
          areaCenter,
          prev
        );
        const currentDistance = google.maps.geometry.spherical.computeDistanceBetween(
          areaCenter,
          current
        );
        if (prevDistance > currentDistance) {
          farthestPointDistance = prevDistance;
          return prev;
        } else {
          farthestPointDistance = currentDistance;
          return current;
        }
      }
    );
    const heading = google.maps.geometry.spherical.computeHeading(
      areaCenter,
      farthestPoint
    );
    return {
      farthestPoint: farthestPoint,
      distance: farthestPointDistance,
      heading: heading
    };
  }

  private getAreaCenter(polygonBounds: LatLngBounds): LatLng {
    return polygonBounds.getCenter();
  }

  private getCenterPoints(
    numOfLevels: number,
    centerPoint: LatLng,
    size: number,
    offset: number,
    polygonCharacteristics: any
  ): { geoLocation: LatLng; position: CellPosition }[] {
    let cellCenters: { geoLocation: LatLng; position: CellPosition }[] = [];

    cellCenters.push({
      geoLocation: centerPoint,
      position: {
        depth: 0,
        level: 0,
        side: 0
      }
    });

    if (numOfLevels <= 1) {
      return cellCenters;
    }

    let currentLevel = 1;

    while (currentLevel < numOfLevels) {
      cellCenters = cellCenters.concat(
        this.polygonService.generatePolygon(
          polygonCharacteristics,
          centerPoint,
          polygonCharacteristics.distanceFromCenterFunction(size) *
            currentLevel,
          offset,
          currentLevel,
          size,
          this.fillingFunction
        )
      );
      currentLevel++;
    }
    return cellCenters;
  }

  private fillingFunction(
    startingPoint: LatLng,
    currentLevel: number,
    fillingOffset: number,
    cellSize: number,
    sphericalApi: any,
    polygonCharacteristics: any,
    side: number
  ): { geoLocation: LatLng; position: CellPosition }[] {
    const fillingCellCenters: {
      geoLocation: LatLng;
      position: CellPosition;
    }[] = [];
    let newPoint = startingPoint;
    for (
      let index = 1;
      index < polygonCharacteristics.fillingCellNumber(currentLevel);
      index++
    ) {
      newPoint = sphericalApi.computeOffset(
        newPoint,
        polygonCharacteristics.distanceBetweenCells(cellSize),
        fillingOffset
      );
      if (newPoint.lat() && newPoint.lng()) {
        fillingCellCenters.push({
          geoLocation: newPoint,
          position: {
            depth: index,
            level: currentLevel,
            side: side
          }
        });
      }
    }
    return fillingCellCenters;
  }
}
