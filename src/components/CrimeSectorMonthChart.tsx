import React from "react";
import { useState, useEffect, useRef } from "react";
import { useStaticQuery, graphql } from "gatsby";
//import {useIntl} from 'react-intl';
//import {dateLoc} from '../../src/i18n';

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

import {
  YYYYmmddToDate15,
  axisLabel,
  nameTextStyle,
  annualizeRate,
} from "./utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

function CrimeSectorMonthChart(props) {
  const {
    selectedCrime,
    selectedRegion,
    lang,
    height = "100%",
    title = "", // eslint-disable-line
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;

  const { t } = useTranslation();
  const [chartOptions, setChartOptions] = useState(null);
  const echartsInstance = useRef(null);

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
    let option = {
      animation: false,
      title: {
        text: props.title,
        left: "center",
        textStyle: {
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
          fontSize: props.fontSize,
          fontWeight: props.fontWeight,
        },
      },
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
          let datestr = [
            date.toLocaleString(props.lang, { month: "long" }),
            date.getFullYear(),
          ].join(" ");
          return `${datestr}<br/>${t("rate")}: <b>${
            Math.round(item[0].value * 10) / 10
          }</b>`;
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        top: "30%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        //   data: data[0].map(function (item) {
        //     return item.date;
        //   }),
        axisLabel: {
          ...axisLabel,
          interval: 23,
          formatter: function (value, idx) {
            let date = YYYYmmddToDate15(value);
            return [
              date.toLocaleString(props.lang, { month: "short" }),
              date.getFullYear(),
            ].join("\n");
          },
        },
        boundaryGap: false,
        splitNumber: 6,
      },
      yAxis: [
        {
          name: t("rate"),
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: { ...axisLabel },
          axisLabel: {
            ...axisLabel,
          },
          type: "value",
          scale: false,
          splitNumber: 2,
          axisLine: { show: false },
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
      series: [
        {
          name: "rate",
          type: "line",
          // data: data[1].map(function (item) {
          //   return item.value;
          // }),
          itemStyle: {
            color: "#333",
          },
          showSymbol: false,
        },
      ],
    };
    let url;
    if (selectedRegion === "null")
      url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/df/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        `/series`;
    else
      url =
        `${meta.site.siteMetadata.apiUrl}/api/v1/sectores/` +
        selectedRegion.replaceAll(" ", "%20") +
        `/crimes/` +
        selectedCrime.replaceAll(" ", "%20") +
        `/series`;
    if (echartsInstance?.current !== null) {
      echartsInstance.current.getEchartsInstance().showLoading();
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        option.series[0].data = data.rows.map(function (item) {
          return annualizeRate(item.count, item.date, item.population);
        });
        option.xAxis.data = data.rows.map(function (item) {
          return item.date;
        });
        setChartOptions({ ...option });
      })
      .finally(() => {
        if (echartsInstance?.current !== null)
          echartsInstance.current.getEchartsInstance().hideLoading();
      });
  }, [
    meta.site.siteMetadata.apiUrl,
    props.fontSize,
    props.fontWeight,
    props.lang,
    props.title,
    props.yname,
    selectedCrime,
    selectedRegion,
    t,
  ]);

  return (
    <>
      {chartOptions ? (
        <ReactEChartsCore
          ref={echartsInstance}
          echarts={echarts}
          option={chartOptions}
          style={{ height: height, width: "100%" }}
          opts={{ locale: echarts.registerLocale(props.lang) }}
        />
      ) : null}
    </>
  );
}

export default CrimeSectorMonthChart;
