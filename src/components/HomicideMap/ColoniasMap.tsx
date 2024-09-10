import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useState, useEffect, useCallback, useRef } from "react";
import { scaleSequential } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";
import { max, zip } from "lodash-es";
import { Trans } from "gatsby-plugin-react-i18next";
import {
  Map,
  NavigationControl,
  FullscreenControl,
  AttributionControl,
  GeolocateControl,
  Popup,
  Layer,
} from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { round0 } from "../utils";
import MAP_STYLE from "../MapStyles/3d";

import crimeStyle from "../MapStyles/colonias-map";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { YYYYmmddToDate15, comma, getMonthYear } from "../utils";

let coloniaId = null;

export const ColoniasMap = (props: Props) => {
  const maxZoom = 19;
  const mapRef = useRef();
  const attributionControlRef = useRef();
  const [pmTilesReady, setPmTilesReady] = useState(false);

  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);
  const [fillLayerOptions, setFillLayerOptions] = useState(undefined);
  const [mapOptions, setMapOptions] = useState(null);
  const [crimeDots, setCrimeDots] = useState(null);
  const [crimeData, setCrimeData] = useState(null);
  const { t } = useTranslation();

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
  const mapStyle = {
    version: 8,
    //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
    sprite: meta.site.siteMetadata.spriteUrl,
    glyphs: meta.site.siteMetadata.glyphsUrl,
    sources: {
      openmaptiles: {
        promoteId: "CVEUT",
        type: "vector",
        maxzoom: 14, // tiles only generated up to zoom 14 and over-zoomed if exceeded
        //url: "pmtiles:///maps/mxc.pmtiles",
        tiles: [meta.site.siteMetadata.osmTilesUrl],
        bounds: [
          -101.53041872493706, 18.44955123891872, -96.73034794295089,
          20.45739366199904,
        ],
      },
      crimes: {
        type: "vector",
        maxzoom: 13, // tiles only generated up to zoom 12 and over-zoomed if exceeded
        minzoom: 13, // don't display a tile at all below zoom 13. Underzooming never occurs.
        //url: "pmtiles:///maps/selected-crimes.pmtiles",
        tiles: [
          meta.site.siteMetadata.apiUrl +
            "/api/v1/tiles/dates/{z}/{x}/{y}?crimes=HOMICIDIO%20DOLOSO",
        ],
        bounds: [
          -99.36792388992502, 19.04525200179835, 98.93730363466278,
          19.5957096676085,
        ],
      },
    },
    layers: MAP_STYLE.layers,
  };

  const onClick = useCallback(
    (event) => {
      if (
        event.features.length === 0 ||
        event.features[0].layer?.id === "crime-points"
      ) {
        if (coloniaId)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: coloniaId,
            sourceLayer: "colonias",
          });
        return;
      }
      if (mapRef) {
        if (coloniaId)
          mapRef.current.removeFeatureState({
            source: "openmaptiles",
            id: coloniaId,
            sourceLayer: "colonias",
          });
        coloniaId = event.features[0].id;
        mapRef.current.setFeatureState(
          { source: "openmaptiles", id: coloniaId, sourceLayer: "colonias" },
          { hover: true }
        );
      }
      const colonia = event.features && event.features[0];
      if (crimeData) {
        let idx = crimeData[0].CVEUT.findIndex(
          (x) => x === colonia.properties.CVEUT
        );
        //props.setSelectedCuadrante(cuadrante.properties.cuadrante);
        setClickInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          colonia: colonia.properties.NOMUT,
          hom_count: crimeData[0].hom_count[idx],
          population: crimeData[0].population[idx],
          pred_rate: crimeData[0].pred_rate[idx],
          x: event.point.x,
          y: event.point.y,
        });
      }
    },
    [crimeData]
  );

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
      "circle-color": "#bd0026",
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
    },
  };

  const outlineLayer = {
    id: "colonias-outline",
    type: "line",
    source: "openmaptiles",
    "source-layer": "colonias",
    layout: {},
    paint: {
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#333",
        "#000",
      ],
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        2.5,
        0.1,
      ],
    },
    //minzoom: 13,
  };

  let fillLayer = {
    id: "colonias-fill",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "colonias",
    layout: {},
    paint: {
      //"fill-outline-color": "rgba(0,0,0,0.3)",
      "fill-opacity": [
        "interpolate",
        ["exponential", 0.8],
        ["zoom"],
        12,
        0.9,
        13,
        0.7,
        14,
        0.5,
        16,
        0,
      ],
      "fill-color": {
        property: "CVEUT",
        type: "categorical",
        stops: "",
      },
    },
  };

  useEffect(() => {
    let url = `${meta.site.siteMetadata.apiUrl}/api/v1/get_file?file_name=smoothgamhomicides`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching data:", error);
        // Retry once
        console.log("Retrying fetch...");
        const retryResponse = await fetch(url);
        if (!retryResponse.ok) {
          throw new Error("Retry failed");
        }
        return await retryResponse.json();
      }
    };

    fetchData()
      .then((crimes) => {
        if (props?.setLastDate) {
          let dateStart = YYYYmmddToDate15(crimes[1].start[0]);
          let dateStrStart = getMonthYear(dateStart, props.lang, "long", " ");
          let dateEnd = YYYYmmddToDate15(crimes[2].end[0]);
          let dateStrEnd = getMonthYear(dateEnd, props.lang, "long", " ");
          props.setLastDate(dateStrStart + " " + t("to") + " " + dateStrEnd);
        }
        let maxRate = max(crimes[0].pred_rate.map((x) => Math.exp(x)));
        if (props.setMaxRate) props.setMaxRate(maxRate);
        var myColorScale = scaleSequential()
          .domain([0, maxRate])
          .interpolator(interpolateTurbo);

        setCrimeData([...crimes]);
        let colors = zip(
          crimes[0].CVEUT,
          crimes[0].pred_rate.map((x) => myColorScale(Math.exp(x)))
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

        crimeDotsNoCrime.filter = [
          "all",
          ["==", "crime", props.selectedCrime],
          ["!has", "point_count"],
        ];
        //crimeDotsNoCrime.paint["circle-color"] = color;
        setCrimeDots({
          ...crimeDotsNoCrime,
        });

        if (!pmTilesReady) {
          const protocol = new pmtiles.Protocol();
          maplibregl.addProtocol("pmtiles", protocol.tile);
          setPmTilesReady(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setMaxRate]);

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
      ref={(ref) => {
        mapRef.current = ref && ref.getMap();
      }}
      initialViewState={{
        bounds: [
          -99.3503799438477, 19.1274166107178, -98.9456329345703,
          19.5937843322754,
        ],
        //zoom: 10,
        //pitch: 45,
      }}
      maxPitch={30}
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
      interactiveLayerIds={["colonias-fill", "crime-points"]}
    >
      {pmTilesReady ? (
        fillLayerOptions ? (
          <Layer {...fillLayerOptions} />
        ) : undefined
      ) : undefined}

      {pmTilesReady ? (
        crimeDots ? (
          <Layer {...crimeDots} />
        ) : undefined
      ) : undefined}

      {pmTilesReady ? (
        crimeDots ? (
          <Layer {...outlineLayer} />
        ) : undefined
      ) : undefined}

      <NavigationControl showCompass={true} visualizePitch={true} />
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
          closeOnClick={true}
          closeOnMove
        >
          <b>
            <Trans>Neighborhood</Trans>
          </b>
          : {clickInfo.colonia}
          <br />
          <b>
            <Trans>Smooth rate</Trans>
          </b>
          : {round0(Math.exp(clickInfo.pred_rate))}
          <br />
          <b>
            <Trans>Count</Trans>
          </b>
          : {clickInfo.hom_count}
          <br />
          <b>
            <Trans>Population</Trans>
          </b>
          : {comma(clickInfo.population)}
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

export default React.memo(ColoniasMap);
