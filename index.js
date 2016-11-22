
module.exports = reproject

/**
 * Reprojects the given geometry coordinate array _in place_, with
 * unprojectable points or degenerate geometries removed. If both
 * `options.forward` and `options.reverse` are supplied, then `forward` is
 * performed first.
 *
 * @param {Object} options
 * @param {Function|string} [options.forward] The forward projection to use.
 * @param {Function|string} [options.reverse] The reverse projection to use.
 * @param {Object} [options.projections] A map of named projections to use.  If provided, then string values of `options.forward` or `options.reverse` will be used as keys to look up the projection function in `options.projections`.  For an extensive list provided by d3-geo-projection, use `require('dirty-reprojectors/projections')`.
 * @param {Array} coordinates
 */
function reproject (options, coordinates) {
  if (coordinates.length === 0) { return [] }
  if (Array.isArray(coordinates[0])) {
    coordinates.forEach((coord) => reproject(options, coord))

    var isRing = coordinates[0].length && !Array.isArray(coordinates[0][0])
    for (var i = coordinates.length - 1; i >= 0; i--) {
      var c = coordinates[i]
      if (isRing) {
        if (typeof c[0] !== 'number' || typeof c[1] !== 'number') {
          coordinates.splice(i, 1)
        } else if (i > 1 && coordinates[i - 1][0] === c[0] && coordinates[i - 1][1] === c[1]) {
          coordinates.splice(i, 1)
        }
      } else if (c.length === 0) {
        coordinates.splice(i, 1)
      } else if (typeof c[0][0] === 'number' && c.length === 2) {
        // after reprojecting a ring, we might have dropped redundant points
        // and left ourselves with just a two-coordinate, degenerate ring (i.e.
        // just the identical starting/ending coord).  If so, drop it.
        coordinates.splice(i, 1)
      }
    }

    return
  }

  if (options.forward) {
    let proj = options.forward
    if (typeof proj === 'string') {
      proj = options.projections[proj]
    }
    forward(proj, coordinates)
  }

  if (options.reverse) {
    let proj = options.reverse
    if (typeof proj === 'string') {
      proj = options.projections[proj]
    }
    reverse(proj, coordinates)
  }
}

function forward (proj, coordinates) {
  var projected = proj(coordinates)
  if (!projected) {
    coordinates[0] = coordinates[1] = null
    return false
  }
  coordinates[0] = projected[0]
  coordinates[1] = -projected[1]
  return true
}

function reverse (proj, projected) {
  projected[1] = -projected[1]
  var reversed = proj.invert(projected)
  if (!reversed) {
    projected[0] = projected[1] = null
    return false
  }
  projected[0] = reversed[0]
  projected[1] = reversed[1]
  return true
}
