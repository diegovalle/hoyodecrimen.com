import React from "react";
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

function LineMonthChart(props) {
  const {
    lang,
    height = 170,
    title = "", // eslint-disable-line
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;

  let data = formatData(props.data);
  

  let chartOption = {
    animation: false,
    title: {
      text: props.title,
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
        return `${datestr}<br/>${tasa}: <b>${
          Math.round(item.value * 10) / 10
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
      data: data[0].map(function (item) {
        return item.date;
      }),
      axisLabel: {
        interval: 23,
        formatter: function (value, idx) {
          var date = new Date(value);
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
        name: props.yname,
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { fontFamily: "Roboto Condensed" },
        type: "value",
        scale: false,
        splitNumber: 2,
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
          color: "transparent",
          opacity: 0,
        },
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        z: 1000,
      },
      {
        name: "rate",
        type: "line",
        data: data[1].map(function (item) {
          return item.value;
        }),
        itemStyle: {
          color: "#333",
        },
        lineStyle: {
          width: 2,
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
        echarts={echarts}
        option={chartOption}
        style={{ height: 450, width: "100%" }}
        opts={{ locale: echarts.registerLocale(props.lang) }}
      />
    </LazyLoad>
  );
}

export default LineMonthChart;
