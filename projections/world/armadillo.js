var d3 = require('d3-geo-projection')
var R = require('../../data/world-radius')
module.exports = d3.geoArmadillo().scale(R).translate([0, 0])
