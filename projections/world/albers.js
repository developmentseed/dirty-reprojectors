var d3 = require('d3-geo')
var R = require('../../data/world-radius')
module.exports = d3.geoAlbers().scale(R).translate([0, 0]).rotate([0, 0])
