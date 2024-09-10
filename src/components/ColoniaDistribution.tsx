import React from "react";
import { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
//import {useIntl} from 'react-intl';
//import {dateLoc} from '../../src/i18n';

import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  MarkAreaComponent,
  MarkLineComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";

import { axisLabel } from "./utils";

import { useTranslation } from "gatsby-plugin-react-i18next";
import { round0, YYYYmmddToDate15, getMonthYear } from "./utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  MarkAreaComponent,
  MarkLineComponent,
]);

function CrimeSectorDiffMonthChart(props) {
  const {
    selectedRegion,
    setPeriod,
    coloniaName,
    language,
    period,
    lang,
    title = "", // eslint-disable-line
    fontWeight = "normal", // eslint-disable-line
    fontSize = 14, // eslint-disable-line
    ...restProps // eslint-disable-line
  } = props;

  const [data, setData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [pointEstimate, setPointEstimate] = useState(null);
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
  let option = {
    animation: false,
    title: {
      //text: props.title,
      left: "center",
      textStyle: {
        fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        //fontSize: props.fontSize,
        //fontWeight: props.fontWeight,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      name: t("homicide rate"),
      nameLocation: "middle",
      nameGap: 30,
      type: "value",
    },
    yAxis: [
      {
        name: t("frequency"),
        nameLocation: "middle",
        nameGap: 30,
        // nameTextStyle: { ...nameTextStyle },
        axisLabel: {
          ...axisLabel,
          formatter: (v, i) => (i < 3 ? v : ""),
          interval: (index, value) => {
            if (i < 3) return true;
            return false;
          },
        },
        axisTick: {
          // show: true,
          interval: (index, value) => {
            if (i < 3) return true;
            return false;
          },
        },
        splitNumber: 2,
        type: "value",
        // scale: false,
        // splitNumber: 2,
        // axisLine: { show: false },
        // interval: max_y
        //   ? Math.round(Math.round((max_y + 100) / 3) / 100) * 100
        //   : null,
        //max: max_y ? max_y + 50 : null,
        splitLine: {
          show: true,
          lineStyle: {
            type: "solid",
            color: ["#b3b2b2", "#b3b2b2", "#b3b2b2", "transparent"],
          },
        },
      },
    ],
    series: [
      {
        name: "rate",
        type: "bar",
        barWidth: "99%",
        itemStyle: {
          color: "#fdbb84",
        },
        showSymbol: false,
      },
    ],
  };

  function histogram(data, size) {
    let min = Infinity;
    let max = -Infinity;

    for (const item of data) {
      if (item < min) min = item;
      else if (item > max) max = item;
    }

    const bins = Math.ceil((max - min + 1) / size);
    const bin_width = (max - min) / bins;
    const histogram = [];
    // Add an extra 2 bins to add padding to the xAxis
    for (let i = 0; i < bins + 2; i++) {
      histogram.push([bin_width * (i + 1), 0]);
    }

    for (const item of data) {
      histogram[Math.floor((item - min) / size)][1]++;
    }

    return histogram;
  }

  useEffect(() => {
    const fetchData = async (retries = 3) => {
      const url = `${meta.site.siteMetadata.apiUrl}/api/v1/get_file?file_name=smoothgamhomicides`;

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setData(data);
        let pointEstimate = data[0].pred_rate.map((i) => Math.exp(i));
        setPointEstimate(pointEstimate);
        option.series[0].data = histogram(pointEstimate, 2);

        let low = data[0].pred_rate.map((item, i) =>
          Math.exp(item - 1.96 * data[0]["se.fit"][i])
        );
        setLow(low);

        let high = data[0].pred_rate.map((item, i) =>
          Math.exp(item + 1.96 * data[0]["se.fit"][i])
        );
        setHigh(high);

        let max = Math.max(...option.series[0].data.map((item) => item[1]));
        option.yAxis.max = max;
        option.yAxis.interval = Math.round((max + 100) / 3 / 50) * 50;

        setChartOptions({ ...option });

        let dateStart = YYYYmmddToDate15(data[1].start[0]);
        let dateStrStart = getMonthYear(dateStart, props.lang, "long", " ");
        let dateEnd = YYYYmmddToDate15(data[2].end[0]);
        let dateStrEnd = getMonthYear(dateEnd, language, "long", " ");
        setPeriod(dateStrStart + " " + t("to") + " " + dateStrEnd);
      } catch (error) {
        console.error("Fetch error:", error);
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          await fetchData(retries - 1);
        } else {
          console.error("Max retries reached. Fetch failed.");
        }
      }
    };

    fetchData();
  }, [meta.site.siteMetadata.apiUrl, language, t]);

  useEffect(() => {
    if (!data | !low | !high) return;
    let idx = data[0].CVEUT.findIndex((element) => element === selectedRegion);

    if (idx) {
      option.series[0].markArea = {
        ...{
          silent: true,
          itemStyle: {
            color: "rgba(255, 173, 177, 0.3)",
          },
          data: [
            [
              {
                xAxis: low[idx],
                itemStyle: {
                  color: "rgba(150,150,150, 0.3)",
                },
              },
              {
                xAxis: high[idx],
                itemStyle: {
                  color: "rgba(150,150,150, 0.3)",
                },
              },
            ],
          ],
        },
      };
      if (selectedRegion !== "null")
        option.series[0].markLine = {
          ...{
            silent: true,
            lineStyle: { color: "#b30000", type: "solid", width: 2.5 },
            data: [
              {
                name: "",
                xAxis: pointEstimate[idx],
                label: {
                  formatter:
                    (coloniaName ? coloniaName : "") +
                    " \n" +
                    t("Homicide Rate") +
                    ": " +
                    round0(pointEstimate[idx]),
                  position: "end",
                  fontStyle: "bold",
                },
              },
            ],
          },
        };
      else option.series[0].markLine = { ...{} };
    }
    setChartOptions({ ...option });
  }, [selectedRegion]);

  return (
    <>
      {chartOptions ? (
        <ReactEChartsCore
          echarts={echarts}
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
        />
      ) : null}
    </>
  );
}

export default CrimeSectorDiffMonthChart;
