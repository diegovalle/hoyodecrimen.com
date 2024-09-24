import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { max, min, zip } from "lodash-es";
import { Trans } from "gatsby-plugin-react-i18next";
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

import MAP_STYLE from "../MapStyles/3d";

import { useTranslation } from "gatsby-plugin-react-i18next";
import crimeStyle from "../MapStyles/cuadrantes-map";
import { YYYYmmddToDate15, getMonthYear } from "../utils";

export const SectoresMap = (props: Props) => {
  const { setSelectedCuadrante } = props;
  const maxZoom = 19;
  const mapRef = useRef();
  const { t } = useTranslation();
  const [pmTilesReady, setPmTilesReady] = useState(false);

  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);
  const [fillLayerOptions, setFillLayerOptions] = useState(undefined);
  const [mapOptions, setMapOptions] = useState(null);
  const crimeData = useRef(null);
  const cuadranteId = useRef(null);
  const [crimeDots, setCrimeDots] = useState(null);

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
    `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/dates/{z}/{x}/{y}?crimes=HOMICIDIO%20DOLOSO`
  );
  const mapStyle = {
    version: 8,
    //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
    sprite: meta.site.siteMetadata.spriteUrl,
    glyphs: meta.site.siteMetadata.glyphsUrl,
    sources: {
      openmaptiles: {
        promoteId: "cuadrante",
        type: "vector",
        maxzoom: 14, // tiles only generated up to zoom 14 and over-zoomed if exceeded
        // url: "pmtiles:///maps/mxc.pmtiles",
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
      if (event?.features[0]?.layer?.id === "crime-points") return;
      if (event.features.length === 0) {
        if (cuadranteId.current)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: cuadranteId.current,
            sourceLayer: "cuadrantes",
          });
        setSelectedCuadrante("df");
        return;
      }
      if (mapRef) {
        if (cuadranteId.current)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: cuadranteId.current,
            sourceLayer: "cuadrantes",
          });
        cuadranteId.current = event.features[0].id;
        mapRef.current.setFeatureState(
          {
            source: "openmaptiles",
            id: cuadranteId.current,
            sourceLayer: "cuadrantes",
          },
          { hover: true }
        );
      }
      const cuadrante = event.features && event.features[0];

      if (cuadrante.layer.id === "crime-points") return;
      setSelectedCuadrante(cuadrante.properties.cuadrante);
      if (crimeData.current) {
        let idx = crimeData.current.findIndex(
          (x) => x.cuadrante === cuadrante.properties.cuadrante
        );
        setClickInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          cuadrante: cuadrante && cuadrante.properties.cuadrante,
          sector: cuadrante && cuadrante.properties.sector,
          alcaldia: cuadrante && cuadrante.properties.alcaldia,
          count: crimeData.current[idx].count,
          x: event.point.x,
          y: event.point.y,
        });
      }
    },
    [setSelectedCuadrante]
  );

  const lines = {
    id: "2",
    type: "line",
    source: "openmaptiles",
    "source-layer": "cuadrantes",
    layout: {},
    hover: true,
    paint: {
      "line-color": "#111",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        0.1,
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
        "circle-color": "red",
      },
    };

    let fillLayer = {
      id: "cuadrantes-fill",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "cuadrantes",
      layout: {},
      paint: {
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
          property: "cuadrante",
          type: "categorical",
          stops: "",
        },
      },
    };

    const url =
      `${meta.site.siteMetadata.apiUrl}/api/v1/cuadrantes/all/crimes/` +
      props.selectedCrime.replaceAll(" ", "%20") +
      `/period`;

    const fetchRequestJSON = fetch(url);
    Promise.all([fetchRequestJSON])
      .then(async (responses) => {
        const [responseJSON] = responses;
        try {
          let [crimes] = await Promise.all([responseJSON.json()]);
          crimes = crimes.rows;

          if (props?.setLastDate) {
            let dateStart = YYYYmmddToDate15(crimes[0].start_date);
            let dateStrStart = getMonthYear(dateStart, props.lang, "long", " ");
            let dateEnd = YYYYmmddToDate15(crimes[0].end_date);
            let dateStrEnd = getMonthYear(dateEnd, props.lang, "long", " ");
            props.setLastDate(dateStrStart + " " + t("to") + " " + dateStrEnd);
          }

          var myColorScale = scaleSequential()
            .domain([
              min(
                crimes.map((r) =>
                  r.sector === "NO ESPECIFICADO" ? 0 : r.count
                )
              ),
              max(
                crimes.map((r) =>
                  r.sector === "NO ESPECIFICADO" ? 0 : r.count
                )
              ),
            ])
            .interpolator(interpolateYlOrRd);
          crimeData.current = crimes;
          let colors = zip(
            crimes.map((item) => item.cuadrante),
            crimes.map((item) => myColorScale(item.count))
          );

          mapStyle.layers = mapStyle.layers.filter(function (item) {
            return !(
              crimeStyle.reduce(
                (prev, cur) => prev || cur.id === item.id,
                false
              ) ||
              item.id === "place_label_city" ||
              //item.id === "road_trunk_primary" ||
              item.id === "road_major_label"
            );
          });
          fillLayer.paint["fill-color"].stops = [...colors];
          setFillLayerOptions({ ...fillLayer });

          if (!mapOptions) {
            mapStyle.layers.push(...crimeStyle);
            setMapOptions({ ...mapStyle });
          }

          /* crimeDotsNoCrime.filter = [
            "all",
            ["==", "crime", props.selectedCrime],
            // ["!has", "point_count"],
          ]; */
          crimeDotsNoCrime.paint["circle-color"] = [
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
          ];
          setCrimeDots({
            ...crimeDotsNoCrime,
          });
          setVectorTiles(
            `${meta.site.siteMetadata.apiUrl}/api/v1/tiles/dates/{z}/{x}/{y}?crimes=` +
              encodeURIComponent(props.selectedCrime)
          );
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
  }, [mapOptions, pmTilesReady, props.selectedCrime]);

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
      interactiveLayerIds={["cuadrantes-fill", "crime-points"]}
    >
      {pmTilesReady ? (
        fillLayerOptions ? (
          <Layer {...fillLayerOptions} />
        ) : undefined
      ) : undefined}

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
          <b>Cuadrante</b>: {clickInfo.cuadrante}
          <br />
          <b>Sector</b>: {clickInfo.sector}
          <br />
          <b><Trans>Alcaldía</Trans></b>: {clickInfo.alcaldia}
          <br />
          <b><Trans>Count</Trans></b>: {clickInfo.count}
          <br />
        </Popup>
      )}
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
  );
};

export default React.memo(SectoresMap);
