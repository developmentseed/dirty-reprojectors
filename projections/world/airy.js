var d3 = require('d3-geo-projection')
var R = require('../../data/world-radius')
module.exports = d3.geoAiry().scale(R).radius(90).translate([0, 0])
