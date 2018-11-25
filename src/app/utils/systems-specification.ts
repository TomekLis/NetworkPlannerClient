import { CellType } from '../models/cell';

const systemSpecification = {
  900: {
    frequency: {
      min: 890,
      max: 915
    },
    channels: {
      min: 1,
      max: 124
    }
  },
  1800: {
    frequency: {
      min: 1710,
      max: 1785
    },
    channels: {
      min: 512,
      max: 855
    }
  }
};

const transmissionTypes = {
  voice50Loc: {
    requiredCi: 9
  },
  voice50Marg: {
    requiredCi: 12
  },
  voice75Loc: {
    requiredCi: 19
  },
  DataCS1: {
    requiredCi: 6.5
  },
  DataCS2: {
    requiredCi: 10.5
  },
  DataCS3: {
    requiredCi: 12.0
  },
  DataCS4: {
    requiredCi: 21
  }
};

enum AreaTypes {
  LargeCity,
  SmallCity,
  RularArea
}

const hexagonalDistanceFromCenter = size => size * Math.sqrt(3);
const hexagonalFillingCellNumber = level => level;
const squareDistanceFromCenterFunction = size => 2 * size;
const squareDistanceBetweenCells = size => size * Math.sqrt(2);
const squareFillingCellNumber = level => 2 + (level * 2 - 2);

export const PolygonCharacteristics = {
  Hexagonal: {
    sidesNumber: 6,
    cellType: CellType.Hexagonal,
    offset: 30,
    step: 60,
    fillingOffset: 120,
    distanceFromCenterFunction: hexagonalDistanceFromCenter,
    distanceBetweenCells: hexagonalDistanceFromCenter,
    fillingCellNumber: hexagonalFillingCellNumber
  },
  Square: {
    sidesNumber: 4,
    cellType: CellType.Square,
    offset: 45,
    step: 90,
    fillingOffset: 135,
    distanceFromCenterFunction: squareDistanceFromCenterFunction,
    distanceBetweenCells: squareDistanceBetweenCells,
    fillingCellNumber: squareFillingCellNumber
  }
};

export { systemSpecification, transmissionTypes, AreaTypes };
