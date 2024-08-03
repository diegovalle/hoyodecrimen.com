"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { timeFormatDefaultLocale } from "d3-time-format";
import { useI18next, useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { MantineLogo } from "@mantine/ds";
import type { HeadFC, PageProps } from "gatsby";
import { HeaderMenu } from "../components/HeaderMenu";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { MantineProvider, Navbar, Header } from "@mantine/core";
import {
  AspectRatio,
  Title,
  Text,
  Menu,
  Center,
  Container,
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Grid,
  Space,
  Divider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-colonias.jpg";
import social_image_en from "../images/social/social-colonias_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

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
          <Trans>Mexico City Crime</Trans>
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
