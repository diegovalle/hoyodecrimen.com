import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useState, useEffect, useCallback, useRef } from "react";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { max, min, sortedIndexOf, zip } from "lodash-es";
import Map, {
  NavigationControl,
  FullscreenControl,
  AttributionControl,
  GeolocateControl,
  Popup,
  Layer,
  Source,
} from "react-map-gl";
import { Text } from "@mantine/core";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";

import { useTranslation } from "gatsby-plugin-react-i18next";
import MAP_STYLE from "../MapStyles/3d";

import sectorStyle from "../MapStyles/sectores-map";
import { round1, comma, YYYYmmddToDate15 } from "../utils";

export const SectoresMap = (props: Props) => {
  const maxZoom = 19;
  const mapRef = useRef();
  const { t } = useTranslation();
  const [sectorData, setSectorData] = useState(null);
  const [pmTilesReady, setPmTilesReady] = useState(false);

  const [clickInfo, setClickInfo] = useState(null);
  const [fillLayerOptions, setFillLayerOptions] = useState(undefined);
  const [mapOptions, setMapOptions] = useState(null);
  const [sectorId, setSectorId] = useState(null);
  const [crimeDots, setCrimeDots] = useState(null);

  const meta = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          satelliteMap
          osmTilesUrl
          apiUrl
        }
      }
    }
  `);

  const [vectorTiles, setVectorTiles] = useState(
    `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/dates/{z}/{x}/{y}?crimes=HOMICIDIO%20DOLOSO`
  );
  const mapStyle = {
    version: 8,
    //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
    sprite: "/tiles/sprites/sprite",
    glyphs: "/tiles/fonts/{fontstack}/{range}.pbf",
    sources: {
      openmaptiles: {
        promoteId: "sector",
        type: "vector",
        maxzoom: 14, // tiles only generated up to zoom 14 and over-zoomed if exceeded
        //url: "pmtiles:///maps/mxc.pmtiles",
        tiles: [meta.site.siteMetadata.osmTilesUrl],
        bounds: [
          -101.53041872493706, 18.44955123891872, -96.73034794295089,
          20.45739366199904,
        ],
      },
    },
    layers: MAP_STYLE.layers,
  };

  const onHover = useCallback((event) => {
    if (mapRef) {
      // mapRef.current.setFeatureState(
      //   { source: "openmaptiles", id: event.features[0].id, sourceLayer: "sectores" },
      //   { hover: true }
      // );
    }
    //console.log(event);
    // const crime = event.features && event.features[0];
    // setHoverInfo({
    //   longitude: event.lngLat.lng,
    //   latitude: event.lngLat.lat,
    //   crimeName: crime && crime.properties.crime,
    //   date: crime && crime.properties.date,
    //   hour: crime && crime.properties.hour,
    // });
  }, []);

  const onClick = useCallback(
    (event) => {
      if (event.features.length === 0) {
        if (sectorId)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: sectorId,
            sourceLayer: "sectores",
          });
        props.setSelectedSector("df");
        return;
      }
      if (mapRef) {
        if (sectorId)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: sectorId,
            sourceLayer: "sectores",
          });
        setSectorId(event.features[0].id);
        mapRef.current.setFeatureState(
          {
            source: "openmaptiles",
            id: event.features[0].id,
            sourceLayer: "sectores",
          },
          { hover: true }
        );
      }

      const sector = event.features && event.features[0];
      let idx;
      idx =
        sectorData &&
        sector &&
        sortedIndexOf(
          sectorData.map((x) => x.sector),
          sector.properties.sector
        );
      let obj = sectorData[idx];
      props.setSelectedSector(sector.properties.sector);
      setClickInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        sector: sector && sector.properties.sector,
        rate: sector && obj.rate,
        population: sector && obj.population,
        x: event.point.x,
        y: event.point.y,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectorData, sectorId]
  );

  const lines = {
    id: "2",
    type: "line",
    source: "openmaptiles",
    "source-layer": "sectores",
    layout: {},
    hover: true,
    paint: {
      "line-color": "#111",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        1,
      ],
    },
  };

  useEffect(() => {
    let crimeDotsNoCrime = {
      id: "crime-points",
      type: "circle",
      source: "crimes",
      "source-layer": "layer0",
      // filter: [
      //   "all",
      //   ["==", "crime", "HOMICIDIO DOLOSO"],
      //   ["!has", "point_count"],
      // ],
      paint: {
        "circle-opacity": 0.7,
        "circle-stroke-color": "#111111",
        "circle-stroke-width": 0.6,
        "circle-radius": {
          base: 1.75,
          stops: [
            [12, 3],
            [13, 4],
            [14, 5],
            [16, 6],
            [18, 7],
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
    let fillLayer = {
      id: "sectores-fill",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "sectores",
      layout: {},
      hover: false,
      paint: {
        //"fill-outline-color": "rgba(0,0,0,1)",
        "fill-opacity": [
          "interpolate",
          ["exponential", 0.8],
          ["zoom"],
          13,
          0.7,
          16,
          0,
        ],
        "fill-color": {
          property: "sector",
          type: "categorical",
          stops: "",
        },
      },
    };
    const url =
      `${meta.site.siteMetadata.apiUrl}/api/v1/sectores/all/crimes/` +
      props.selectedCrime.replaceAll(" ", "%20") +
      `/period`;

    const fetchRequestJSON = fetch(url);
    Promise.all([fetchRequestJSON])
      .then(async (responses) => {
        const [responseJSON] = responses;
        try {
          let [data] = await Promise.all([responseJSON.json()]);

          if (props?.setLastDate) {
            let dateStart = YYYYmmddToDate15(data.rows[0].start_date);
            let dateStrStart = [
              dateStart.toLocaleString(props.lang, { month: "long" }),
              dateStart.getFullYear(),
            ].join(" ");
            let dateEnd = YYYYmmddToDate15(data.rows[0].end_date);
            let dateStrEnd = [
              dateEnd.toLocaleString(props.lang, { month: "long" }),
              dateEnd.getFullYear(),
            ].join(" ");
            props.setLastDate(dateStrStart + " " + t("to") + " " + dateStrEnd);
          }

          let rates = data.rows;
          setSectorData(rates);
          rates.forEach(
            (item, i) =>
              (item["rate"] = (item.count / item.population) * 100000)
          );
          var myColorScale = scaleSequential()
            .domain([
              min(
                rates.map((r) => (r.sector === "NO ESPECIFICADO" ? 0 : r.rate))
              ),
              max(
                rates.map((r) => (r.sector === "NO ESPECIFICADO" ? 0 : r.rate))
              ),
            ])
            .interpolator(interpolateYlOrRd);

          let colors = zip(
            rates.map((item) => item.sector),
            rates.map((item) => myColorScale(item.rate))
          );

          /* crimeDotsNoCrime.filter = [
            "all",
            ["==", "crime", props.selectedCrime],
            // ["!has", "point_count"],
          ]; */
          setCrimeDots({
            ...crimeDotsNoCrime,
          });
          setVectorTiles(
            `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/dates/{z}/{x}/{y}?crimes=` +
              encodeURIComponent(props.selectedCrime)
          );
          if (!mapOptions) {
            mapStyle.layers = mapStyle.layers.filter(function (item) {
              return !(
                sectorStyle.reduce(
                  (prev, cur) => prev || cur.id === item.id,
                  false
                ) ||
                item.id === "place_label_city" ||
                //item.id === "road_trunk_primary" ||
                item.id === "road_major_label"
              );
            });
            mapStyle.layers.push(...sectorStyle);
            // mapStyle.layers.forEach((element) => {
            //   if (element.id === "sectores-fill")
            //     element.paint["fill-color"].stops = colors;
            //   return element;
            // });

            setMapOptions({ ...mapStyle });
          }

          fillLayer.paint["fill-color"].stops = [...colors];
          setFillLayerOptions({ ...fillLayer });

          if (!pmTilesReady) {
            const protocol = new pmtiles.Protocol();
            maplibregl.addProtocol("pmtiles", protocol.tile);
            setPmTilesReady(true);
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.selectedCrime, pmTilesReady, mapOptions]);

  return (
    <Map
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
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
      mapStyle={
        pmTilesReady ? (mapOptions ? mapOptions : undefined) : undefined
      }
      attributionControl={false}
      styleDiffing={false}
      maxZoom={maxZoom}
      onClick={onClick}
      onMouseMove={onHover}
      interactiveLayerIds={["sectores-fill"]}
    >
      {pmTilesReady ? (
        fillLayerOptions ? (
          <Layer {...fillLayerOptions} />
        ) : undefined
      ) : null}
      {pmTilesReady ? (
        crimeDots ? (
          <Source
            id="crimes"
            type="vector"
            maxzoom={12}
            minzoom={13}
            tiles={[vectorTiles]}
            bounds={[
              -99.36792388992502, 19.04525200179835, 98.93730363466278,
              19.5957096676085,
            ]}
          >
            <Layer {...crimeDots} />
          </Source>
        ) : null
      ) : null}
      <Layer {...lines} />
      <NavigationControl showCompass={false} />
      <FullscreenControl />
      <AttributionControl
        compact={true}
        customAttribution='© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://sites.research.google/open-buildings/#download">Google</a>/<a href="https://planetarycomputer.microsoft.com/dataset/ms-buildings">Microsoft</a> Open Buildings'
      />
      <GeolocateControl showAccuracyCircle={false} />
      {clickInfo && (
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
            Tasa:{" "}
            <Text component="span" c="red" inherit>
              {round1(clickInfo.rate)}
            </Text>
          </Text>
          <b>Sector</b>: {clickInfo.sector}
          <br />
          <b>Población</b>: {comma(clickInfo.population)}
          <br />
        </Popup>
      )}
    </Map>
  );
};

export default React.memo(SectoresMap);
