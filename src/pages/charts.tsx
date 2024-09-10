"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { HeadFC, PageProps } from "gatsby";
import {
  AspectRatio,
  Title,
  Center,
  Grid,
  Space,
  Divider,
  Skeleton,
  Container,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import SelectCrime from "../components/SelectCrime";
import { groupBy, sortBy, maxBy } from "lodash-es";

import { annualizeRate } from "../components/utils";

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

import { round1, YYYYmmddToDate15, getMonthYear } from "../components/utils";
import LazyLoad from "react-lazy-load";
import { SEO } from "../components/SEO";
import social_image from "../images/social/social-charts.jpg";
import social_image_en from "../images/social/social-charts_en.jpg";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

const SectoresPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

  const [groupedData, setGroupedData] = useState(null);
  const [dataMax, setDataMax] = useState(null);
  const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");
  const updateCrime = (crime) => {
    setSelectedCrime(crime);
  };
  const echartsInstance = useRef([]);

  useEffect(() => {
    if (echartsInstance?.current?.length) {
      echartsInstance.current.forEach((item) =>
        item.getEchartsInstance().showLoading()
      );
    }
    const url =
      `${data.site.siteMetadata.apiUrl}/api/v1/sectores/all/crimes/` +
      selectedCrime.replaceAll(" ", "%20") +
      `/series`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.rows.forEach(
          (x) =>
            (x["rate"] = round1(annualizeRate(x.count, x.date, x.population)))
        );

        let groupedData = groupBy(data.rows, function (x) {
          return x.sector;
        });
        setGroupedData(groupedData);

        let maxRate = maxBy(data.rows, function (x) {
          return (x.population !== null) & (x.population !== 0) ? x.rate : 0;
        })["rate"];
        setDataMax(maxRate);
      })
      .finally(() => {
        if (echartsInstance?.current?.length) {
          echartsInstance.current.forEach((item) =>
            item.getEchartsInstance().hideLoading()
          );
        }
      });
  }, [selectedCrime]);

  const sortSectores = (groupedData) => {
    let lastRates = Object.entries(groupedData).map((item) => ({
      sector: item[0],
      rate: -item[1][item[1].length - 1].rate,
    }));
    let sectores = sortBy(lastRates, function (o) {
      return o.rate;
    });
    sectores = sectores.filter(function (x) {
      return x.sector !== "NO ESPECIFICADO";
    });
    return sectores;
  };

  const singleChart = (sector, i) => {
    let chartOption = {
      animation: true,
      animationDuration: 0,
      title: {
        text: sector.sector,
        top: "3%",
        left: "center",
        textStyle: {
          fontFamily: "system-ui",
          fontSize: 13.5,
          fontWeight: "bold",
          color: "#111",
        },
      },
      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "#111",
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        },
        axisPointer: {
          animation: false,
        },
      },
      grid: {
        left: "45",
        right: "17",
        bottom: "15%",
        top: "25%",
        containLabel: false,
      },
      xAxis: {
        animation: false,
        type: "category",
        data: groupedData[sector.sector].map((item) => item.date),
        axisLabel: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#4d4d4d",
          interval: 35, //3 years
          formatter: function (value, idx) {
            var date = YYYYmmddToDate15(value);
            return getMonthYear(date, language, "short", "\n");
          },
        },
        boundaryGap: false,
        splitNumber: 2,
      },
      yAxis: [
        {
          animation: false,
          name: t("tasa anualizada"),
          nameLocation: "middle",
          nameGap: 25,
          nameTextStyle: {
            fontFamily: "Arial",
            fontSize: 11,
            color: "#222",
          },
          type: "value",
          scale: false,
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#b3b2b2",
              width: 0.4,
            },
          },
          axisLabel: {
            fontFamily: "Arial",
            fontSize: 11,
            color: "#4d4d4d",
            margin: 0,
            padding: [0, 2, 0, 0],
          },
          interval:
            Math.round(Math.round((((dataMax + 5) / 10) * 10) / 3) / 10) * 10,
          max: Math.round((dataMax + 5) / 10) * 10,
        },
      ],
      series: [
        {
          emphasis: {
            lineStyle: { width: 1.2 },
          },
          name: "ssp",
          type: "line",
          data: groupedData[sector.sector].map((item) => item.rate),
          itemStyle: {
            color: "#333",
          },
          lineStyle: {
            width: 1.2,
            color: "#008085",
          },
          showSymbol: false,
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

    return (
      <ReactEChartsCore
        ref={(ref) => (echartsInstance.current[i] = ref)}
        echarts={echarts}
        option={chartOption}
        style={{ height: "100%", width: "100%" }}
        //opts={{ locale: echarts.registerLocale("ES") }}
        //showLoading={true}
        //onChartReady={onChartReady}
        loadingOption={loadingOption}
      />
    );
  };

  return (
    <Layout language={language} pageContext={pageContext}>
      <Center>
        <Title
          order={1}
          py=".5rem"
          /* styles={{
                root: {
                  fontFamily:
                    "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif;",
                },
              }} */
        >
          <Trans>
            Small multiple charts of crime in Mexico City (ordered by the last
            available value)
          </Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />
      <Container pb="1rem" size="25rem">
        <SelectCrime updateCrime={updateCrime} />
      </Container>
      <Grid pl={20}>
        {groupedData
          ? sortSectores(groupedData).map((sector, i) => (
              <Grid.Col
                key={i + "grid"}
                span={{ base: 12, md: 6, lg: 4, xl: 3 }}
              >
                <Space key={i + "sp1"} h="xl" />
                <Space key={i + "sp2"} h="xl" />
                <AspectRatio key={i + "aspect"} ratio={5 / 3} p={15}>
                  <LazyLoad once offset={200}>
                    {singleChart(sector, i)}
                  </LazyLoad>
                </AspectRatio>
              </Grid.Col>
            ))
          : [...Array(12).keys()].map((i) => (
              <Grid.Col
                key={i + "grid"}
                span={{ base: 12, md: 6, lg: 4, xl: 3 }}
              >
                <Space key={i + "sp1"} h="xl" />
                <Space key={i + "sp2"} h="xl" />
                <AspectRatio key={i + "aspect"} ratio={5 / 3} p={15}>
                  <Skeleton
                    height="100%"
                    width="100%"
                    style={{ position: "absolute" }}
                  />
                </AspectRatio>
              </Grid.Col>
            ))}
      </Grid>
    </Layout>
  );
};

export default SectoresPage;

export const Head: HeadFC = (props) => {
  const { language } = props.pageContext;
  return (
    <SEO
      image={language === "es" ? social_image : social_image_en}
      props={props}
    />
  );
};

export const query = graphql`
  query ($language: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        satelliteMap
        osmTilesUrl
        apiUrl
      }
    }
    locales: allLocale(
      filter: { ns: { in: ["common", "charts"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
