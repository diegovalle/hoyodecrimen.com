"use client";

import * as React from "react";
import { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import type { ageProps } from "gatsby";
import { Title, Center, Space, Divider, Container } from "@mantine/core";
//import "@mantine/core/styles.css";
import RumboMap from "../components/HomicideMap/RumboMap";
import GeoLocateButton from "../components/GeoLocateButton";

import Layout from "../components/Layout";

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
        <Title order={1} py=".5rem">
          <Trans>Crime in your Area</Trans>
        </Title>
      </Center>

      <Center>
        <Space h="sm" />
      </Center>

      <Divider my="xl" />
      <Container pb="1rem" size="25rem">
        <GeoLocateButton setButtonCoords={setCoords} />
      </Container>

      <RumboMap coords={coords} />

      <Divider my="xl" />
      <Container size="sm">
       
          <span style={{ color: "#e41a1c", fontWeight: "bold" }}>⬤</span>
          &nbsp;{t("Homicidio")} <span style={{ color: "#984ea3" }}>⬤</span>
          &nbsp;
          {t("Robo de Vehículo C.V.")} 
          <span style={{ color: "#41ab5d" }}>⬤</span>
          &nbsp;{t("Robo de Vehículo S.V.")} 
          <span style={{ color: "#377eb8" }}>⬤</span>&nbsp;
          {t("Robo a Transeúnte C.V.")} 
          <span style={{ color: "#fe9929" }}>⬤</span>&nbsp;
          {t("Lesiones por Arma de Fuego")} 
          <span style={{ color: "#777" }}>⬤</span>&nbsp;{t("Otros")} 
         
          
          <Divider m="lg"/>
          <Trans>
            The points represent crimes committed during the last 12 months at
            least 700 meters from your location
          </Trans>
       
      </Container>
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
      filter: {
        ns: { in: ["common", "rumbo-mapa"] }
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
