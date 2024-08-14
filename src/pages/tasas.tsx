"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Stack,
  rem,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import MapForSectorMonthChart from "../components/MapForSectorMonthChart";
import CrimeSectorMonthChart from "../components/CrimeSectorMonthChart";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-tasas.jpg";
import social_image_en from "../images/social/social-tasas_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
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
          <Trans>Mexico City Crime Rates</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />
      <Container pb="1rem" size="25rem">
        <SelectCrime updateCrime={updateCrime} />
      </Container>

      <div id="annualized_rate">
        <Grid pl={20}>
          <Grid.Col span={{ base: 12, md: 4, lg: 5 }}>
            <AspectRatio ratio={1.1} style={{ flex: `0 0 ${rem(100)}` }}>
              <MapForSectorMonthChart
                selectedCrime={selectedCrime}
                updateRegion={setSelectedRegion}
                height="100%"
              />
            </AspectRatio>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8, lg: 7 }}>
            <Center>
              {selectedRegion === "null" ? "CDMX" : "Sector: " + selectedRegion}
            </Center>
            <AspectRatio ratio={2} style={{ flex: `0 0 ${rem(100)}` }}>
              <CrimeSectorMonthChart
                lang={language}
                selectedRegion={selectedRegion}
                selectedCrime={selectedCrime}
                height="100%"
              />
            </AspectRatio>
          </Grid.Col>
        </Grid>
      </div>
      <Space h="lg" />
      <Divider />
      <Space h="lg" />
      <Stack>
        <Container size="sm">
          <Trans i18nKey="1"></Trans>
        </Container>

        <Container size="sm">
          <Trans i18nKey="2"></Trans>
        </Container>

        <Container size="sm">
          <Trans i18nKey="3"></Trans>
        </Container>
      </Stack>
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
      filter: { ns: { in: ["common", "tasas"] }, language: { eq: $language } }
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
