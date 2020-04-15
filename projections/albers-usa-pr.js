var d3 = require('d3-geo')
var R = 6378137.0 // radius of Earth in meters
//module.exports = geoAlbersUsaPr().translate([0, 0]).scale(R)
module.exports = geoAlbersUsaPr

function multiplex(streams) {
  const n = streams.length;
  return {
    point(x, y) { for (const s of streams) s.point(x, y); },
    sphere() { for (const s of streams) s.sphere(); },
    lineStart() { for (const s of streams) s.lineStart(); },
    lineEnd() { for (const s of streams) s.lineEnd(); },
    polygonStart() { for (const s of streams) s.polygonStart(); },
    polygonEnd() { for (const s of streams) s.polygonEnd(); }
  };
}

function geoAlbersUsaPr() {
  let epsilon = 0.000001
  var cache,
      cacheStream,
      lower48 = d3.geoAlbers(), lower48Point,
      alaska = d3.geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
      alaskaPoint,
      hawaii = d3.geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
      hawaiiPoint,
      puertoRico = d3.geoConicEqualArea().rotate([66, 0]).center([0, 18]).parallels([8, 18]),
      puertoRicoPoint,
      guamMariana = d3.geoConicEqualArea().rotate([-145, 0]).center([0, 16]).parallels([10, 20]),
      guamMarianaPoint,
      americanSamoa = d3.geoConicEqualArea().rotate([170, 0]).center([0, -14]).parallels([-14, 0]),
      americanSamoaPoint,
      point,
      pointStream = {point: function(x, y) { point = [x, y]; }};

  function albersUsaPr(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (lower48Point.point(x, y), point)
        || (alaskaPoint.point(x, y), point)
        || (hawaiiPoint.point(x, y), point)
        || (puertoRicoPoint.point(x, y), point)
        || (guamMarianaPoint.point(x, y), point)
        || (americanSamoaPoint.point(x, y), point);

  }

  albersUsaPr.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
        : y >= 0.204 && y < 0.234 && x >= 0.300 && x < 0.380 ? puertoRico
        : y >= 0.050 && y < 0.204 && x >= 0.340 && x < 0.380 ? guamMariana
        : y >= 0.160 && y < 0.204 && x >= 0.280 && x < 0.340 ? americanSamoa
        : lower48).invert(coordinates);
  };

  albersUsaPr.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream), puertoRico.stream(stream), guamMariana.stream(stream),americanSamoa.stream(stream)]);
  };

  albersUsaPr.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_), puertoRico.precision(_), guamMariana.precision(_), americanSamoa.precision(_);
    return reset();
  };

  albersUsaPr.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_), puertoRico.scale(_), guamMariana.scale(_), americanSamoa.scale(_);
    return albersUsaPr.translate(lower48.translate());
  };

  albersUsaPr.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
        .stream(pointStream);

    alaskaPoint = alaska
        .translate([x - 0.310 * k, y + 0.201 * k])
        .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    hawaiiPoint = hawaii
        .translate([x - 0.205 * k, y + 0.212 * k])
        .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    puertoRicoPoint = puertoRico
        .translate([x + 0.335 * k, y + 0.224 * k])
        .clipExtent([[x + 0.300 * k, y + 0.204 * k], [x + 0.380 * k, y + 0.234 * k]])
        .stream(pointStream).point;
    
    guamMarianaPoint = guamMariana
        .translate([x + 0.360 * k, y + 0.140 * k])
        .clipExtent([[x + 0.340 * k, y + 0.050 * k], [x + 0.380 * k, y + 0.204 * k]])
        .stream(pointStream).point;
    
    americanSamoaPoint = americanSamoa
        .translate([x + 0.315 * k, y + 0.180 * k])
        .clipExtent([[x + 0.280 * k, y + 0.160 * k], [x + 0.340 * k, y + 0.204 * k]])
        .stream(pointStream).point;

    return reset();
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsaPr;
  }

  return albersUsaPr.scale(1070);
}