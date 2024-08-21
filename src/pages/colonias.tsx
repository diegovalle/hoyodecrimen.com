"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { Trans } from "gatsby-plugin-react-i18next";

import { useDisclosure } from "@mantine/hooks";
//import { MantineLogo } from "@mantine/ds";
import type { PageProps } from "gatsby";
import Header from "../components/Header/Header";
import {
  AppShell,
  Grid,
  Drawer,
  Affix,
  Button,
  Title,
  Space,
  ScrollArea,
  Container,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import useWindowSize from "../components/useWindowSize";

import ColoniasMap from "../components/HomicideMap/ColoniasMap";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-colonias.jpg";
import social_image_en from "../images/social/social-colonias_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [opened, { close, toggle }] = useDisclosure(false);
  const wSize = useWindowSize();

  const [lastDate, setLastDate] = useState(null);

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

      <AppShell.Main>
        <Grid overflow="hidden">
          <Grid.Col
            span={{ base: 12, md: 12, lg: 12 }}
            style={{ height: wSize.height - 60 + 16 }}
            pb={0}
          >
            {wSize.height ? (
              <ColoniasMap
                selectedCrime={"HOMICIDIO DOLOSO"}
                setSelectedCuadrante={null}
                setLastDate={setLastDate}
                lang={language}
              />
            ) : null}

            <Drawer
              opened={opened}
              onClose={close}
              lockScroll={false}
              title={""}
              zIndex={250}
              scrollAreaComponent={ScrollArea.Autosize}
            >
              <Container size="xs">
                <Title order={1} size="h4">
                  <Trans>Homicide rate by Neighborhood</Trans>
                </Title>
                {lastDate
                  ? lastDate.charAt(0).toUpperCase() + lastDate.slice(1)
                  : " ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀"}
                <Space h="xl" />
                <Container
                  size="xs"
                  p={"1rem"}
                  bg="var(--mantine-color-blue-light)"
                  r="--mantine-radius-md"
                >
                  <Title order={2} size="h7">
                    <Trans>What is a smoothed rate?</Trans>
                  </Title>
                  <Space h="xs"></Space>
                  <Trans i18nKey="smoothed"></Trans>
                </Container>
                <Space h="xs"></Space>
                <Trans i18nKey="slop"></Trans>
              </Container>
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
