# Dirty Reprojectors
Make quick and dirty projections to use in Mapbox GL.

## Usage

```
git clone git@github.com:developmentseed/dirty-reprojectors.git && cd dirty-reprojectors
npm install
mkdir -p output
cat data/us-states.geojson | ./reproject-geojson --projection albersUsa > output/us-states-albers.geojson
```
