import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import {
  Map,
  NavigationControl,
  FullscreenControl,
  AttributionControl,
  Marker,
  Source,
  Layer,
  Popup,
} from "react-map-gl";
import Pin from "./pin";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { notifications, Notifications } from "@mantine/notifications";

import * as pmtiles from "pmtiles";
import LoadingOverlay from "./LoadingOverlay";
import { circle as turfCircle } from "@turf/circle";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import pRetry from "p-retry";
import "../../css/loading.css";

import MAP_STYLE from "../MapStyles/3d";

import rumboStyle from "../MapStyles/rumboStyle";

import { cdmxPoly } from "../cdmx_polygon";

const mapStyle = {
  version: 8,
  //glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: "vector",
      maxzoom: 14, // tiles only generated up to zoom 14 and over-zoomed if exceeded
      //url: "pmtiles:///maps/mxc.pmtiles",
      tiles: [],
      bounds: [
        -101.53041872493706, 18.44955123891872, -96.73034794295089,
        20.45739366199904,
      ],
    },
  },
  layers: MAP_STYLE.layers,
};

export const RumboMap = (props: Props) => {
  let { coords, setNotInside } = props;
  const maxZoom = 19;
  const mapRef = useRef();
  const [pmTilesReady, setPmTilesReady] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [marker, setMarker] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [circle, setCircle] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const dragging = useRef(false);
  const distance = 700;
  const markerRef = useRef<maplibregl.Marker>();
  const abortControllerRef = useRef(null);
  const { t } = useTranslation();

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

  mapStyle.sources.openmaptiles.tiles = [meta.site.siteMetadata.osmTilesUrl];
  mapStyle.sprite = meta.site.siteMetadata.spriteUrl;
  mapStyle.glyphs = meta.site.siteMetadata.glyphsUrl;

  const circleLayer: LayerProps = {
    id: "circle-fill",
    type: "line",
    paint: {
      "line-color": "#111",
      "line-width": 1,
    },
  };

  const pointLayer: LayerProps = {
    id: "crime-points",
    type: "circle",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 1, 6, 2, 14, 6],
      "circle-stroke-color": "#111111",
      "circle-stroke-width": 1.5,
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

  const onHover = useCallback((event) => {
    if (!event.features.length || dragging.current === true) return;
    const crime = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      crimeName: crime && crime.properties.crime,
      date: crime && crime.properties.date,
      hour: crime && crime.properties.hour,
    });
  }, []);

  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    dragging.current = true;
    setHoverInfo(null);
  }, []);

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    dragging.current = false;
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

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

  useEffect(() => {
    if (markerRef?.current) {
      if (coords) {
        markerRef.current.setLngLat(coords);
        setMarker({ longitude: coords[0], latitude: coords[1] });
        if (mapRef) {
          mapRef.current.setZoom(14.1);
          mapRef.current.setCenter(coords);
        }
      }
    }
  }, [coords]);

  useEffect(() => {
    const cdmxCenter = { latitude: 19.43260554030921, longitude: -99.133208 };
    let geojson = {
      type: "FeatureCollection",
      features: [],
    };
    const url =
      `${meta.site.siteMetadata.apiUrl}/api/v1/latlong/crimes/all/coords/` +
      marker?.longitude +
      "/" +
      marker?.latitude +
      `/distance/${distance}`;

    const downloadPoints = async (crimeCircle, center, cdmxCenter) => {
      let response;
      response = await fetch(url);

      if (response.status === 404) {
        geojson.features = [];
        setPointData(geojson);
        setCircle(crimeCircle);
        toggleAnimation(mapRef, false);
        if (!booleanPointInPolygon(center, cdmxPoly)) {
          notifications.show({
            color: "red",
            border: true,
            title: t("Location error"),
            message: t("Looks like your are not in Mexico City. Setting your location to the Zocalo"),
            position: "bottom-right",
            autoClose: 10000,
          });
          setUserLocation(cdmxCenter);
          //setNotInside(true);
        }
        //throw new Error("404 response", { cause: response });
        return;
      }
      if (!response.ok && !response.status === 404) {
        toggleAnimation(mapRef, false);
        throw new Error(response.statusText);
      }

      let crimes = await response.json();

      geojson.features = [
        ...crimes.rows.map((item) => {
          return {
            type: "Feature",
            properties: {
              crime: item.crime,
              date: item.date,
              hour: item.hour,
            },
            geometry: {
              type: "Point",
              coordinates: [item.long, item.lat],
            },
          };
        }),
      ];

      setPointData(geojson);
      setCircle(crimeCircle);

      // .catch((error) => {
      //   console.log(error);
      // })
      // .finally(() => {
      toggleAnimation(mapRef, false);
      // });
    };

    if (marker) {
      toggleAnimation(mapRef, true);
      let center = [marker.longitude, marker.latitude];
      let options = {
        steps: 100,
        units: "kilometers",
      };
      let crimeCircle = turfCircle(center, (distance + 5) / 1000, options);

      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(
          new Error("User moved marker still downloading")
        );
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      // Call onSearch with new search term and abort controller
      try {
        pRetry(() => downloadPoints(crimeCircle, center, cdmxCenter), {
          signal: abortControllerRef.current.signal,
          onFailedAttempt: (error) => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
            );
            // 1st request => Attempt 1 failed. There are 4 retries left.
            // 2nd request => Attempt 2 failed. There are 3 retries left.
            // …
          },
          retries: 2,
        });
      } catch (error) {
        console.log(error.message);
        toggleAnimation(mapRef, false);
      } finally {
      }
    }
    return () => {
      if (abortControllerRef.current)
        abortControllerRef.current.abort(
          new Error("User moved marker still downloading")
        ); // Cancel the request if component unmounts
    };
  }, [marker]);

  useEffect(() => {
    const cdmxCenter = { latitude: 19.43260554030921, longitude: -99.133208 };
    const geoPermission = async () => {
      const permissionStatus = await navigator?.permissions?.query({
        name: "geolocation",
      });
      if (permissionStatus?.state === "granted")
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (!booleanPointInPolygon([longitude, latitude], cdmxPoly)) {
              setUserLocation(cdmxCenter);
              setNotInside(true);
            } else setUserLocation({ latitude, longitude });
          },
          (error) => {
            setUserLocation(cdmxCenter);
            // display an error if we cant get the users position
            console.error("Error getting user location:", error);
          }
        );
      else setUserLocation(cdmxCenter);
    };

    geoPermission();
    /* return () => {
      // Cleanup function to abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }; */
  }, []);

  useEffect(() => {
    mapStyle.layers = mapStyle.layers.filter(function (item) {
      return !(
        (
          rumboStyle.reduce((prev, cur) => prev || cur.id === item.id, false) ||
          item.id === "place_label_city"
        )
        //item.id === "road_trunk_primary" ||
        //item.id === "road_major_label"
      );
    });

    mapStyle.layers.push(...rumboStyle);

    if (userLocation) {
      mapRef.current.setZoom(14.1);
      mapRef.current.setCenter([userLocation.longitude, userLocation.latitude]);
      setMarker({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      });
    }

    if (!pmTilesReady) {
      const protocol = new pmtiles.Protocol();
      maplibregl.addProtocol("pmtiles", protocol.tile);
      setPmTilesReady(true);
    }
  }, [pmTilesReady, userLocation]);

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

  return (
    <>
      <Notifications zIndex={1000} withBorder />
      <Map
        ref={(ref) => (mapRef.current = ref && ref.getMap())}
        maxBounds={[-100.421, 18.468, -97.901, 20.182]}
        mapLib={maplibregl}
        styleDiffing={true}
        style={{ height: "400px", width: "100%" }}
        mapStyle={pmTilesReady ? (mapStyle ? mapStyle : undefined) : undefined}
        attributionControl={false}
        maxZoom={maxZoom}
        onMouseMove={onHover}
        //onMouseDown={onHover}
        onMouseLeave={() => {
          setHoverInfo(null);
        }}
        interactiveLayerIds={["crime-points"]}
      >
        {pointData && (
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
        {circle && (
          <Source type="geojson" data={circle}>
            <Layer {...circleLayer} />
          </Source>
        )}
        <Marker
          ref={markerRef}
          longitude={marker ? marker.longitude : null}
          latitude={marker ? marker.latitude : null}
          anchor="bottom"
          draggable
          onDragEnd={onMarkerDragEnd}
          onDragStart={onMarkerDragStart}
        >
          <Pin size={30} />
        </Marker>
        <NavigationControl visualizePitch={true} />
        <LoadingOverlay />
        <FullscreenControl />
        <AttributionControl
          compact={true}
          customAttribution='© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://sites.research.google/open-buildings/#download">Google</a>/<a href="https://planetarycomputer.microsoft.com/dataset/ms-buildings">Microsoft</a> Open Buildings'
        />

        {hoverInfo && mapRef && mapRef.current.getZoom() >= 13 && (
          <Popup
            key={hoverInfo.longitude + hoverInfo.latitude}
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            //offset={[0, -10]}
            //closeOnClick
            //closeOnMove
            //className="crime-info"
          >
            {
              <div>
                <b>{hoverInfo.crimeName}</b>
                <br />
                {hoverInfo.date}
                <br />
                {hoverInfo.hour}
              </div>
            }
          </Popup>
        )}
      </Map>
    </>
  );
};

export default RumboMap;
