"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
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
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { translations } from "../../i18n/translations/head_translations";

import TrendMonthChart from "../components/TrendMonthChart";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-tendencias.jpg";
import social_image_en from "../images/social/social-tendencias_en.jpg";

const TrendChartPlaceHolder = (props) => {
  return [...Array(props.n)].map((e, i) => (
    <Grid.Col key={i + props.prefix + "grid"} span={{ base: 12, md: 6, lg: 3 }}>
      <AspectRatio key={i + props.prefix} ratio={5 / 3} h={340} p={15}>
        {" "}
        <Skeleton height="100%" width="100%" style={{ position: "absolute" }} />
      </AspectRatio>
      <Space key={i + props.prefix + "space2"} h="xl" />
    </Grid.Col>
  ));
};

const TasasPage: React.FC<PageProps> = ({
  pageContext,
  location,
  data: meta,
}) => {
  const [data, setData] = useState(null);
  const [CDMXRate, setCDMXRate] = useState(null);
  const { language } = pageContext;
  const { t } = useTranslation();

  useEffect(() => {
    fetch(
      `${meta.site.siteMetadata.apiUrl}/api/v1/get_file?file_name=crime_trends`
    )
      .then((response) => response.json())
      .then((responseJSON) => {
        setData(responseJSON);

        let cdmx_homicidio = JSON.parse(JSON.stringify(responseJSON[1]));
        cdmx_homicidio["HOMICIDIO DOLOSO"][3] = cdmx_homicidio[
          "HOMICIDIO DOLOSO"
        ][3].map((x, i) => (x / cdmx_pop[i]) * 100000 * 12);
        setCDMXRate(cdmx_homicidio);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
          <Trans>Mexico City Crime Trends</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />

      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 6 }}
          offset={{ base: 0, md: 3, lg: 3 }}
        ></Grid.Col>
      </Grid>

      <Grid pl={20}>
        {data ? (
          data.length ? (
            data.map((crime, i) => (
              <Grid.Col key={i + "grid"} span={{ base: 12, md: 6, lg: 3 }}>
                <AspectRatio key={i + "aspect"} ratio={4 / 3} h={255} p={15}>
                  <TrendMonthChart
                    data={crime}
                    key={i}
                    lang={language}
                    height={255}
                    yname={t("number of crimes")}
                    max_y={Math.max(...crime[Object.keys(crime)[0]][3])}
                    fontWeight={
                      Object.keys(crime)[0] === "HOMICIDIO DOLOSO" ||
                      Object.keys(crime)[0] ===
                        "ROBO DE VEHICULO AUTOMOTOR C.V." ||
                      Object.keys(crime)[0] ===
                        "ROBO DE VEHICULO AUTOMOTOR S.V."
                        ? "bolder"
                        : "normal"
                    }
                    fontSize={
                      Object.keys(crime)[0] === "HOMICIDIO DOLOSO" ||
                      Object.keys(crime)[0] ===
                        "ROBO DE VEHICULO AUTOMOTOR C.V." ||
                      Object.keys(crime)[0] ===
                        "ROBO DE VEHICULO AUTOMOTOR S.V."
                        ? 17
                        : 14
                    }
                  />
                </AspectRatio>
                <Space key={i + "sp2"} h="xl" />
              </Grid.Col>
            ))
          ) : (
            <TrendChartPlaceHolder n={15} prefix="a" />
          )
        ) : (
          <TrendChartPlaceHolder n={15} prefix="b" />
        )}
      </Grid>
    </Layout>
  );
};

export default TasasPage;

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
      filter: {
        ns: { in: ["common", "tendencias"] }
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
