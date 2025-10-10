import React, { useRef } from "react";
import LazyLoad from "react-lazy-load";

import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { LineChart, ScatterChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

import { useTranslation } from "gatsby-plugin-react-i18next";
import { YYYYmmddToDate15, addMonths, getMonthYear } from "./utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

function SeptemberErrorChart(props) {
  const {
    lang,
    height = 340,
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;
  const echartsInstance = useRef(null);
  const { t } = useTranslation();

  var chartOption = {
    animation: false,
    grid: {
      right: 150,
    },
    xAxis: {
      type: "category",
      data: [
        "2019-01",
        "2019-02",
        "2019-03",
        "2019-04",
        "2019-05",
        "2019-06",
        "2019-07",
        "2019-08",
        "2019-09",
        "2019-10",
        "2019-11",
        "2019-12",
        "2020-01",
        "2020-02",
        "2020-03",
        "2020-04",
        "2020-05",
        "2020-06",
        "2020-07",
        "2020-08",
        "2020-09",
        "2020-10",
        "2020-11",
        "2020-12",
        "2021-01",
        "2021-02",
        "2021-03",
        "2021-04",
        "2021-05",
        "2021-06",
        "2021-07",
        "2021-08",
        "2021-09",
        "2021-10",
        "2021-11",
        "2021-12",
        "2022-01",
        "2022-02",
        "2022-03",
        "2022-04",
        "2022-05",
        "2022-06",
        "2022-07",
        "2022-08",
        "2022-09",
        "2022-10",
        "2022-11",
        "2022-12",
        "2023-01",
        "2023-02",
        "2023-03",
        "2023-04",
        "2023-05",
        "2023-06",
        "2023-07",
        "2023-08",
        "2023-09",
        "2023-10",
        "2023-11",
        "2023-12",
        "2024-01",
        "2024-02",
        "2024-03",
        "2024-04",
        "2024-05",
        "2024-06",
        "2024-07",
        "2024-08",
        "2024-09",
        "2024-10",
        "2024-11",
        "2024-12",
        "2025-01",
        "2025-02",
        "2025-03",
        "2025-04",
        "2025-05",
        "2025-06",
        "2025-07",
        "2025-08",
      ],
      name: t("Fecha"),
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        interval: 23,
        formatter: function (value, idx) {
          var date = YYYYmmddToDate15(value);
          return getMonthYear(date, lang, "short", "\n");
        },
      },
    },
    yAxis: {
      type: "value",
      name: t("Homicidios"),
      nameLocation: "middle",
      nameGap: 30,
    },
    tooltip: {
      trigger: "axis",
      // formatter:
      //   '{b0}<br /><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
      //   "#f8766d" +
      //   ';"></span>{a0}: <b>{c0}</b><br /><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
      //   "#00b8e7" +
      //   ';"></span>{a1}: <b>{c1}</b>',
    },
    legend: {
      data: [
        t("Datos Publicados en Agosto 2025"),
        t("Datos Publicados en Septiembre 2025"),
      ],
    },
    series: [
      {
        name: t("Datos Publicados en Agosto 2025"),
        data: [
          172, 152, 191, 157, 213, 155, 161, 120, 147, 136, 147, 146, 144, 142,
          159, 153, 139, 155, 127, 103, 104, 134, 117, 117, 110, 112, 119, 107,
          140, 84, 112, 98, 108, 80, 102, 97, 71, 65, 77, 82, 95, 86, 93, 92,
          75, 91, 111, 90, 90, 86, 115, 78, 120, 114, 83, 83, 69, 91, 85, 113,
          78, 97, 114, 113, 114, 100, 105, 94, 90, 102, 120, 88, 73, 111, 108,
          99, 90, 91, 78, 75,
        ],
        type: "line",
        lineStyle: {
          color: "#f8766d",
          type: "solid",
          opacity: 0.5,
        },
        itemStyle: {
          color: "#f8766d",
          opacity: 0,
        },
        endLabel: {
          show: true,
          formatter: t("Agosto 2025"),
        },
        showSymbol: false,
      },
      {
        name: t("Datos Publicados en Septiembre 2025"),
        data: [
          172, 152, 191, 157, 213, 155, 161, 120, 147, 136, 147, 146, 144, 142,
          159, 153, 139, 155, 127, 103, 104, 134, 117, 117, 110, 112, 119, 107,
          140, 84, 112, 98, 108, 80, 102, 97, 71, 65, 77, 82, 95, 86, 93, 92,
          75, 91, 111, 90, 90, 86, 115, 78, 120, 114, 83, 83, 69, 91, 85, 113,
          78, 97, 114, 113, 114, 100, 105, 94, 90, 102, 120, 88, 68, 87, 85, 80,
          71, 72, 64, 64,
        ],
        type: "line",
        lineStyle: {
          color: "#00b8e7",
          type: "solid",
          opacity: 0.5,
        },
        itemStyle: {
          color: "#00b8e7",
          opacity: 0,
        },
        endLabel: {
          show: true,
          formatter: t("Septiembre 2025"),
        },
        showSymbol: false,
      },
    ],
  };

  return (
    <LazyLoad height={height} once offset={200}>
      <ReactEChartsCore
        ref={echartsInstance}
        echarts={echarts}
        option={chartOption}
        style={{ height: height, width: "100%" }}
        opts={{ locale: echarts.registerLocale(props.lang) }}
      />
    </LazyLoad>
  );
}

export default SeptemberErrorChart;
