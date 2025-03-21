"use client";

import * as React from "react";
import { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import {
  Title,
  Center,
  Space,
  Divider,
  Container,
  List,
  ThemeIcon,
  rem,
  Text,
} from "@mantine/core";
import RumboMap from "../components/HomicideMap/RumboMap";
import GeoLocateButton from "../components/GeoLocateButton";

import Layout from "../components/Layout";

import { SEO } from "../components/SEO";
import social_image from "../images/social/social-rumbo.jpg";
import social_image_en from "../images/social/social-rumbo_en.jpg";
import { IconPointFilled } from "@tabler/icons-react";

const RumboPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const { t } = useTranslation();
  const [coords, setCoords] = useState(null);
  const [notInside, setNotInside] = useState(null);

  return (
    <Layout language={language} pageContext={pageContext}>
      <Center>
        <Title order={1} py=".5rem">
          <Trans>Crime in your Area</Trans>
        </Title>
      </Center>

      <Center>
        <Space h="sm" />
      </Center>
      <Container size="sm">
        <Text>
          <Trans>Move Marker</Trans>
        </Text>
      </Container>
      <Space my="sm" />
      <Container pb="1rem" size="25rem">
        <GeoLocateButton setButtonCoords={setCoords} />
      </Container>

      <RumboMap coords={coords} setNotInside={setNotInside} />

      <Divider my="xl" />
      {notInside ? (
        <Center>
          <Text c="red">
            <Trans>You are not inside Mexico City</Trans>
          </Text>
        </Center>
      ) : (
        <Text>⠀⠀⠀⠀⠀⠀⠀⠀</Text>
      )}
      <Container size="sm">
        <List spacing="xl" size="lg" center>
          <List.Item
            icon={
              <ThemeIcon color="#e41a1c" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#e41a1c" }}
                />
              </ThemeIcon>
            }
          >
            {t("Homicidio")}
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="#fe9929" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#fe9929" }}
                />
              </ThemeIcon>
            }
          >
            {t("Lesiones por Arma de Fuego")}
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="#984ea3" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#984ea3" }}
                />
              </ThemeIcon>
            }
          >
            {t("robo_cv_c")}
          </List.Item>{" "}
          <List.Item
            icon={
              <ThemeIcon color="#41ab5d" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#41ab5d" }}
                />
              </ThemeIcon>
            }
          >
            {t("robo_sv_c")}
          </List.Item>{" "}
          <List.Item
            icon={
              <ThemeIcon color="#377eb8" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#377eb8" }}
                />
              </ThemeIcon>
            }
          >
            {t("robo_t_cv")}
          </List.Item>{" "}
          <List.Item
            icon={
              <ThemeIcon color="#777" size={24} radius="xl">
                <IconPointFilled
                  style={{ width: rem(16), height: rem(16), color: "#777" }}
                />
              </ThemeIcon>
            }
          >
            {t("Otros")}
          </List.Item>
        </List>

        <Divider m="lg" />
        <Trans>
          The points represent crimes committed during the last 12 months at
          least 700 meters from your location
        </Trans>
      </Container>
    </Layout>
  );
};

export default RumboPage;

export const Head: HeadFC = (props) => {
  const { language } = props.pageContext;
  return (
    <SEO
      image={language === "es" ? social_image : social_image_en}
      props={props}
    />
  );
};

export const query = graphql`
  query ($language: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
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
