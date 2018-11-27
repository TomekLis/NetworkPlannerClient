import { Pipe, PipeTransform } from '@angular/core';
import { getDms } from './getDms';

@Pipe({
  name: 'lngCoordinate'
})
export class LngCoordinatePipe implements PipeTransform {
  transform(value: number): string {
    let latResult = value >= 0 ? 'E ' : 'W ';

    latResult += getDms(value);
    return latResult;
  }
}
