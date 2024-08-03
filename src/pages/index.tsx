"use client";

import React, { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import type { HeadFC, PageProps } from "gatsby";
import {
  AspectRatio,
  Title,
  Center,
  Space,
  Divider,
  Container,
  Text,
  Grid,
  rem,
} from "@mantine/core";
import "@mantine/core/styles.css";

import LazyLoad from "react-lazy-load";

import { BsFillPinMapFill } from "react-icons/bs";
import { TbPolygonOff } from "react-icons/tb";
import { GiPoliceBadge } from "react-icons/gi";
import { GiTargetDummy } from "react-icons/gi";

import { LocLink } from "../components/LocLink";
import ColoniasMap from "../components/HomicideMap/ColoniasMap";

import Layout from "../components/Layout";

import CDMXLineChart from "../components/CDMXLineChart";

import { StaticImage } from "gatsby-plugin-image";

import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-index.jpg";
import social_image_en from "../images/social/social-index_en.jpg";

export function BellasArtes() {
  return (
    <StaticImage
      src="../images/Gemini_Generated_Image_1usvj61usvj61usv.jpeg"
      alt="Bellas Artes"
      style={{ borderRadius: "50%" }}
      aspectRatio={1}
      width={400}
      height={400}
    />
  );
}

const IndexPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const { t } = useTranslation();
  const [lastDate, setLastDate] = useState(null);

  return (
    <Layout language={language}>
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
          <Trans>Mexico City Crime</Trans>
        </Title>
      </Center>
      <Center>
        <Title order={2} size="sm">
          <Trans>Homicide Map</Trans>
        </Title>
      </Center>
      <Center>
        <Title order={2} size="sm">
          {lastDate
            ? lastDate.charAt(0).toUpperCase() + lastDate.slice(1)
            : " ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀"}
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
      <div style={{ height: "400px", width: "100%" }}>
        <ColoniasMap
          selectedCrime={"HOMICIDIO DOLOSO"}
          setSelectedCuadrante={null}
          setLastDate={setLastDate}
          lang={language}
        />
      </div>
      <Space h="sm"></Space>

      <Container
        size="xs"
        p={"1rem"}
        bg="var(--mantine-color-yellow-light)"
        r="--mantine-radius-md"
      >
        <Title order={2} size={"md"}>
          <Trans>What is a smoothed rate?</Trans>
        </Title>
        <Space h="xs"></Space>
        <Text>
          <Trans i18nKey="smoothed"></Trans>
        </Text>
      </Container>

      <Divider my="xl" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
          <Container size="sm" mt="md">
            <Title order={2} py={20}>
              <Trans>Official Crime Data</Trans>
            </Title>

            <Text size="xl">
              <Trans i18nKey="intro">
                The Mexico City Police Department divided the city into 847
                quadrants. Thanks to the
                <a href="https://datos.cdmx.gob.mx/explore/dataset/carpetas-de-investigacion-pgj-cdmx/custom/">
                  open data initiative
                </a>{" "}
                by the Mexico City government, there is geolocated data
                available for all crimes committed in Mexico City.
              </Trans>
              <br />
              <br />
              <Trans i18nKey="intro2">
                With this data, citizens and authorities can visualize the most
                violent parts of the city; businessmen can decide where to
                locate or expand; drivers can find in which parking lots their
                cars are least likely to be stolen... With interactive maps, the
                Mexico City government can be held accountable for its
                incompetence in managing the city's crime problem.
              </Trans>
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
          <BellasArtes />
        </Grid.Col>
      </Grid>
      <Divider my="xl" />
      <Space h="xl" />
      <Center>
        <Title order={2}>
          <Trans>Annualized Homicide Rate in Mexico City</Trans>
        </Title>
      </Center>
      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 8 }}
          offset={{ base: 0, md: 0, lg: 2 }}
        >
          <Space h="xl" />
          <AspectRatio ratio={5 / 4} h={450} p={15}>
            <LazyLoad>
              <CDMXLineChart
                height={450}
                lang={language}
                title=""
                yname={t("tasa de homicidio")}
              />
            </LazyLoad>
          </AspectRatio>
        </Grid.Col>
      </Grid>
      <Container
        size="xs"
        p={"1rem"}
        bg="var(--mantine-color-yellow-light)"
        r="--mantine-radius-md"
      >
        <Text>
          <Trans i18nKey="annualized"></Trans>
        </Text>
      </Container>

      <Divider my="xl" />

      <Grid>
        <Grid.Col
          pt={40}
          offset={{ base: 0, md: 1, lg: 2 }}
          span={{ base: 12, md: 6, lg: 4 }}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <BsFillPinMapFill
                style={{ color: "#fc9272", width: rem(68), height: rem(68) }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
              <Title order={3}>
                <LocLink to="/mapa/">
                  {" "}
                  <Trans>Crime Locations</Trans>
                </LocLink>
              </Title>
              <Text>
                <Trans>
                  Each and every major crime reported to the police mapped and
                  geolocated
                </Trans>
              </Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col pt={40} span={{ base: 12, md: 6, lg: 4 }}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              {" "}
              <TbPolygonOff
                style={{ color: "#fc9272", width: rem(68), height: rem(68) }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
              {" "}
              <Title order={3}>
                <LocLink to="/colonias/">
                  <Trans>Neighborhoods</Trans>
                </LocLink>
              </Title>
              <Text>
                <Trans>
                  Estimates of homicide rates at the neighborhood level using
                  advanced statistical techniques
                </Trans>
              </Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col
          pt={40}
          offset={{ base: 0, md: 1, lg: 2 }}
          span={{ base: 12, md: 6, lg: 4 }}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              {" "}
              <GiPoliceBadge
                style={{ color: "#fc9272", width: rem(68), height: rem(68) }}
              />{" "}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
              {" "}
              <Title order={3}>
                <LocLink to="/cuadrantes-mapa/">
                  <Trans>Cuadrantes</Trans>
                </LocLink>
              </Title>
              <Text>
                <Trans>
                  Number of crimes in each of the police blocks that make up
                  Mexico City. Will you lose your iPhone or your life...
                </Trans>
              </Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col pt={40} span={{ base: 12, md: 6, lg: 4 }}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              {" "}
              <GiTargetDummy
                style={{ color: "#fc9272", width: rem(68), height: rem(68) }}
              />{" "}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 9 }}>
              {" "}
              <Title order={3}>
                <LocLink to="/rumbo-mapa/">
                  <Trans>Geolocated Crime</Trans>
                </LocLink>
              </Title>
              <Text>
                <Trans>
                  All crimes within 700 meters of where you are right now
                </Trans>
              </Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default IndexPage;

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
      filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }
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
