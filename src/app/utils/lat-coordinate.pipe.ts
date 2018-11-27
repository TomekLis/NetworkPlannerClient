import { Pipe, PipeTransform } from '@angular/core';
import { getDms } from './getDms';
@Pipe({
  name: 'latCoordinate'
})
export class LatCoordinatePipe implements PipeTransform {
  transform(value: number): string {
    let latResult = value >= 0 ? 'N ' : 'S ';

    latResult += getDms(value);
    return latResult;
  }
}
