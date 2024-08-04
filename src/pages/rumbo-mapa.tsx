"use client";

import * as React from "react";
import { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import type { HeadFC, PageProps } from "gatsby";
import { Title, Center, Space, Divider, Container } from "@mantine/core";
//import "@mantine/core/styles.css";
import RumboMap from "../components/HomicideMap/RumboMap";
import GeoLocateButton from "../components/GeoLocateButton";

import Layout from "../components/Layout";

import { translations } from "../../i18n/translations/head_translations";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-rumbo.jpg";
import social_image_en from "../images/social/social-rumbo_en.jpg";

const RumboPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const { t } = useTranslation();
  const [coords, setCoords] = useState(null);

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
          <Trans>Crime in your Area</Trans>
        </Title>
      </Center>

      <Center>
        <Space h="sm" />

        {/* <Text size="xl" styles={{ height: "20px" }} lineClamp={1}>
          &nbsp;
          {lastDate
            ? [
                language === "es" ? "Reporte " : "",
                lastDate.toLocaleString(language, { month: "long" }),
                lastDate.getFullYear(),
                language === "en" ? " Report" : "",
              ].join(" ")
            : null}
        </Text> */}
      </Center>

      <Divider my="xl" />
      <Container pb="1rem" size="25rem">
        <GeoLocateButton setButtonCoords={setCoords} />
      </Container>

      <RumboMap coords={coords} />

      <Divider my="xl" />

      <p style={{ margin: "0.1em 0 2em 0;" }}>
        <span style={{ color: "#e41a1c", fontWeight: "bold" }}>⬤</span>
        &nbsp;{t("Homicidio")} <span style={{ color: "#984ea3" }}>⬤</span>&nbsp;
        {t("Robo de Vehículo C.V.")} <span style={{ color: "#41ab5d" }}>⬤</span>
        &nbsp;{t("Robo de Vehículo S.V.")} 
        <span style={{ color: "#377eb8" }}>⬤</span>&nbsp;
        {t("Robo a Transeúnte C.V.")} 
        <span style={{ color: "#fe9929" }}>⬤</span>&nbsp;
        {t("Lesiones por Arma de Fuego")} 
        <span style={{ color: "#777" }}>⬤</span>&nbsp;{t("Otros")} 
        <br />
        <Trans>
          The points represent crimes committed during the last 12 months at
          least 700 meters from your location
        </Trans>
      </p>
    </Layout>
  );
};

export default RumboPage;

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
      filter: { ns: { in: ["common", "rumbo-mapa"] }, language: { eq: $language } }
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
