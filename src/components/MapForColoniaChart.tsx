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
import { decode } from "geobuf";

import { maxBy, minBy } from "lodash-es";
import { round1 } from "./utils";
import { useTranslation } from "gatsby-plugin-react-i18next";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MapChart,
  CanvasRenderer,
  VisualMapComponent,
]);

const MapForSectorMonthChart = React.memo(
  ({ updateRegion, selectedCrime, updateColoniaName, height = "100%" }) => {
    const [geoJSON, setGeoJSON] = useState(null);
    const [colonias, setColonias] = useState(null);
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
    const { t } = useTranslation();
    //https://hoyodecrimen.com/api/v1/sectores/all/crimes/HOMICIDIO%20DOLOSO/period
    let options = {
      title: {
        text: t("Homicide Rate"),
        left: "center",
        top: "top",
      },
      grid: { containLabel: false },
      visualMap: {
        type: "continuous",
        splitNumber: 9,
        hoverLink: false,
        left: "center",
        top: "bottom",
        orient: "horizontal",
        textStyle: { color: "#111" },
        inRange: {
          color: [
            "#30123BFF",
            "#466BE3FF",
            "#28BBECFF",
            "#31F299FF",
            "#A2FC3CFF",
            "#EDD03AFF",
            "#FB8022FF",
            "#D23105FF",
            "#7A0403FF",
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
            item.name + "<br/><b>" + t("Rate") + "</b>:  " + round1(item.value)
          );
        },
      },
      series: [
        {
          type: "map",
          name: "Tasa de",
          map: "Colonias",
          nameMap: "Colonias",
          nameProperty: "CVEUT",
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

    useEffect(() => {
      fetch("/maps/colonias_2019.pbf.avif")
        .then((data) => data.arrayBuffer())
        .then((data) => {
          let geoJson = geobuf.decode(new Pbf(data));
          setGeoJSON(geoJson);
          let names = {};
          for (var i = 0; i < geoJson.features.length; i++) {
            names[geoJson.features[i].properties.CVEUT] =
              geoJson.features[i].properties.NOMUT;
          }
          setColonias(names);
          echarts.registerMap("Colonias", geoJson);
        });
    }, []);

    useEffect(() => {
      const url = `${meta.site.siteMetadata.apiUrl}/api/v1/get_file?file_name=smoothgamhomicides`;
      fetch(url)
        .then((data) => data.json())
        .then((data) => {
          let point_estimates = data[0].pred_rate.map((i) => Math.exp(i));
          let mapData = point_estimates.map((item, i) => {
            return { name: data[0].CVEUT[i], value: item };
          });
          let max = {
            max: Math.max(...point_estimates),
          };
          console.log(max);
          let min = {
            min: Math.min(...point_estimates),
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
        updateRegion(values.name);
        updateColoniaName(colonias[values.name]);
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

export default MapForSectorMonthChart;
