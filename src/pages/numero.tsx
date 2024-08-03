"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { graphql } from "gatsby";
import { Trans } from "gatsby-plugin-react-i18next";
import { translations } from "../../i18n/translations/head_translations";
import type { HeadFC, PageProps } from "gatsby";
import SelectCrime from "../components/SelectCrime";
import {
  Title,
  Center,
  Container,
  Grid,
  Space,
  Divider,
  AspectRatio,
  rem,
} from "@mantine/core";
import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import MapForCuadranteMonthChart from "../components/MapForCuadranteMonthChart";
import CrimeCuadranteMonthChart from "../components/CrimeCuadranteMonthChart";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-numero.jpg";
import social_image_en from "../images/social/social-numero_en.jpg";

const NumeroPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const [selectedRegion, setSelectedRegion] = useState("null");
  const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");

  const updateRegion = useCallback(
    (name) => {
      setSelectedRegion(name);
      console.log(selectedRegion);
    },
    [selectedRegion]
  );

  const updateCrime = (crime) => {
    setSelectedCrime(crime);
    console.log(selectedCrime);
  };

  // useEffect(() => {}, [selectedRegion]);

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
          <Trans>Mexico City Crime Numbers</Trans>
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
        <Grid.Col span={{ base: 12, md: 4, lg: 5 }}>
          <AspectRatio ratio={1.1} style={{ flex: `0 0 ${rem(100)}` }}>
            <MapForCuadranteMonthChart
              selectedCrime={selectedCrime}
              updateRegion={setSelectedRegion}
              height="100%"
            />
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 7 }}>
          <Center>
            {selectedRegion === "null"
              ? "CDMX"
              : "Cuadrante: " + selectedRegion}
          </Center>
          <AspectRatio ratio={2} style={{ flex: `0 0 ${rem(100)}` }}>
            <CrimeCuadranteMonthChart
              lang={language}
              selectedRegion={selectedRegion}
              selectedCrime={selectedCrime}
              height="100%"
            />
          </AspectRatio>
        </Grid.Col>
      </Grid>
      <Space h="sm" />
    </Layout>
  );
};

export default NumeroPage;

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
      filter: { ns: { in: ["common", "numero"] }, language: { eq: $language } }
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
