const test = require('tap').test
const fs = require('fs')
const path = require('path')
const reproject = require('../')
const projections = require('../projections')

test('named projections', function (t) {
  for (const name in projections) {
    const inputFile = path.join(__dirname, './fixtures/utah.input.geojson')
    const outputFile = path.join(__dirname, `./fixtures/utah.output.${name}.geojson`)

    t.test(name, function (t) {
      const input = JSON.parse(fs.readFileSync(inputFile))
      reproject({
        forward: name,
        reverse: 'mercator',
        projections: projections
      }, input.geometry.coordinates)
      if (process.env.UPDATE) {
        fs.writeFileSync(outputFile, JSON.stringify(input, null, 2))
      }
      const expected = JSON.parse(fs.readFileSync(outputFile))
      t.same(input, expected)
      t.end()
    })
  }

  t.end()
})
