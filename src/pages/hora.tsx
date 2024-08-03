"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { HeadFC, PageProps } from "gatsby";
import {
  AspectRatio,
  Title,
  Center,
  Grid,
  Space,
  Text,
  Skeleton,
} from "@mantine/core";
import "@mantine/core/styles.css";
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
import social_image from "../images/social/social-hora.jpg";
import social_image_en from "../images/social/social-hora.jpg";

//import '../assets/css/trends.css';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

interface Crime {
  count: number;
  crime: string;
  end_date: string;
  hour: string;
  start_date: string;
}

const HoraPage: React.FC<PageProps> = ({ pageContext, location, data: meta }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [period, setPeriod] = useState(null);

  const [groupedData, setGroupedData] = useState(null);

  useEffect(() => {
    const url = `${meta.site.siteMetadata.apiUrl}/api/v1/df/crimes/ALL/hours`;
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

  const singleChart = (crime) => {
    const startHour = 5;
    let arr24 = [...Array(24).keys()].map((foo) => foo);
    arr24 = [...arr24.slice(startHour, 24), ...arr24.slice(0, startHour - 1)];
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
          fontFamily: "Roboto Condensed",
        },
        axisPointer: {
          animation: false,
        },
        formatter: (item) => {
          if (item.name >= 12)
            return `<b>${item.name}:00 </b>: ${item.value} ` + t("crimes");
          else return `<b>${item.name}:00</b>: ${item.value} ` + t("crimes");
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
        name: t("hour"),
        animation: false,
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#222",
        },
        data: arr24,
        axisLabel: {
          fontFamily: "Arial",
          fontSize: 11,
          color: "#4d4d4d",
          interval: 7,
          formatter: function (value, idx) {
            if (value >= 12) return (value % 12) + " PM";
            else return value + " AM";
          },
        },
        axisTick: { alignWithLabel: true },
        boundaryGap: ["20%", "0%"],
        splitNumber: 2,
      },
      yAxis: [
        {
          animation: false,
          name: t("count"),
          nameLocation: "middle",
          nameGap: 35,
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
          barWidth: "86%",
          itemStyle: { borderWidth: 10 },
          // make sure the data has no missing hours
          data: arr24.map(function (item) {
            let d = crime[1].filter(
              (x: Crime) => parseInt(x.hour) === parseInt(item)
            );
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
      else return 0;
    });
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
          <Center>
            {" "}
            <Trans>
              Crime in Mexico City by hour of day for the last 12 months
            </Trans>
          </Center>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>

      <Grid pl={20}>
        {groupedData
          ? sort(groupedData).map((crime, i) => (
              <Grid.Col key={i + "grid"} span={{ base: 12, md: 6, lg: 4 }}>
                <Space key={i + "sp1"} h="xl" />
                <Space key={i + "sp2"} h="xl" />
                <AspectRatio key={i + "aspect"} ratio={5 / 3} h={340} p={15}>
                  {singleChart(crime)}
                </AspectRatio>
              </Grid.Col>
            ))
          : [...Array(4).keys()].map((i) => (
              <Grid.Col key={i + "grid"} span={{ base: 12, md: 6, lg: 4 }}>
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

export default HoraPage;

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
      filter: { ns: { in: ["common", "hora"] }, language: { eq: $language } }
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
