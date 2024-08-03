import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
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
import { annualizeRate, YYYYmmddToDate15 } from "./utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

const cdmx_pop = [
  9323252, 9327349, 9331196, 9334743, 9337938, 9340731, 9343071, 9344915,
  9346257, 9347100, 9347446, 9347297, 9346655, 9345524, 9343904, 9341799,
  9339210, 9336141, 9332593, 9328579, 9324158, 9319398, 9314368, 9309136,
  9303772, 9298344, 9292920, 9287570, 9282363, 9277366, 9272649, 9268265,
  9264211, 9260468, 9257016, 9253838, 9250913, 9248224, 9245751, 9243475,
  9241378, 9239440, 9237644, 9235970, 9234404, 9232932, 9231541, 9230216,
  9228943, 9227710, 9226501, 9225303, 9224102, 9222885, 9221637, 9220347,
  9219015, 9217644, 9216237, 9214797, 9213326, 9211828, 9210305, 9208759,
  9207194, 9205613, 9204018, 9202411, 9200792, 9199159, 9197512, 9195849,
  9194169, 9192470, 9190752, 9189013, 9187251, 9185467, 9183658, 9181823,
  9179962, 9178076, 9176164, 9174227, 9172264, 9170277, 9168264, 9166226,
  9164164, 9162077, 9159966, 9157829, 9155669, 9153484, 9151275, 9149042,
  9146784, 9144502, 9142197, 9139867, 9137513, 9135135, 9132734, 9130308,
  9127859, 9125387, 9122891, 9120373, 9117833, 9115270, 9112686, 9110080,
  9107453, 9104804, 9102136, 9099446, 9096737, 9094008, 9091259, 9088491,
  9085705, 9082900, 9080077, 9077236, 9074377, 9071502, 9068610, 9065701,
  9062776, 9059835, 9056878, 9053906, 9050920, 9047919, 9044903, 9041874,
  9038830, 9035774, 9032705, 9029622, 9026528, 9023421, 9020302, 9017171,
  9014030, 9010876, 9007712, 9004537, 9001352, 8998156, 8994951, 8991735,
  8988510, 8985276, 8982033, 8978781, 8975521, 8972253, 8968977, 8965693,
  8962402, 8959104, 8955799, 8952487, 8949169, 8945844, 8942514, 8939177,
  8935835, 8932487, 8929133, 8925774, 8922410, 8919041, 8915667, 8912287,
  8908903, 8905515, 8902121, 8898724, 8895321, 8891915, 8888504, 8885089,
  8881670, 8878247, 8874820, 8871388, 8867953, 8864515, 8861072, 8857625,
  8854175, 8850720, 8847262, 8843799, 8840333, 8836863, 8833389, 8829910,
  8826428, 8822941, 8819450, 8815954, 8812454, 8808948, 8805437, 8801921,
  8798399, 8794871, 8791338, 8787798, 8784252, 8780699, 8777139, 8773573,
  8769999, 8766417, 8762828, 8759231, 8755626, 8752012, 8748390,
];

function CDMXLineChart(props) {
  const {
    pageContext,
    lang,
    height = 170,
    title = "", // eslint-disable-line
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;
  const [CDMXRate, setCDMXRate] = useState(null);
  //const { language } = props.pageContext;
  const { t } = useTranslation();

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
    const url = `${meta.site.siteMetadata.apiUrl}/api/v1/df/crimes/HOMICIDIO%20DOLOSO/series`;
    fetch(url)
      .then((response) => response.json())
      .then((responseJSON) => {
        responseJSON.rows.forEach(
          (x, i) => (x["rate"] = annualizeRate(x.count, x.date, cdmx_pop[i]))
        );
        setCDMXRate(responseJSON.rows);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
          fontFamily: "Roboto Condensed",
        },
      },
      formatter: function (item) {
        let date = YYYYmmddToDate15(item[0].name);
        let datestr = [
          date.toLocaleString(props.lang, { month: "long" }),
          date.getFullYear(),
        ].join(" ");
        let c = CDMXRate[item[0].dataIndex].count;
        return (
          `${datestr}<br/><b>` +
          t("Rate") +
          `</b>:${Math.round(item[0].data * 10) / 10} <i>(${c} ` +
          t("homicides") +
          ")</i>"
        );
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      nameTextStyle: { fontFamily: "Roboto Condensed", color: "#111" },
      data: CDMXRate
        ? CDMXRate.map(function (item) {
            return item.date;
          })
        : null,
      axisLabel: {
        interval: 23,
        formatter: function (value, idx) {
          var date = YYYYmmddToDate15(value);
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
        name: t("homicide rate"),
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { fontFamily: "Roboto Condensed", color: "#111" },
        type: "value",
        scale: false,
        splitNumber: 2,
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
        type: "line",
        data: CDMXRate
          ? CDMXRate.map(function (item) {
              return item.rate;
            })
          : null,
        itemStyle: {
          color: "black",
          opacity: 0,
        },
        z: 1000,
      },
    ],
  };

  return (
    <>
      <ReactEChartsCore
        echarts={echarts}
        option={chartOption}
        style={{ height: height, width: "100%" }}
        opts={{ locale: echarts.registerLocale(props.lang) }}
      />
    </>
  );
}

export default CDMXLineChart;
