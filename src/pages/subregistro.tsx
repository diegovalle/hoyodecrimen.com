"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { timeFormatDefaultLocale } from "d3-time-format";
import { useI18next, useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { MantineLogo } from "@mantine/ds";
import type { HeadFC, PageProps } from "gatsby";
import { HeaderMenu } from "../components/HeaderMenu";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { MantineProvider, Navbar, Header } from "@mantine/core";
import {
  AspectRatio,
  Title,
  Text,
  Menu,
  Center,
  Container,
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Grid,
  Space,
  Divider,
  Blockquote,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-colonias.jpg";
import social_image_en from "../images/social/social-colonias_en.jpg";
import deathData from "../assets/hom_acc_na.json";

import * as echarts from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { YYYYmmddToDate15 } from "../components/utils";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

const prevalencia_hogares = [
  { year: 2012, per: 39.1 },
  { year: 2013, per: 40.9 },
  { year: 2014, per: 45.6 },
  { year: 2015, per: 43.7 },
  { year: 2016, per: 42.1 },
  { year: 2017, per: 52.8 },
  { year: 2018, per: 51.5 },
  { year: 2019, per: 43.8 },
  { year: 2020, per: 39.7 },
  { year: 2021, per: 37.3 },
  { year: 2022, per: 37.4 },
];

const SubregistroPage: React.FC<PageProps> = ({
  pageContext,
  location,
  data,
}) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

  let chartOption = {
    animation: false,
    legend: {},
    title: {
      text: "",
      left: "center",
      textStyle: {
        fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
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
      /* formatter: function (item) {
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
      }, */
    },
    /* grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    }, */
    xAxis: {
      type: "category",
      nameTextStyle: {
        fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        color: "#111",
      },
      data: deathData.map(function (item) {
        return item.yearmon;
      }),
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
      splitNumber: 6,
    },
    yAxis: [
      {
        name: t("number of deaths"),
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: {
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
          color: "#111",
        },
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
        name: t("homicides"),
        type: "line",
        data: deathData.map(function (item) {
          return item.homicides;
        }),
        itemStyle: {
          color: "#f8766D",
          opacity: 0,
        },
      },
      {
        name: t("accidents with no mechanism of injury specified"),
        type: "line",
        data: deathData.map(function (item) {
          return item.na_accident;
        }),
        itemStyle: {
          color: "#00BFC4",
          opacity: 0,
        },
      },
    ],
  };

  let hogarChartOption = {
    animation: false,
    title: {
      text: "",
      left: "center",
      textStyle: {
        fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        fontSize: 14,
        fontWeight: "bold",
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
      /* formatter: function (item) {
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
      }, */
    },
    /* grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    }, */
    xAxis: {
      type: "category",
      nameTextStyle: {
        fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
        color: "#111",
      },
      data: prevalencia_hogares.map(function (item) {
        return item.year;
      }),
      axisLabel: {
        interval: 2,
      },
      boundaryGap: false,
      boundaryGap: ["20%", "0%"],
      splitNumber: 6,
    },
    yAxis: [
      {
        name: t("% households"),
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: {
          fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
          color: "#111",
        },
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
        name: t("percentage"),
        type: "bar",
        color: "#542600",
        barWidth: "85%",
        itemStyle: { borderWidth: 10 },
        data: prevalencia_hogares.map(function (item) {
          return item.per;
        }),
      },
    ],
  };

  useEffect(() => {}, []);

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
          <Trans>Underreporting Crime</Trans>
        </Title>
      </Center>

      <Center>
        <Space h="sm" />
      </Center>

      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 6 }}
          offset={{ base: 0, md: 3, lg: 3 }}
        >
          <Trans i18nKey="introduccion" />

          <Space h="xl" />
          <Trans i18nKey="intro2" />
          <Space h="xl" />
        </Grid.Col>
      </Grid>

      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 10, lg: 10 }}
          offset={{ base: 0, md: 1, lg: 1 }}
        >
          <ReactEChartsCore
            echarts={echarts}
            option={chartOption}
            style={{ height: 400, width: "100%" }}
            opts={{ locale: echarts.registerLocale(language) }}
          />
        </Grid.Col>
      </Grid>

      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 6 }}
          offset={{ base: 0, md: 3, lg: 3 }}
        >
          <Space h="md" />
          <Trans i18nKey="error" />

          <Space h="md" />
          <Trans i18nKey="envipe" />
          <Space h="md" />

          <Space h="xl" />
          <Center>
            {" "}
            <Title order={2}>
              {t("Percentage of households that experienced crime")}
            </Title>
          </Center>
          <Center>
            <Text size="lg">
              {t(
                "Percentage of households where at least one person was the victim of a crime"
              )}
            </Text>
          </Center>

          <ReactEChartsCore
            echarts={echarts}
            option={hogarChartOption}
            style={{ height: 400, width: "100%" }}
            opts={{ locale: echarts.registerLocale(language) }}
          />

          <Space h="xl" />
          <Blockquote color="orange" cite={t("Source: ENVIPE")}>
            {t(
              "In 37% of Mexico City households at least one person was the victim of a crime"
            )}
          </Blockquote>

          <Space h="xl" />

          <Space h="md" />
          <Trans i18nKey="victimizacion">
            asdfafd<b>sdf</b>
          </Trans>
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="tasa_denuncia" />
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="investigaciones" />
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="cifra_negra">
            sdfasdf<b>fds</b>
          </Trans>
          <Space h="lg" />

          <Blockquote color="orange" cite={t("Source: ENVIPE")}>
            {t(
              "En la Ciudad de México, el 92.6% de los delitos cometidos quedaron sin denuncia o sin investigación"
            )}
          </Blockquote>

          <Space h="lg" />
          <Trans i18nKey="implicaciones" />
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="conclusion" />
          <Space h="md" />
        </Grid.Col>
      </Grid>

    </Layout>
  );
};

export default SubregistroPage;

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
      }
    }
    locales: allLocale(
      filter: {
        ns: { in: ["common", "subregistro"] }
        language: { eq: $language }
      }
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
