import React, { useRef } from "react";
//import {useIntl} from 'react-intl';
//import {dateLoc} from '../../src/i18n';
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

//import '../assets/css/trends.css';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

const formatData = (data) => {
  const start_year = 2019;
  let state = Object.keys(data)[0];
  let len = data[state][0].length;
  // Substract one from the length of the array since js months are zero indexed
  //setMonth((len - 1) % 12);
  let state_tidy = [[], []];
  for (let i = 0; i < len; i++) {
    let d = new Date(start_year, 0, 1);
    state_tidy[0].push({
      value: data[state][1][i],
      date: new Date(d.setMonth(d.getMonth() + i)),
      l: data[state][0][i],
      u: data[state][2][i],
      active: true,
    });
    state_tidy[1].push({
      value: data[state][3][i],
      date: new Date(d.setMonth(d.getMonth())),
      active: true,
    });
  }
  //for (var i = 0; i < state_tidy.length; i++) {
  //    state_tidy[i] = MG_convert_date(state_tidy[i], "date");
  // }
  return state_tidy;
};

function TrendMonthChart(props) {
  const {
    lang,
    height = 340,
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;
  const echartsInstance = useRef(null);

  let data = formatData(props.data);

  let chartOption = {
    animation: false,
    title: {
      text: Object.keys(props.data)[0],
      left: "center",
      textStyle: {
        fontFamily: "Roboto Condensed",
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
      },
    },
    tooltip: {
      trigger: "item",
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
          fontFamily: "Roboto Condensed",
        },
      },
      formatter: function (item) {
        let date = new Date(item.name);
        let datestr = [
          date.toLocaleString(props.lang, { month: "long" }),
          date.getFullYear(),
        ].join(" ");
        let tasa = props.yname;
        return `${datestr}<br/>${tasa}: <b>${item.value}</b>`;
      },
    },
    grid: {
      left: "19px",
      right: "4%",
      bottom: "3%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data[0].map(function (item) {
        return item.date;
      }),
      axisLabel: {
        interval: 35,
        formatter: function (value, idx) {
          var date = new Date(value);
          return [
            date.toLocaleString(props.lang, { month: "short" }),
            date.getFullYear(),
          ].join("\n");
        },
      },
      boundaryGap: false,
      splitNumber: 2,
    },
    yAxis: [
      {
        name: props.yname,
        nameLocation: "middle",
        nameGap: 31,
        nameTextStyle: { fontFamily: "Roboto Condensed" },
        type: "value",
        scale: false,
        splitNumber: 3,
        interval:
          Math.round(Math.round((((props.max_y + 5) / 10) * 10) / 3) / 10) * 10,
        max: Math.round((props.max_y + 5) / 10) * 10,
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
        type: "scatter",
        data: data[1].map(function (item) {
          return item.value;
        }),
        itemStyle: {
          color: "white",
          borderColor: "Black",
          opacity: 1,
        },
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        z: 1000,
      },
      {
        name: "L",
        type: "line",
        data: data[0].map(function (item) {
          return item.l;
        }),
        lineStyle: {
          opacity: 0,
        },
        stack: "confidence-band",
        symbol: "none",
      },
      {
        name: "U",
        type: "line",
        data: data[0].map(function (item) {
          return item.u - item.l;
        }),
        lineStyle: {
          opacity: 0,
        },
        areaStyle: {
          color: "#ccc",
        },
        stack: "confidence-band",
        symbol: "none",
      },
      {
        name: "median",
        type: "line",
        data: data[0].map(function (item) {
          return item.value;
        }),
        itemStyle: {
          color: "#333",
        },
        lineStyle: {
          width: 3.5,
          color:
            props.data.trend[0] === "positive"
              ? "#F8766D"
              : props.data.trend[0] === "negative"
              ? "#619CFF"
              : "#3f3f3f",
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

export default TrendMonthChart;
