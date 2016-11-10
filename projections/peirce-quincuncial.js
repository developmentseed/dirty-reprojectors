var d3 = require('d3-geo-projection')
var R = 6378137.0 // radius of Earth in meters
module.exports = d3.geoPeirceQuincuncial().scale(R).translate([0, 0])
