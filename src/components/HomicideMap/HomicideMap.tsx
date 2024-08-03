import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { scaleSequential } from "d3-scale";
import { interpolatePlasma } from "d3-scale-chromatic";
import {
  max,
  min,
  sortedIndexOf,
  zip,
} from "lodash-es";
import {
  Map,
  NavigationControl,
  FullscreenControl,
  AttributionControl,
  GeolocateControl,
  Popup,
} from "react-map-gl";
import { Text } from "@mantine/core";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";

import MAP_STYLE from "../MapStyles/3d";
import layers from "protomaps-themes-base";

import homicideStyle from "../MapStyles/homicideStyle";

const meta = useStaticQuery(graphql`
  query {
    site {
      siteMetadata {
        satelliteMap
        osmTilesUrl
      }
    }
  }
`);
const mapStyle = {
  version: 8,
  //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
  sprite: "https://openmaptiles.github.io/positron-gl-style/sprite",
  glyphs:
    "/tiles/fonts/{fontstack}/{range}.pbf",
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
    homicides: {
      type: "vector",
      maxzoom: 12, // tiles only generated up to zoom 12 and over-zoomed if exceeded
      minzoom: 13, // don't display a tile at all below zoom 13. Underzooming never occurs.
      url: "pmtiles:///maps/selected-crimes.pmtiles",
      //tiles: ["https://diegovalle.github.io/testh/homicides.pmtiles"],
      bounds: [
        -99.36792388992502, 19.04525200179835, 98.93730363466278,
        19.5957096676085,
      ],
    },
  },
  layers: MAP_STYLE.layers,
};

export const HomicideMap = (props: Props) => {
  const maxZoom = 19;
  const [smoothRates, setSmoothRates] = useState(null);
  const [mapColor, setMapColor] = useState(null);
  const [pmTilesReady, setPmTilesReady] = useState(false);

  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);

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

  const onClick = useCallback(
    (event) => {
      const cuadrante = event.features && event.features[0];
      let idx, rate;
      idx =
        smoothRates &&
        cuadrante &&
        sortedIndexOf(smoothRates.Nomenclatu, cuadrante.properties.cuadrante);
      rate = smoothRates.pred_rate[idx];
      setClickInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        alcaldia: cuadrante && cuadrante.properties.alcaldia,
        sector: cuadrante && cuadrante.properties.sector,
        no_cuadrante:
          cuadrante && /\.(\d+)$/g.exec(cuadrante.properties.cuadrante)[1], // return index 1 because we only care about the group
        smoothRate: cuadrante && rate,
        x: event.point.x,
        y: event.point.y,
      });
    },
    [smoothRates]
  );

  const selectedCrime =
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
  const selectedCuadrant =
    clickInfo && clickInfo.sector ? (
      <div>
        <b>{clickInfo.smoothRate}</b>
        <br />
        {clickInfo.alcaldia}
        <br />
        {clickInfo.sector}
      </div>
    ) : (
      ""
    );
  //const filter = useMemo(() => ['in', 'COUNTY', selectedCrime], [selectedCrime]);

  useEffect(() => {
    const fetchRequestJSON = fetch("/json/smooth-map-hom.json");
    Promise.all([fetchRequestJSON])
      .then(async (responses) => {
        const [responseJSON] = responses;
        try {
          const [rates] = await Promise.all([responseJSON.json()]);
          setSmoothRates(rates[0]);
          var myColorScale = scaleSequential()
            .domain([min(rates[0].pred_rate), max(rates[0].pred_rate)])
            .interpolator(interpolatePlasma);

          let colors = zip(
            rates[0].Nomenclatu,
            rates[0].pred_rate.map((x) => myColorScale(x))
          );

          mapStyle.layers = mapStyle.layers.filter(function (item) {
            return !(
              homicideStyle.reduce(
                (prev, cur) => prev || cur.id == item.id,
                false
              ) ||
              item.id === "place_label_city" ||
              item.id === "road_trunk_primary" ||
              item.id === "road_major_label"
            );
          });
          homicideStyle.forEach((element) => {
            if (element.id === "cuadrantes-fill")
              element.paint["fill-color"].stops = colors;
            return element;
          });
          mapStyle.layers.push(...homicideStyle);
          setMapColor(() => myColorScale);

          const protocol = new pmtiles.Protocol();
          maplibregl.addProtocol("pmtiles", protocol.tile);
          setPmTilesReady(true);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Map
      initialViewState={{
        bounds: [
          -99.3500061035156, 19.1226825714111, -98.9468765258789,
          19.581169128418,
        ],
        //zoom: 10,
        //pitch: 45,
      }}
      maxBounds={[-100.421, 18.468, -97.901, 20.182]}
      mapLib={maplibregl}
      style={{ height: "400px", width: "100%" }}
      mapStyle={pmTilesReady ? (mapStyle ? mapStyle : undefined) : undefined}
      attributionControl={false}
      maxZoom={maxZoom}
      onClick={onClick}
      onMouseMove={onHover}
      interactiveLayerIds={["cuadrantes-fill", "unclustered-point"]}
    >
      <NavigationControl visualizePitch={true} />
      <FullscreenControl />
      <AttributionControl
        compact={true}
        customAttribution='© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://sites.research.google/open-buildings/#download">Google</a>/<a href="https://planetarycomputer.microsoft.com/dataset/ms-buildings">Microsoft</a> Open Buildings'
      />
      <GeolocateControl showAccuracyCircle={false} />
      {selectedCuadrant && (
        <Popup
          key={clickInfo.longitude + clickInfo.latitude}
          longitude={clickInfo.longitude}
          latitude={clickInfo.latitude}
          offset={[0, -10]}
          closeButton={true}
          className="rate-info"
          //closeOnClick={false}
        >
          <Text fw={500} size="md">
            Tasa Alisada:{" "}
            <Text component="span" c="red" inherit>
              {clickInfo.smoothRate}
            </Text>
          </Text>
          <b>Alcaldía</b>: {clickInfo.alcaldia}
          <br />
          <b>Sector</b>: {clickInfo.sector}
          <br />
          <b>No. Cuadrante</b>: {clickInfo.no_cuadrante}
          <br />
          <br />
        </Popup>
      )}
      {selectedCrime && (
        <Popup
          key={hoverInfo.longitude + hoverInfo.latitude}
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[0, -10]}
          closeButton={false}
          className="crime-info"
        >
          {selectedCrime}
        </Popup>
      )}
    </Map>
  );
};

export default HomicideMap;
