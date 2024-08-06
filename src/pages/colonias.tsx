"use client";

import * as React from "react";
import { useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDisclosure, useElementSize } from "@mantine/hooks";
//import { MantineLogo } from "@mantine/ds";
import type { PageProps } from "gatsby";
import Header from "../components/Header/Header";
import {
  AppShell,
  Grid,
  Drawer,
  Affix,
  Button,
  Text,
  Title,
  Space,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";

import ColoniasMap from "../components/HomicideMap/ColoniasMap";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-colonias.jpg";
import social_image_en from "../images/social/social-colonias_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [opened, { close, toggle }] = useDisclosure(false);
  const { ref, height } = useElementSize();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !openMenu },
      }}
      padding={{ base: 0 }}
    >
      <SocialImage
        social_image={social_image}
        social_image_en={social_image_en}
        siteUrl={data.site.siteMetadata.siteUrl}
        language={language}
      />
      <Header
        opened={openMenu}
        toggle={toggleMenu}
        language={language}
        pageContext={pageContext}
      />

      <AppShell.Main ref={ref}>
        <Grid overflow="hidden">
          <Grid.Col
            span={{ base: 12, md: 12, lg: 12 }}
            style={{ height: height + 16 }}
            pb={0}
          >
            {height ? (
              <ColoniasMap
                selectedCrime={"HOMICIDIO DOLOSO"}
                setSelectedCuadrante={null}
              />
            ) : null}

            <Drawer
              opened={opened}
              onClose={close}
              lockScroll={false}
              title={t("Homicide rate by Neighborhood")}
              zIndex={250}
            >
              
                <Title order={2} size={"md"}>
                  <Trans>What is a smoothed rate?</Trans>
                </Title>
                <Space h="xs"></Space>
                <Trans i18nKey="smoothed"></Trans>
              
            </Drawer>
            <Affix position={{ bottom: 85, right: 20 }}>
              <Button
                px={6}
                variant="filled"
                autoContrast={true}
                color="rgba(255, 255, 255, 1)"
                onClick={toggle}
                aria-label="Options"
              >
                <IconInfoCircle style={{}} />
              </Button>
            </Affix>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
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
      filter: {
        ns: { in: ["common", "colonias"] }
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
