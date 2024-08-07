import React, { useEffect, useState, useRef } from "react";

import { useStaticQuery, graphql } from "gatsby";

import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { LineChart, ScatterChart } from "echarts/charts";
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
import { YYYYmmddToDate15, annualizeRate } from "./utils";
import { useTranslation } from "gatsby-plugin-react-i18next";

//import '../assets/css/trends.css';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
  VisualMapComponent,
]);

function SectoresLineChart(props) {
  const {
    selectedCuadrante,
    selectedCrime,
    language,
    title = "", // eslint-disable-line
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;
  const [data, setData] = useState(null);
  const echartsInstance = useRef(null);
  const { t } = useTranslation();
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
    let url;
    if (selectedCuadrante === "df")
      url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/df/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        "/series";
    else
      url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/cuadrantes/` +
        selectedCuadrante.replaceAll(" ", "%20") +
        `/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        `/series`;

    if (echartsInstance?.current !== null) {
      echartsInstance.current.getEchartsInstance().showLoading();
    }
    const fetchRequestJSON = fetch(url);
    Promise.all([fetchRequestJSON]).then(async (responses) => {
      const [responseJSON] = responses;
      let [counts] = await Promise.all([responseJSON.json()]);
      setData(counts.rows);
      if (echartsInstance?.current === null)
        echartsInstance.current.getEchartsInstance().hideLoading();
    });
  }, [selectedCrime, selectedCuadrante]);

  let chartOption = {
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        animation: false,
        label: {
          backgroundColor: "#ccc",
          borderColor: "#aaa",
          borderWidth: 0.1,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          color: "#111",
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        },
      },
      formatter: function (item) {
        let date = YYYYmmddToDate15(item[0].name);
        let dateStr = [
          date.toLocaleString(language, { month: "long" }),
          date.getFullYear(),
        ].join(" ");
        let tasa = props.yname;
        return `${dateStr}<br/>${t("number")}: <b>${
          Math.round(item[0].value * 10) / 10
        }</b>`;
      },
    },
    grid: {
      left: "8%",
      right: "5%",
      bottom: "30%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data
        ? data.map(function (item) {
            return item.date;
          })
        : null,
      axisLabel: {
        interval: 23,
        formatter: function (value, idx) {
          var date = YYYYmmddToDate15(value);
          return [
            date.toLocaleString(language, { month: "short" }),
            date.getFullYear(),
          ].join("\n");
        },
      },
      boundaryGap: false,
      splitNumber: 2,
    },
    yAxis: [
      {
        name: t("number of crimes"),
        nameLocation: "middle",
        nameGap: 39,
        nameTextStyle: { fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif" },
        type: "value",
        scale: false,
        splitNumber: 2,
        // interval:
        //   Math.round(Math.round((((props.max_y + 5) / 10) * 10) / 3) / 10) * 10,
        // max: Math.round((props.max_y + 5) / 10) * 10,
        splitLine: {
          show: true,
          lineStyle: {
            type: "solid",
          },
        },
      },
    ],
    visualMap: {
      orient: "horizontal",
      left: "center",
      top: "bottom",
      min: 10,
      max: 100,
      bottom: 15,
      text: [t("more crime"), t("less crime")],
      textGap: 10,
      dimension: "none",
      hoverLink: false,
      calculable: false,
      inRange: {
        color: ["#ffeda0", "#feb24c", "#f03b20"],
      },
    },
    series: [
      {
        type: "line",
        data: data
          ? data.map(function (item) {
              return item.count;
            })
          : null,
        itemStyle: {
          color: "#111",
          opacity: 1,
        },
        showSymbol: false,
        lineStyle: { width: 1 },
        z: 1000,
      },
    ],
  };
  const loadingOption = {
    text: "loading",
    color: "#4413c2",
    textColor: "#111",
    //maskColor: "rgba(194, 88, 86, 0.3)",
    zlevel: 0,
  };

  function onChartReady(echarts) {
    echarts.hideLoading();
  }

  return (
    <ReactEChartsCore
      ref={echartsInstance}
      echarts={echarts}
      option={chartOption}
      style={{ height: 250, width: "100%" }}
      //onChartReady={onChartReady}
      loadingOption={loadingOption}
      //showLoading={false}
    />
  );
}

export default SectoresLineChart;
