var d3 = require('d3-geo')
var R = 6378137.0 // radius of Earth in meters

const supportedProjections = [
  'azimuthalEqualArea',
  'azimuthalEquidistant',
  'gnomonic',
  'orthographic',
  'stereographic',
  'albersUsa',
  'conicConformal',
  'conicEqualArea',
  'conicEquidistant',
  'equirectangular',
  'transverseMercator',
  'mercator'
]

const projections = module.exports

supportedProjections.forEach((name) => {
  const d3Name = 'geo' + name.slice(0, 1).toUpperCase() + name.slice(1)
  console.log(d3Name)
  projections[name] = d3[d3Name]().translate([0, 0]).scale(R)
})

