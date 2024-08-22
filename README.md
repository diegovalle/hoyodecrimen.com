nvm use v20.14.0

website:
netlify
cloudflare
kinsta
render

tiles:
surge
render
netlify
cloudflare

## To extract tiles:

# Join tiles
tile-join --force -o "mbtiles/mxc_osm.mbtiles" mbtiles/cuadrantes.mbtiles mbtiles/sectores.mbtiles mbtiles/cdmx-mask-z10.mbtiles mbtiles/cdmx-mask-z14.mbtiles mbtiles/maptiler-osm-2020-02-10-v3.11-mexico_mexico-city.mbtiles

# Get rid of osm buildings
tile-join -j '{ "building": ["any"] }' -f -o mbtiles/mxc_no_buildings.mbtiles mbtiles/mxc_osm.mbtiles

# Add OSM-Google-Microsoft buildings
tile-join --force -o "mbtiles/mxc.mbtiles" mbtiles/mxc_no_buildings.mbtiles mbtiles/buildings_cdmx.mbtiles
rm mbtiles/mxc_osm.mbtiles 
pmtiles convert mbtiles/mxc.mbtiles mbtiles/mxc.pmtiles 

mb-util --image_format=pbf mbtiles/mxc.mbtiles mxc
cd  mxc
gzip -d -r -S .pbf *  #decompress tiles
find . -type f -exec mv '{}' '{}'.html \; && mv metadata.json.html metadata.json
```
tippecanoe -o buildings.mbtiles --drop-densest-as-needed -Z12 -z12 -C './filters/limit-tiles-to-bbox -99.370651 19.147114 -98.926392 19.602488 $*' 9641080902293389312.geojson

ogr2ogr -f GeoJSON land.json -clipsrc -99.370651 19.147114 -98.926392 19.602488 building.geojson

ogr2ogr -spat -99.370651 19.147114 -98.926392 19.602488  building_bounded.geojson  building.geojson


```


## Todo

* /mapa/ Save map type and dates
* Add page with under-reporting
* Month over month difference (current month − same month previous year)

