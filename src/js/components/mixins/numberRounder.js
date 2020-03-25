export default function(value, zerosCount = 0) {
  zerosCount = zerosCount < 0 ? 0 : zerosCount;
  zerosCount = zerosCount > 5 ? 5 : zerosCount;

  var value2 = Math.round (value);
  if (zerosCount > 0) {
    var divider = 1.0;
    var i = 0;
    for (i = 0; i < zerosCount; i++)
      divider = divider * 10.0;
    value2 = Math.round (value * divider) / divider;
  }

  return value2;
}
