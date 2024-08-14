import React, { useState, useEffect, useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";
import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
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

import { useTranslation } from "gatsby-plugin-react-i18next";
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

const MapForSectorDiffMonthChart = React.memo(
  ({ updateRegion, selectedCrime, setPeriod, height = "100%" }) => {
    const [geoJSON, setGeoJSON] = useState(null);

    const { t } = useTranslation();
    //https://hoyodecrimen.com/api/v1/sectores/all/crimes/HOMICIDIO%20DOLOSO/period
    let options = {
      title: {
        text: t("Change in # Crimes"),
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
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#d9ef8b",
            "#a6d96a",
            "#66bd63",
            "#1a9850",
          ].reverse(),
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
            t("Change") +
            "</b>:  " +
            (item.value > 0 ? "+" + item.value : item.value)
          );
        },
      },
      series: [
        {
          type: "map",
          name: "Tasa de",
          map: "Sectores",
          nameMap: "Sectores",
          nameProperty: "sector",
          roam: true,
          label: null,
          aspectScale: 1,
          selectMode: "single",
          itemStyle: {
            borderColor: "#111",
            borderWidth: 0.6,
          },
          select: {
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: "red", // color at 0%
                  },
                  {
                    offset: 1,
                    color: "blue", // color at 100%
                  },
                ],
                global: false, // default is false
              },
              borderWidth: 3,
              borderColor: "black",
              //areaColor: "black",
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
            apiUrl
          }
        }
      }
    `);

    useEffect(() => {
      fetch("/maps/sectores_2023.pbf.avif")
        .then((data) => data.arrayBuffer())
        .then((data) => {
          let geoJson = geobuf.decode(new Pbf(data));
          setGeoJSON(geoJson);
          echarts.registerMap("Sectores", geoJson);
        });
    }, []);

    useEffect(() => {
      const url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/cuadrantes/all/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        `/period/change`;

      fetch(url)
        .then((data) => data.json())
        .then((data) => {
          let period = (({
            start_period1,
            start_period2,
            end_period1,
            end_period2,
          }) => ({
            start_period1,
            start_period2,
            end_period1,
            end_period2,
          }))(data.rows[0]);
          setPeriod({ ...period });
          let mapData = data.rows.map((item) => {
            return { name: item.sector, value: item.difference };
          });
          mapData = mapData.filter((item) => item.name !== "NO ESPECIFICADO");
          let max = {
            max: maxBy(mapData, (o) => {
              if (o.name !== "NO ESPECIFICADO") return o.value;
              else return 0;
            })["value"],
          };
          let min = {
            min: minBy(mapData, (o) => {
              if (o.name !== "NO ESPECIFICADO") return o.value;
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

    const onEvents = {
      click: function (params) {
        const values = { ...params };
        updateRegion((prevState) =>
          prevState === values.name ? "null" : values.name
        );
        //setColor(values.color);
        //options.series[0].emphasis.itemStyle.areaColor = values.color
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

export default MapForSectorDiffMonthChart;
