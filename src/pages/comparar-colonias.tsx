"use client";

import * as React from "react";
import { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { PageProps } from "gatsby";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-comparar-colonias.jpg";
import social_image_en from "../images/social/social-comparar-colonias_en.jpg";

import {
  AspectRatio,
  Title,
  Container,
  Space,
  Stack,
  ThemeIcon,
  List,
  Center,
  Grid,
  rem,
  Divider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import MapForColoniaChart from "../components/MapForColoniaChart";
import ColoniaDistribution from "../components/ColoniaDistribution";

import { IconCircleCheck } from "@tabler/icons-react";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const [selectedRegion, setSelectedRegion] = useState("null");
  const [coloniaName, setColoniaName] = useState("null");
  const [period, setPeriod] = useState(null);
  const { t } = useTranslation();

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
          <Trans>Compare Neighborhoods</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />

      <Grid pl={20}>
        <Grid.Col span={{ base: 12, md: 4, lg: 5 }}>
          <AspectRatio ratio={1.5} style={{ flex: `0 0 ${rem(100)}` }}>
            <MapForColoniaChart
              updateRegion={setSelectedRegion}
              updateColoniaName={setColoniaName}
              height="100%"
            />
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 7 }}>
          <Center>{t("Histogram")}</Center>
          <AspectRatio ratio={2} style={{ flex: `0 0 ${rem(100)}` }}>
            <ColoniaDistribution
              language={language}
              selectedRegion={selectedRegion}
              coloniaName={coloniaName}
              setPeriod={setPeriod}
              height="100%"
            />
          </AspectRatio>
        </Grid.Col>
      </Grid>
      <Divider my="xl" />
      <Stack>
        <Container size="sm">
          <Title order={2}>
            <Trans>Data from</Trans> {period}
          </Title>
          <Space h="md" />
        </Container>
        <Container size="sm">
          <Trans i18nKey="Mexico"></Trans>
        </Container>

        <Container size="sm">
          <Trans i18nKey="Tepito"></Trans>
        </Container>
        <Container size="sm"></Container>
        <Container size="sm">
          <Trans i18nKey="Southeast"></Trans>
        </Container>
        <Container size="sm">
          <Trans i18nKey="Finally"></Trans>
        </Container>
        <Container size="sm">
          <Trans i18nKey="ul"></Trans>
        </Container>
        <Container size="sm">
          <List
            size="lg"
            withPadding
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <Trans i18nKey="li1"></Trans>
            </List.Item>
            <List.Item>
              <Trans i18nKey="li2"></Trans>
            </List.Item>
            <List.Item>
              <Trans i18nKey="li3"></Trans>
            </List.Item>
            <List.Item>
              <Trans i18nKey="li4"></Trans>
            </List.Item>
            <List.Item>
              {" "}
              <Trans i18nKey="li5"></Trans>{" "}
            </List.Item>{" "}
          </List>
        </Container>
        <Container size="sm">
          {" "}
          <Trans i18nKey="last"></Trans>
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
      filter: {
        ns: { in: ["common", "comparar-colonias"] }
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
