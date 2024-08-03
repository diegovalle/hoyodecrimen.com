import React, { useState, useEffect, useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";
import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { useTranslation } from "gatsby-plugin-react-i18next";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  VisualMapComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

import geobuf from "geobuf";
import Pbf from "pbf";
import { decode } from "geobuf";

import { maxBy, minBy } from "lodash-es";

import { round1 } from "./utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MapChart,
  CanvasRenderer,
  VisualMapComponent,
]);

const MapForCuadranteMonthChart = React.memo(
  ({ updateRegion, selectedCrime, height }) => {
    const [geoJSON, setGeoJSON] = useState(null);
    const [mapData, setMapData] = useState(null);

    const { t } = useTranslation();
    //https://hoyodecrimen.com/api/v1/sectores/all/crimes/HOMICIDIO%20DOLOSO/period
    let options = {
      title: {
        text: t("Crimes by Cuadrante"),
        left: "center",
        top: "top",
      },
      grid: { containLabel: false },
      visualMap: {
        type: "continuous",
        splitNumber: 9,
        left: "center",
        top: "bottom",
        orient: "horizontal",
        textStyle: { color: "#111" },
        inRange: {
          color: [
            "#ffffcc",
            "#ffeda0",
            "#fed976",
            "#feb24c",
            "#fd8d3c",
            "#fc4e2a",
            "#e31a1c",
            "#bd0026",
            "#800026",
          ],
        },
        text: ["Max", "Min"],
        calculable: true,
      },
      tooltip: {
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: (item) => {
          return (
            item.name +
            "<br/><b>" +
            t("Number of Crimes") +
            "</b>:  " +
            round1(item.value)
          );
        },
      },
      series: [
        {
          type: "map",
          name: "Tasa de",
          map: "Cuadrantes",
          nameMap: "Cuadrantes",
          nameProperty: "cuadrante",
          roam: true,
          label: null,
          aspectScale: 1,
          selectMode: "single",
          select: {
            label: {
              show: false,
            },
            itemStyle: {
              borderWidth: 2,
              areaColor: "green",
            },
          },
          emphasis: {
            itemStyle: {
              areaColor: "transparent",
              borderColor: "black",
              borderWidth: 2,
            },
            label: {
              show: false,
            },
          },
          boundingCoords: [
            [-99.3500061035156, 19.1226825714111],
            [-98.9468765258789, 19.581169128418],
          ],
          /*  projection: {
          project: (point) => [point[0] / 180 * Math.PI, -Math.log(Math.tan((Math.PI / 2 + point[1] / 180 * Math.PI) / 2))],
          unproject: (point) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90]
      }, */
          //   data: [
          //     { name: "P-1.3.8", value: 4822023 },
          //     { name: "P-1.3.10", value: 731449 },
          //   ],
        },
      ],
    };
    const [chartOptions, setChartOptions] = useState(options);
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

    useEffect(() => {
      const url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/cuadrantes/all/crimes/HOMICIDIO%20DOLOSO/period`;

      fetch("/maps/cuadrantes_2023.pbf")
        .then((data) => data.arrayBuffer())
        .then((data) => {
          let geoJson = geobuf.decode(new Pbf(data));
          setGeoJSON(geoJson);
          echarts.registerMap("Cuadrantes", geoJson);
        });
    }, []);

    useEffect(() => {
      const url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/cuadrantes/all/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        `/period`;
      fetch(url)
        .then((data) => data.json())
        .then((data) => {
          let mapData = data.rows.map((item) => {
            return { name: item.cuadrante, value: item.count };
          });
          mapData = mapData.filter((item) => item.name !==  "(NO ESPECIFICADO)")
          let max = {
            max: maxBy(mapData, (o) => {
              if (o.name !== "(NO ESPECIFICADO)") return o.value;
              else return 0;
            })["value"],
          };
          let min = {
            min: minBy(mapData, (o) => {
              if (o.name !== "(NO ESPECIFICADO)") return o.value;
              else return 0;
            })["value"],
          };
          let seriesObject = {
            series: [{ ...chartOptions.series[0], data: mapData }],
          };
          let vmObject = {
            visualMap: { ...chartOptions.visualMap, ...max, ...min },
          };
          setChartOptions({
            ...chartOptions,
            ...vmObject,
            ...seriesObject,
          });
        });
    }, [selectedCrime]);

    let unselect = false;
    const onEvents = {
      click: function (params) {
        const values = { ...params };
        if (!unselect) updateRegion(values.name);
        unselect = false;
      },
      selectchanged: function (params) {
        if (params.fromAction === "unselect") {
          updateRegion("null");
          unselect = true;
        }
        // else if (params.fromAction === "select") {
        //   console.log( params.selected[0].dataIndex[0])
        //   updateRegion(() => "null");
        // }
      },
    };

    const MemoChart = useMemo(
      () => (
        <ReactEChartsCore
          echarts={echarts}
          option={chartOptions}
          style={{ height: height, width: "100%" }}
          onEvents={onEvents}
          // opts={{ locale: echarts.registerLocale(lang) }}
        />
      ),
      [selectedCrime, chartOptions]
    );

    return <>{geoJSON ? MemoChart : null}</>;
  }
);

export default MapForCuadranteMonthChart;
