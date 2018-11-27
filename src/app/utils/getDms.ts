export function getDms(value: number): string {
  let valDeg, valMin, valSec, result;

  value = Math.abs(value);

  valDeg = Math.floor(value);
  result = valDeg + 'º';

  valMin = Math.floor((value - valDeg) * 60);
  result += valMin + '\'';

  valSec = Math.round((value - valDeg - valMin / 60) * 3600 * 1000) / 1000;
  result += valSec + '"';

  return result;
}
