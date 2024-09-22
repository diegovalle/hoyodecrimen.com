import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import {
  Map,
  NavigationControl,
  FullscreenControl,
  AttributionControl,
  GeolocateControl,
  Popup,
  Layer,
  Source,
} from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { useDebouncedValue } from "@mantine/hooks";
import pRetry from "p-retry";

import LoadingOverlay from "./LoadingOverlay";
import "../../css/loading.css";

import MAP_STYLE from "../MapStyles/3d";

import dotStyle from "../MapStyles/dot-map";
import hexPoints from "../../assets/hexpoints";

let hexPointsGeojson = {
  type: "FeatureCollection",
  name: "hextiles_points",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [],
};

for (let i = 0; i <= hexPoints.length; i += 3) {
  if (
    [
      5,
      7,
      16,
      21,
      27,
      28,
      32,
      33,
      34,
      35,
      37,
      38,
      39,
      42,
      43,
      46,
      48,
      51,
      53,
      54,
      55,
      57,
      58,
      59,
      63,
      72,
      75,
      81,
      82,
      83,
      94,
      102,
      110,
      117,
      119,
      126,
      127,
      131,
      140,
      141,
      144,
      148,
      153,
      158,
    ].indexOf(hexPoints[i + 2]) >= 0
  ) {
    continue;
  }
  hexPointsGeojson.features.push({
    type: "Feature",
    properties: { hex_idx: hexPoints[i + 2] },
    geometry: {
      type: "Point",
      coordinates: [hexPoints[i], hexPoints[i + 1]],
    },
  });
}

export const DotMap = forwardRef((props: Props, ref) => {
  const maxZoom = 19;
  const mapRef = useRef();
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const {
    checked,
    hash,
    selectedCrimes,
    hourEndValue,
    dateEndValue,
    openLoading,
    closeLoading,
  } = props;

  const [count, setCount] = useState(0);
  const [hoverInfo, setHoverInfo] = useState(null);
  //const [zoom, setZoom] = useState(null);
  const [refreshClusters, setRefreshClusters] = useState(0);
  const [optionsChanged, setOptionsChanged] = useState(false);
  const [mapOptions, setMapOptions] = useState(null);
  const [satelliteOptions, setSatelliteOptions] = useState(undefined);
  const [viewState, setViewState] = useState(null);
  const [geoJson, setGeoJson] = useState(null);
  const [sectoresLayerProps, setSectoresLayerProps] = useState({});
  const [clusterCount, setClusterCount] = useState({});
  const [debounced] = useDebouncedValue(selectedCrimes, 400);
  const [debouncedDate] = useDebouncedValue(dateEndValue, 0);
  const [debouncedHour] = useDebouncedValue(hourEndValue, 0);

  const abortControllerRef = useRef<AbortController>(null);
  const zoom = useRef(null);

  const meta = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          satelliteMap
          osmTilesUrl
          apiUrl
          spriteUrl
          glyphsUrl
        }
      }
    }
  `);
  const [vectorTiles, setVectorTiles] = useState(
    `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/{z}/{x}/{y}?crimes=HOMICIDIO%20DOLOSO`
  );

  const onHover = useCallback((event) => {
    const crime = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      crimeName: crime && crime.properties.crime,
      date: crime && crime.properties.date,
      hour: crime && crime.properties.hour,
    });
  }, []);

  const onZoomEnd = useCallback(
    (event) => {
      //console.log(event);
      zoom.current = event.viewState.zoom;
      if (event.viewState.zoom < 14 && optionsChanged) {
        setOptionsChanged(false);
        setRefreshClusters((prevValue) => prevValue + 1);
      }
    },
    [optionsChanged]
  );

  // const onMoveEnd = useCallback((event) => {
  //   //console.log(event);

  //   console.log(event.viewState.zoom);
  // }, []);

  // const onClick = useCallback((event) => {
  //   if (event.features.length === 0) {
  //     console.log(event);
  //   }
  // }, []);

  const dots = {
    id: "crime-points",
    source: "crimes",
    "source-layer": "layer0",
    type: "circle",
    paint: {
      "circle-stroke-color": "#111111",
      "circle-stroke-width": 1,
      "circle-radius": {
        stops: [
          [0, 0.1],
          [5, 0.1],
          [8, 5],
        ],
      },
      "circle-color": [
        "match",
        ["get", "crime"],
        "HOMICIDIO DOLOSO",
        "#e41a1c",
        "ROBO DE VEHICULO AUTOMOTOR C.V.",
        "#984ea3",
        "ROBO DE VEHICULO AUTOMOTOR S.V.",
        "#41ab5d",
        "ROBO A TRANSEUNTE C.V.",
        "#377eb8",
        "LESIONES POR ARMA DE FUEGO",
        "#fe9929",
        /* other */ "#777",
      ],
    },
  };

  useEffect(() => {
    let mapStyle = {
      version: 8,
      //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
      sprite: meta.site.siteMetadata.spriteUrl,
      glyphs: meta.site.siteMetadata.glyphsUrl,
      sources: {
        openmaptiles: {
          type: "vector",
          maxzoom: 14, // tiles only generated up to zoom 14 and over-zoomed if exceeded
          //url: "pmtiles:///maps/mxc.pmtiles",
          tiles: [meta.site.siteMetadata.osmTilesUrl],
          bounds: [
            -101.53041872493706, 18.44955123891872, -96.73034794295089,
            20.45739366199904,
          ],
        },
        /* crimes: {
          type: "vector",
          // maxzoom: 12, // tiles only generated up to zoom 12 and over-zoomed if exceeded
          minzoom: 15, // don't display a tile at all below zoom 15. Underzooming never occurs.
          tiles: [
            "${meta.site.siteMetadata.apiUrl}/api/v1/tiles/{z}/{x}/{y}?crimes=" +
              `${
                selectedCrimes
                  ? selectedCrimes.map((x) => encodeURIComponent(x)).join(",")
                  : ""
              }`,
            //"https://d.gusc.cartocdn.com/diegovalle/api/v1/map/d458a1019c59cb20fca2522573c1b3d7:1715652617421/{z}/{x}/{y}.mvt",
          ],
          //tiles: ["https://diegovalle.github.io/testh/homicides.pmtiles"],
          bounds: [
            -99.36792388992502, 19.04525200179835, 98.93730363466278,
            19.5957096676085,
          ],
        }, */
        satellite: {
          type: "raster",
          tiles: [meta.site.siteMetadata.satelliteMap],
          bounds: [
            -101.53041872493706, 18.44955123891872, -96.73034794295089,
            20.45739366199904,
          ],
        },
      },
      layers: MAP_STYLE.layers,
    };
    mapStyle.layers = mapStyle.layers.filter(function (item) {
      return !(
        dotStyle.reduce((prev, cur) => prev || cur.id === item.id, false) ||
        item.id === "place_label_city" ||
        //item.id === "road_trunk_primary" ||
        item.id === "road_major_label"
      );
    });

    if (!mapOptions) {
      mapStyle.layers.push(...dotStyle);
      setMapOptions({ ...mapStyle });
    }

    if (!pmTilesReady) {
      const protocol = new pmtiles.Protocol();
      maplibregl.addProtocol("pmtiles", protocol.tile);
      setPmTilesReady(true);
    }
  }, [
    mapOptions,
    meta.site.siteMetadata.glyphsUrl,
    meta.site.siteMetadata.osmTilesUrl,
    meta.site.siteMetadata.satelliteMap,
    meta.site.siteMetadata.spriteUrl,
    pmTilesReady,
  ]);

  useEffect(() => {
    let geo;
    const buildUrl = (base) => {
      let url = base;
      if (
        ref.current === null &&
        debouncedDate === null &&
        debouncedHour === null
      )
        return url;
      if (debouncedDate || debouncedHour) url += "?";
      if (debouncedDate)
        url += `start_date=${ref.current[debouncedDate[0]]}&end_date=${
          ref.current[debouncedDate[1]]
        }`;
      if (debouncedDate && debouncedHour) url += "&";
      if (debouncedHour)
        url += `start_hour=${debouncedHour[0] % 24}&end_hour=${
          debouncedHour[1] % 24
        }`;
      return url;
    };
    if (!mapOptions) return;
    if (typeof structuredClone === "undefined")
      geo = JSON.parse(JSON.stringify(hexPointsGeojson));
    else geo = structuredClone(hexPointsGeojson);

    let vectorUrl =
      `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/crimes/` +
      `${
        debounced ? debounced.map((x) => encodeURIComponent(x)).join(",") : ""
      }/{z}/{x}/{y}`;

    setVectorTiles(buildUrl(vectorUrl));

    if (!debounced.length) {
      setSectoresLayerProps({
        id: "sectores-point",
        type: "circle",
        layout: {
          visibility: "none",
        },
      });
      setClusterCount({
        id: "cluster-count",
        type: "symbol",
        // source: "sectores",
        layout: {
          visibility: "none",
        },
      });
      return;
    }

    let url =
      `${meta.site.siteMetadata.apiUrl}/api/v1/hextiles/crimes/` +
      `${
        debounced ? debounced.map((x) => encodeURIComponent(x)).join(",") : ""
      }` +
      "/top/aggregate";
    url = buildUrl(url);

    const fetchAggregate = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response;
    };

    if (zoom.current < 14) {
      //setRefreshClusters(false);
      setOptionsChanged(false);

      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const newAbortController = new AbortController();

      abortControllerRef.current = newAbortController;

      if (count) openLoading();
      const fetchRequestJSON = pRetry(() => fetchAggregate(url), {
        signal: abortControllerRef.current.signal,
        retries: 2,
      });
      Promise.all([fetchRequestJSON])
        .then(async (responses) => {
          const [responseJSON] = responses;
          try {
            let [crimes] = await Promise.all([responseJSON.json()]);
            crimes = crimes.rows.filter(
              (item) => item.sector !== "NO ESPECIFICADO"
            );
            for (let i = 0; i < geo.features.length; i++)
              geo.features[i].properties["count"] = 0;
            for (let i = 0; i < geo.features.length; i++)
              for (let j = 0; j < crimes.length; j++) {
                if (geo.features[i].properties.hex_idx === crimes[j].hex_idx) {
                  geo.features[i].properties["count"] = crimes[j].count;
                }
              }
            setGeoJson(geo);
            let counts = geo.features.map((f) =>
              f.properties.count ? f.properties.count : 0
            );
            let min = 0,
              max = 0;
            min = Math.min(...counts);
            max = Math.max(...counts);
            //setRange([max, min]);
            setSectoresLayerProps({
              id: "sectores-point",
              type: "circle",
              //source: "sectores",

              paint: {
                "circle-color": "#f1f075",
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "count"],
                  0,
                  0,
                  min ? min : 1,
                  max === 1 ? 10 : 3,
                  max > 1 ? max : 2,
                  25,
                ],
                "circle-stroke-width": [
                  "case",
                  [">=", ["get", "count"], 1],
                  1,
                  0,
                ],
                "circle-stroke-color": "#000",
              },
              maxzoom: 14,
            });
            setClusterCount({
              id: "cluster-count",
              type: "symbol",
              // source: "sectores",
              layout: {
                "text-field": "{count}",
                "text-font": ["Roboto Condensed Regular"],
                "text-size": [
                  "step",
                  ["get", "count"],
                  0,
                  Math.floor(max / 2 - 1),
                  0,
                  Math.ceil(max / 2),
                  14,
                ],
              },
              maxzoom: 14,
              paint: {
                "text-color": "#040404",
              },
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (count) closeLoading();
          setCount((count) => count + 1);
        });
    } else {
      setOptionsChanged(true);
    }
    return () => {
      abortControllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debounced,
    mapOptions,
    debouncedDate,
    debouncedHour,
    refreshClusters,
    meta.site.siteMetadata.apiUrl,
    openLoading,
    closeLoading,
  ]);

  useEffect(() => {
    let args = hash.split("/");
    let zoom, lat, lon;
    if (args.length === 4) {
      try {
        zoom = parseFloat(args[3]);
        lat = parseFloat(args[1].replace("#", ""));
        lon = parseFloat(args[2]);
      } catch {
        return;
      }
      if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
        setViewState({
          bounds: [
            -99.3500061035156, 19.1226825714111, -98.9468765258789,
            19.581169128418,
          ],
        });
      } else {
        setViewState({
          latitude: lat,
          longitude: lon,
          zoom: zoom,
          bearing: 0,
          pitch: 0,
        });
      }
    } else {
      setViewState({
        bounds: [
          -99.3500061035156, 19.1226825714111, -98.9468765258789,
          19.581169128418,
        ],
      });
    }
  }, [hash]);

  useEffect(() => {
    if (mapOptions) {
      if (checked === "OpenStreetMap") {
        mapOptions.layers.forEach((item) => {
          if (
            item?.source === "openmaptiles" &&
            item?.id !== "place_label_city" &&
            item?.id !== "road_trunk_primary" &&
            item?.id !== "road_major_label" &&
            item?.id !== "ste" &&
            item?.id !== "metro" &&
            item?.id !== "metrobus"
          )
            item.layout = { visibility: "visible" };
        });
        setSatelliteOptions({
          id: "satellite",
          type: "raster",
          source: "satellite",
          "source-layer": "layer0",
          layout: {
            visibility: "none",
          },
        });
      } else {
        setSatelliteOptions({
          id: "satellite",
          type: "raster",
          source: "satellite",
          "source-layer": "layer0",
          layout: {
            visibility: "visible",
          },
        });
        mapOptions.layers.forEach((item) => {
          if (item?.source === "openmaptiles" && item?.id !== "cdmx-mask")
            item.layout = { visibility: "none" };
        });
      }
    }
  }, [checked, mapOptions]);

  const crimePopUp =
    hoverInfo && hoverInfo.crimeName ? (
      <div>
        <b>{hoverInfo.crimeName}</b>
        <br />
        {hoverInfo.date}
        <br />
        {hoverInfo.hour}
      </div>
    ) : (
      ""
    );

  const toggleAnimation = (map, state: boolean) => {
    if (map) {
      let i;
      for (i = 0; i < map.current["_controls"].length; i++)
        if (typeof map.current["_controls"][i].toggleLoading === "function")
          break;
      if (i < map.current["_controls"].length)
        state
          ? map.current["_controls"][i].turnOn()
          : map.current["_controls"][i].turnOff();
    }
  };

  const handleData = (e) => {
    if (e.sourceId === "crimes") {
      toggleAnimation(mapRef, true);
      //console.log(e);
    }
  };

  const handleIdle = (e) => {
    if (mapRef.current.areTilesLoaded()) toggleAnimation(mapRef, false);
  };

  return viewState ? (
    <Map
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      maxBounds={[-100.421, 18.468, -97.901, 20.182]}
      mapLib={maplibregl}
      mapStyle={
        pmTilesReady ? (mapOptions ? mapOptions : undefined) : undefined
      }
      attributionControl={false}
      styleDiffing={true}
      maxZoom={maxZoom}
      // onClick={onClick}
      onMouseMove={onHover}
      onZoomEnd={onZoomEnd}
      // onMoveEnd={onMoveEnd}
      onSourceData={handleData}
      onIdle={handleIdle}
      interactiveLayerIds={["crime-points"]}
      initialViewState={viewState}
    >
      {satelliteOptions ? (
        <Layer beforeId="cdmx-mask" {...satelliteOptions} />
      ) : null}

      {pmTilesReady ? (
        dots ? (
          <Source
            id="crimes"
            type="vector"
            maxzoom={14}
            minzoom={14}
            tiles={[vectorTiles]}
            bounds={[
              -99.36792388992502, 19.04525200179835, 98.93730363466278,
              19.5957096676085,
            ]}
          >
            <Layer {...dots} />
          </Source>
        ) : null
      ) : null}
      {geoJson && sectoresLayerProps && clusterCount ? (
        <Source
          id="sectores"
          type="geojson"
          data={geoJson}
          //cluster={true}
          //clusterMaxZoom={14}
          //clusterRadius={50}
        >
          <Layer {...sectoresLayerProps} />
          <Layer {...clusterCount} />
        </Source>
      ) : null}
      <NavigationControl showCompass={true} visualizePitch={true} />
      <LoadingOverlay />
      <FullscreenControl />
      <AttributionControl
        compact={true}
        customAttribution='© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://sites.research.google/open-buildings/#download">Google</a>/<a href="https://planetarycomputer.microsoft.com/dataset/ms-buildings">Microsoft</a> Open Buildings'
      />
      <GeolocateControl
        showAccuracyCircle={false}
        onError={(e) => {
          console.log(e);
        }}
        onOutOfMaxBounds={(e) => {
          console.log(e);
        }}
        trackUserLocation={false}
      />
      {crimePopUp && (
        <Popup
          key={hoverInfo.longitude + hoverInfo.latitude}
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[0, -10]}
          closeButton={false}
          className="crime-info"
        >
          {crimePopUp}
        </Popup>
      )}
    </Map>
  ) : null;
});

export default React.memo(DotMap);
