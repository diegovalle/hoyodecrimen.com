"use client";

import * as React from "react";
import { useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { PageProps } from "gatsby";
import {
  Title,
  Center,
  Grid,
  Space,
  Divider,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import MailChimp from "../components/MailChimp";

import { IconCircleCheck } from "@tabler/icons-react";
import { StaticImage } from "gatsby-plugin-image";
import { SEO } from "../components/SEO";
import social_image from "../images/social/social-acerca.jpg";
import social_image_en from "../images/social/social-acerca_en.jpg";

export function ReformaPic() {
  return (
    <StaticImage
      src="../images/laurentiu-morariu-GNZM0Vvpchw-unsplash.jpg"
      alt="Reforma"
      transformOptions={{ fit: "cover", cropFocus: "entropy" }}
      layout="fullWidth"
      aspectRatio={16/5}
      placeholder="none"
      imgStyle={{ transition: "none" }}
    />
  );
}

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

  return (
    <Layout language={language} pageContext={pageContext}>
      <Center>
        <Title order={1} py=".5rem">
          <Trans>About Crime in Mexico City</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />
      
        <ReformaPic />
     
      <Divider my="xl" />
      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 6 }}
          offset={{ base: 0, md: 3, lg: 3 }}
        >
          <Title order={2}>
            <Trans i18nKey="created">
              Created by
              <a>Diego Valle-Jones</a>.
            </Trans>
          </Title>
          <Space h="sm" />
          <Trans i18nKey="about_text"></Trans>
          <Space h="lg" />
          <div style={{borderRadius: "10px", overflow: "hidden"}}>
          <MailChimp language={language} />
          </div>
          <Space h="lg" />
          <Title order={3}>
            <Trans i18nKey="our_mission"></Trans>
          </Title>
          <Space h="sm" />
          <List
            spacing="xs"
            size="lg"
            center
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
          </List>
          <Space h="xl" />
          <Trans i18nKey="rest">
            Additional Information:
            <p>There's also a Spanish version and a really cool API.</p>
            <p>
              Visit El Crimen for crime information at the national, state and
              municipio level.
            </p>
            <p>
              You can download a map of cuadrantes as GeoJSON using the API.
            </p>
            <p>
              This webapp is open source and you can view the code on GitHub.
            </p>
          </Trans>
          <Space h="sm" />
          <Trans i18nKey="rest2"></Trans>
          <Space h="sm" />
          <Trans
            i18nKey="contact"
            components={{
              Link: <a href="https://www.diegovalle.net/contact/" />,
            }}
          ></Trans>
          <Space h="lg" />
          <Title order={3}>
            <Trans i18nKey="add_features"></Trans>
          </Title>
          <Space h="sm" />
          <Trans
            i18nKey="translation"
            components={{
              Link: <a href="https://hoyodecrimen.com/api/" />,
            }}
          ></Trans>
          <Space h="sm" />
          <Trans
            i18nKey="elcrimen"
            components={{
              Link: <a href="https://elcri.men/" />,
            }}
          ></Trans>
          <Space h="sm" />
          <Trans
            i18nKey="cuadrantes"
            components={{
              Link: (
                <a href="https://hoyodecrimen.com/api/v1/cuadrantes/geojson" />
              ),
            }}
          ></Trans>
          <Space h="sm" />
          <Trans
            i18nKey="github"
            components={{
              Link: <a href="https://github.com/diegovalle/hoyodecrimen.api" />,
            }}
          ></Trans>
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default TasasPage;

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
      }
    }
    locales: allLocale(
      filter: { ns: { in: ["common", "acerca"] }, language: { eq: $language } }
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
