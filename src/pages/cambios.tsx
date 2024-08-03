"use client";

import * as React from "react";
import { useState } from "react";
import { graphql } from "gatsby";
import { Trans } from "gatsby-plugin-react-i18next";
import { translations } from "../../i18n/translations/head_translations";
import type { HeadFC, PageProps } from "gatsby";
import SelectCrime from "../components/SelectCrime";
import {
  Container,
  Title,
  Center,
  Grid,
  Space,
  Divider,
  AspectRatio,
  rem,
} from "@mantine/core";
import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import MapForSectorDiffMonthChart from "../components/MapForSectorDiffMonthChart";
import CrimeSectorDiffMonthChart from "../components/CrimeSectorDiffMonthChart";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-cambios.jpg";
import social_image_en from "../images/social/social-cambios_en.jpg";

const CambiosPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const [selectedRegion, setSelectedRegion] = useState("null");
  const [period, setPeriod] = useState(null);
  const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");

  const updateCrime = (crime) => {
    setSelectedCrime(crime);
    console.log(selectedCrime);
  };

  // useEffect(() => {}, [selectedRegion]);

  return (
    <Layout>
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
          <Trans>Crime Changes by Sector in Mexico City</Trans>
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
            <MapForSectorDiffMonthChart
              selectedCrime={selectedCrime}
              updateRegion={setSelectedRegion}
              setPeriod={setPeriod}
            />
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 7 }}>
          <Center>
            {selectedRegion === "null" ? "CDMX" : "Sector: " + selectedRegion}
          </Center>
          <AspectRatio ratio={1.2} style={{ flex: `0 0 ${rem(100)}` }}>
            {period ? (
              <CrimeSectorDiffMonthChart
                lang={language}
                selectedRegion={selectedRegion}
                selectedCrime={selectedCrime}
                period={period}
              />
            ) : null}
          </AspectRatio>
        </Grid.Col>
      </Grid>
      <Space h="sm" />
    </Layout>
  );
};

export default CambiosPage;

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
      filter: { ns: { in: ["common", "cambios"] }, language: { eq: $language } }
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
