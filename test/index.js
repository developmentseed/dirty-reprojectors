const test = require('tap').test
const fs = require('fs')
const path = require('path')
const reproject = require('../')
const projections = require('../projections')

test('each named projection', {skip: true}, function (t) {
  for (const name in projections) {
    const inputFile = path.join(__dirname, './fixtures/utah.input.geojson')
    const outputFile = path.join(__dirname, `./fixtures/utah.output.${name}.geojson`)

    t.test(name, function (t) {
      const input = JSON.parse(fs.readFileSync(inputFile))
      const result = reproject({
        forward: name,
        reverse: 'mercator',
        projections: projections
      }, input.geometry)

      const output = Object.assign({}, input, { geometry: result })

      if (process.env.UPDATE) {
        fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))
      }
      const expected = JSON.parse(fs.readFileSync(outputFile))

      t.same(output, expected)
      t.end()
    })
  }

  t.end()
})

test('dateline wrapping', function (t) {
  const input = JSON.parse(fs.readFileSync(path.join(__dirname, './fixtures/wrap.input.geojson')))
  const result = reproject({
    forward: 'mercator',
    reverse: 'mercator',
    projections: projections
  }, input.geometry)

  const coordinates = result.coordinates[0]

  for (var i = 0; i < coordinates.length - 1; i++) {
    var delta = Math.abs(coordinates[i][0] - coordinates[i + 1][0])
    t.ok(delta <= 90, 'coordinates are not weirdly wrapped after fwd+reverse projection')
  }

  t.end()
})
