"use client";

import * as React from "react";
import { useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { PageProps } from "gatsby";
import { Title, Text, Center, Grid, Space, Blockquote } from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { SEO } from "../components/SEO";
import social_image from "../images/social/social-subregistro.jpg";
import social_image_en from "../images/social/social-subregistro_en.jpg";
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
  const lastPer = prevalencia_hogares[prevalencia_hogares.length - 1].per;
  const lastYear = prevalencia_hogares[prevalencia_hogares.length - 1].year;
  const lastYear2 = lastYear - 1;
  const delitosDenunciadosLast = 11.1;
  const delitosDenunciadosSecondLast = 11.8;
  const carpetaLast = 67;
  const carpetaSecondLast = 65.9;
  const investigadosLast = 7.4;
  const inevestigaosSecondLast = 7.8;
  const cifraNegra = 100 - investigadosLast;

  let inegiChartOption = {
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
      formatter: function (item) {
        let date = YYYYmmddToDate15(item[0].name);
        let datestr = [
          date.toLocaleString(language, { month: "long" }),
          date.getFullYear(),
        ].join(" ");
        return (
          `${datestr}<br/><br/>` +
          '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
          item[0].color +
          ';"></span>' +
          item[0].seriesName +
          `: <b>` +
          item[0].value +
          "</b><br/>" +
          '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
          item[1].color +
          ';"></span>' +
          item[1].seriesName +
          ": <b>" +
          item[1].value +
          "</b>"
        );
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "17%",
      containLabel: true,
    },
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
    grid: {
      left: "10%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
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
          <Center>
            <Title order={2}>
              {t("Selected Violent Deaths INEGI 2004-2022")}
            </Title>
          </Center>
          <ReactEChartsCore
            echarts={echarts}
            option={inegiChartOption}
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
              "In 37% of Mexico City households at least one person was the victim of a crime in 2023",
              { lastPer: lastPer }
            )}
          </Blockquote>

          <Space h="xl" />

          <Space h="md" />
          <Trans i18nKey="victimizacion" lastPer={lastPer} lastYear={lastYear}>
            asdfafd{{ lastYear }}
            <b>{{ lastPer }}sdf</b>
          </Trans>
          <Space h="md" />

          <Space h="md" />
          <Trans
            lastYear2={lastYear2}
            i18nKey="tasa_denuncia"
            delitosDenunciadosLast={{ delitosDenunciadosLast }}
            delitosDenunciadosSecondLast={{ delitosDenunciadosSecondLast }}
            lastYear={lastYear}
          >
            a{{ delitosDenunciadosLast }}df{{ lastYear }}dsf{{ lastYear2 }}asdf
            {{ delitosDenunciadosSecondLast }}asdf
          </Trans>
          <Space h="md" />

          <Space h="md" />
          <Trans
            i18nKey="investigaciones"
            lastYear2={lastYear2}
            carpetaLast={carpetaLast}
            carpetaSecondLast={carpetaSecondLast}
            investigadosLast={investigadosLast}
            inevestigaosSecondLast={inevestigaosSecondLast}
          >
            afas{{ carpetaLast }}sfsadf{{ carpetaSecondLast }}sadfasdf
            {{ lastYear2 }}
            saddfsaasd{{ investigadosLast }}asdfsadf{{ inevestigaosSecondLast }}
            asdfasdf
          </Trans>
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="cifra_negra" cifraNegra={cifraNegra}>
            sdfasdf<b>{{ cifraNegra }}fds</b>
          </Trans>
          <Space h="lg" />

          <Blockquote color="orange" cite={t("Source: ENVIPE")}>
            {t(
              "In Mexico City 92.6% of crimes were not denounced or investigated by the police",
              { cifraNegra: cifraNegra }
            )}
          </Blockquote>

          <Space h="lg" />
          <Trans i18nKey="implicaciones" />
          <Space h="md" />

          <Space h="md" />
          <Trans i18nKey="conclusion" lastYear={lastYear}>
            asfsadf{{ lastYear }}afs
          </Trans>
          <Space h="md" />
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default SubregistroPage;

export const Head: HeadFC = (props) => {
  const { language } = props.pageContext;
  return (
    <>
      <SEO
        image={language === "es" ? social_image : social_image_en}
        props={props}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://schema.org/",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name:
                language === "en"
                  ? "What is the crime rate in Mexico City?"
                  : "¿Cuál es la tasa de criminalidad en la Ciudad de México",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  language === "en"
                    ? "The overall crime rate in Mexico City was 37.4% according to the National Victimization Survey (ENVIPE). That is, in 37.4% of households at least one person was the victim of a crime in 2022"
                    : "El 37.4% de los hogares en la Ciudad de México tuvo al menos una víctima de delito durante el 2022",
              },
            },
          ],
        })}
      </script>
    </>
  );
};

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
