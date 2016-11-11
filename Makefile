output/tiles/%.mbtiles: output/geojson/%.geojson
	mkdir -p $(dir $@)
	tippecanoe --projection EPSG:3857 \
		-f \
		--named-layer=boundary:$^ \
		--read-parallel \
		--no-polygon-splitting \
		--drop-rate=0 \
		--maximum-zoom=8 \
		--name=$^ \
		--output $@
