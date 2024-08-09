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
  Text,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { translations } from "../../i18n/translations/head_translations";

import { groupBy } from "lodash-es";

import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";
import { YYYYmmddToDate15 } from "../components/utils";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-dia.jpg";
import social_image_en from "../images/social/social-dia.jpg";

//import '../assets/css/trends.css';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

const DiaPage: React.FC<PageProps> = ({
  pageContext,
  location,
  data: meta,
}) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [period, setPeriod] = useState(null);

  const [groupedData, setGroupedData] = useState(null);

  useEffect(() => {
    const url = `${meta.site.siteMetadata.apiUrl}/api/v1/df/crimes/ALL/days`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let groupedData = groupBy(data.rows, function (x) {
          return x.crime;
        });
        setGroupedData(groupedData);
        let dateStart = YYYYmmddToDate15(data.rows[0].start_date);
        let dateStrStart = [
          dateStart.toLocaleString(language, { month: "long" }),
          dateStart.getFullYear(),
        ].join(" ");
        let dateEnd = YYYYmmddToDate15(data.rows[0].end_date);
        let dateStrEnd = [
          dateEnd.toLocaleString(language, { month: "long" }),
          dateEnd.getFullYear(),
        ].join(" ");
        setPeriod(dateStrStart + " " + t("to") + " " + dateStrEnd);
      });
  }, []);

  const sort = (data) => {
    return Object.entries(data).sort((x, z) => {
      if (x[0] === "HOMICIDIO DOLOSO") return -99;
      if (z[0] === "HOMICIDIO DOLOSO") return 99;
      if (x[0] === "ROBO DE VEHICULO AUTOMOTOR C.V.") return -23;
      if (z[0] === "ROBO DE VEHICULO AUTOMOTOR C.V.") return 23;
      if (x[0] === "ROBO DE VEHICULO AUTOMOTOR S.V.") return -45;
      if (z[0] === "ROBO DE VEHICULO AUTOMOTOR S.V.") return 45;
      if (x[0] === "LESIONES POR ARMA DE FUEGO") return -77;
      if (z[0] === "LESIONES POR ARMA DE FUEGO") return 77;
      if (x[0] === "ROBO A TRANSEUNTE C.V.") return 6;
      if (x[0] === "ROBO A TRANSEUNTE S.V.") return 7;
      if (x[0] > z[0]) return 1;
      else return -1;
    });
  };

  const singleChart = (crime) => {
    let arr7 = [...Array(7).keys()].map((foo) => foo);
    let chartOption = {
      animation: true,
      animationDuration: 0,
      title: {
        text: crime[0],
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
        trigger: "item",
        textStyle: {
          color: "#111",
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        },
        axisPointer: {
          animation: false,
        },
        formatter: function (item) {
          const dummyDate = new Date(2001, 0, parseInt(item.name));
          return (
            dummyDate.toLocaleDateString(language, { weekday: "long" }) +
            `: ${item.value}`
          );
        },
      },
      grid: {
        left: "55",
        right: "17",
        bottom: "15%",
        top: "25%",
        containLabel: false,
      },
      xAxis: {
        type: "category",
        animation: false,
        name: t("day of week"),
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#222",
        },
        data: arr7,
        axisLabel: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#4d4d4d",
          interval: 0,
          formatter: function (value, idx) {
            const dummyDate = new Date(2001, 0, value);
            return dummyDate.toLocaleDateString(language, { weekday: "short" });
          },
        },
        boundaryGap: ["20%", "0%"],
        splitNumber: 2,
      },
      yAxis: [
        {
          animation: false,
          name: t("count"),
          nameLocation: "middle",
          nameGap: 33,
          nameTextStyle: {
            fontFamily: "Arial",
            fontSize: 11,
            color: "#222",
          },
          axisLAbel: {},
          type: "value",
        },
      ],
      series: [
        {
          name: "count",
          type: "bar",
          color: "#d95850",
          barWidth: "95%",
          itemStyle: { borderWidth: 10 },
          // make sure the data has no missing hours
          data: arr7.map(function (item) {
            let d = crime[1].filter((x) => parseInt(x.dow) === parseInt(item));
            return d.length ? d[0].count : 0;
          }),
        },
      ],
    };

    return (
      <ReactEChartsCore
        echarts={echarts}
        option={chartOption}
        style={{ height: "100%", width: "100%" }}
        //opts={{ locale: echarts.registerLocale("ES") }}
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
        siteUrl={meta.site.siteMetadata.siteUrl}
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
          <Trans>
            Crime in Mexico City by day of week for the last 12 months
          </Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />

      <Grid pl={20}>
        {groupedData
          ? sort(groupedData).map((crime, i) => (
              <Grid.Col
                key={i + "grid"}
                span={{ base: 12, md: 6, lg: 4, xl: 3 }}
              >
                <Space key={i + "sp1"} h="xl" />
                <Space key={i + "sp2"} h="xl" />
                <AspectRatio key={i + "aspect"} ratio={5 / 3} h={340} p={15}>
                  {singleChart(crime)}
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
                <AspectRatio key={i + "aspect"} ratio={5 / 3} h={340} p={15}>
                  <Skeleton
                    height="100%"
                    width="100%"
                    style={{ position: "absolute" }}
                  />
                </AspectRatio>
              </Grid.Col>
            ))}
      </Grid>
      <Text>
        <Trans>Data from</Trans> {period}
      </Text>
    </Layout>
  );
};

export default DiaPage;

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
      filter: { ns: { in: ["common", "dia"] }, language: { eq: $language } }
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
