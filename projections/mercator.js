var d3 = require('d3-geo')
var R = 6378137.0 // radius of Earth in meters
module.exports = d3.geoMercator().translate([0, 0]).scale(R)
