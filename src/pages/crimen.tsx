"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
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
import { translations } from "../../i18n/translations/head_translations";

import { daysInMonth } from "../components/utils";
import { groupBy, sortBy } from "lodash-es";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-crimen.jpg";
import social_image_en from "../images/social/social-crimen_en.jpg";

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
import { round1, YYYYmmddToDate15 } from "../components/utils";
//import '../assets/css/trends.css';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  CanvasRenderer,
]);

const CrimenPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

  const [groupedData, setGroupedData] = useState(null);

  useEffect(() => {
    const url = `${data.site.siteMetadata.apiUrl}/api/v1/df/crimes/all/series_extra`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.ssp.forEach(
          (x) =>
            (x["rate"] = round1(
              (((x.count /
                daysInMonth(x.date.substr(5, 6), x.date.substr(0, 4))) *
                30) /
                x.population) *
                100000 *
                12
            ))
        );
        let population = data.ssp[0].population;
        data.pgj.forEach((x) => {
          x["population"] = population;
          x["rate"] = round1(
            (((x.count /
              daysInMonth(x.date.substr(5, 6), x.date.substr(0, 4))) *
              30) /
              population) *
              100000 *
              12
          );
        });

        let groupsSSP = groupBy(data.ssp, function (x) {
          return x.crime;
        });
        let groupsPGJ = groupBy(data.pgj, function (x) {
          return x.crime;
        });
        setGroupedData({ ssp: groupsSSP, pgj: groupsPGJ });
      });
  }, []);

  const sort = (data) =>
    sortBy(
      Object.keys(data).map((k) => k),
      (x) => {
        if (x === "HOMICIDIO DOLOSO") return -5;
        if (x === "ROBO DE VEHICULO AUTOMOTOR C.V.") return -4;
        if (x === "ROBO DE VEHICULO AUTOMOTOR S.V.") return -3;
        if (x === "ROBO A TRANSEUNTE C.V.") return 6;
        if (x === "ROBO A TRANSEUNTE S.V.") return 7;
        if (x === "LESIONES POR ARMA DE FUEGO") return 5;
        return 9999;
      }
    );

  const singleChart = (crime) => {
    let homicides = [
      116, 93, 128, 99, 137, 90, 92, 93, 111, 94, 109, 139, 114, 115, 144, 127,
      108, 123, 107, 88, 84, 109, 110, 111, 100, 105, 109, 102, 113, 57, 104,
      108, 75, 67, 71, 65, 70, 45, 63, 51, 65, 49, 53, 59, 60, 62, 82, 88,
    ];
    let population = groupedData.ssp[crime][0].population;

    let chartOption = {
      animation: true,
      animationDuration: 0,
      title: {
        text: crime,
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
          fontFamily: "Roboto Condensed",
        },
        axisPointer: {
          animation: false,
        },
        // formatter: function (value, idx) {
        // let date = new Date(item.name);
        // let datestr = [
        //   date.toLocaleString(props.lang, { month: "long" }),
        //   date.getFullYear(),
        // ].join(" ");
        //},
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
        data: groupedData.ssp[crime].map((item) => item.date),
        axisLabel: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#4d4d4d",
          interval: 35, //3 years
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
          splitNumber: 2,
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
        },
      ],
      series: [
        {
          emphasis: {
            lineStyle: { width: 1.2 },
          },
          name: "FGJ-CDMX",
          type: "line",
          data: groupedData.ssp[crime].map((item) => item.rate),
          itemStyle: {
            color: "#333",
          },
          lineStyle: {
            width: 1.2,
            color: "#6b3c04",
          },
          showSymbol: false,
        },
        {
          emphasis: {
            lineStyle: { width: 1.2 },
          },
          name: "SESNSP",
          type: "line",
          data:
            typeof groupedData.pgj[crime] !== "undefined"
              ? groupedData.pgj[crime].map((item) => item.rate)
              : null,
          itemStyle: {
            color: "#333",
          },
          lineStyle: {
            width: 1.2,
            color: "#ec8407",
          },
          showSymbol: false,
        },
        {
          emphasis: {
            lineStyle: { width: 1.2 },
          },
          name: "INEGI",
          type: "line",
          data:
            crime === "HOMICIDIO DOLOSO"
              ? homicides.map((x, i) =>
                  round1(
                    (((x /
                      daysInMonth(
                        groupedData.ssp[crime][i].date.substr(5, 6),
                        groupedData.ssp[crime][i].date.substr(0, 4)
                      )) *
                      30) /
                      population) *
                      100000 *
                      12
                  )
                )
              : null,
          itemStyle: {
            color: "#333",
          },
          lineStyle: {
            width: 1.4,
            color: "#db4437",
          },
          showSymbol: false,
        },
      ],
    };

    return (
      <ReactEChartsCore
        echarts={echarts}
        option={chartOption}
        style={{ height: "100%", width: "100%" }}
        opts={{ locale: echarts.registerLocale("ES") }}
        //showLoading={true}
        //onChartReady={onChartReady}
        //loadingOption={{ text: intl.formatMessage({ id: 'loading' }) }}
      />
    );
  };

  return (
    <Layout language={language} pageContext={pageContext}>
      <SocialImage
        social_image={social_image}
        social_image_en={social_image_en}
        siteUrl={data.site.siteMetadata.siteUrl}
        language={language}
      />
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
          <Trans>Small multiple charts of crime in all of Mexico City</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Container>
        <Center>
          <span style={{ color: "#6b3c04" }}>— FGJ-CDMX</span>
          <span style={{ color: "#ec8407" }}>— SESNSP </span>
          <span style={{ color: "#db4437" }}>— INEGI </span>
        </Center>
      </Container>
      <Divider my="xl" />

      <Grid pl={20}>
        {groupedData
          ? sort(groupedData.ssp).map((crime, i) => (
              <Grid.Col
                key={i + "grid"}
                span={{ base: 12, md: 6, lg: 4, xl: 3 }}
              >
                <Space key={i + "sp1"} h="xl" />
                <Space key={i + "sp2"} h="xl" />
                <AspectRatio key={i + "aspect"} ratio={5 / 3} p={15}>
                  {singleChart(crime)}
                </AspectRatio>
              </Grid.Col>
            ))
          : [...Array(4).keys()].map((i) => (
              <Grid.Col key={i + "grid"} span={{ base: 12, md: 6, lg: 4 }}>
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

export default CrimenPage;

export { Head } from "../components/Head";

export const query = graphql`
  query ($language: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        year
        satelliteMap
        osmTilesUrl
        apiUrl
      }
    }
    locales: allLocale(
      filter: { ns: { in: ["common", "crimen"] }, language: { eq: $language } }
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
