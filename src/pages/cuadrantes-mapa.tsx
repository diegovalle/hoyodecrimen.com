"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

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
  Container,
  Text,
  Center,
  Space,
  Title,
} from "@mantine/core";
//import "@mantine/core/styles.css";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

import SelectCrime from "../components/SelectCrime";

import useWindowSize from "../components/useWindowSize";

import LazyLoad from "react-lazy-load";
import CuadrantesMap from "../components/HomicideMap/CuadrantesMap";
import CuadrantesLineChart from "../components/CuadrantesLineChart";

import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-cuadrantes-mapa.jpg";
import social_image_en from "../images/social/social-cuadrantes-mapa_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [opened, { close, toggle }] = useDisclosure(false);

  const [lastDate, setLastDate] = useState(null);
  const [selectedCuadrante, setSelectedCuadrante] = useState("df");
  const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");
  const updateCrime = (crime) => {
    setSelectedCrime(crime);
    console.log(selectedCrime);
  };

  const wSize = useWindowSize();

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
      <Header
        opened={openMenu}
        toggle={toggleMenu}
        language={language}
        pageContext={pageContext}
      />

      <AppShell.Main>
        <SocialImage
          social_image={social_image}
          social_image_en={social_image_en}
          siteUrl={data.site.siteMetadata.siteUrl}
          language={language}
        />
        <Grid overflow="hidden">
          <Grid.Col
            span={{ base: 12, md: 9, lg: 9 }}
            style={{ height: wSize.height - 60 + 16 }}
            pb={0}
          >
            {wSize.height ? (
              <CuadrantesMap
                selectedCrime={selectedCrime}
                setSelectedCuadrante={setSelectedCuadrante}
                setLastDate={setLastDate}
                lang={language}
              />
            ) : null}

            <Drawer
              opened={opened}
              onClose={close}
              lockScroll={false}
              zIndex={250}
            >
              <Space h="md" />
              <Title order={1} size="lg">
                <Center>
                  <Trans>Crimes by Cuadrante</Trans>
                </Center>
              </Title>
              <LazyLoad once>
                <>
                  <Center component="span">
                    <Text span>
                      {lastDate
                        ? t("Map from") +
                          " " +
                          lastDate.charAt(0).toUpperCase() +
                          lastDate.slice(1)
                        : " ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀"}
                    </Text>
                  </Center>

                  <Space h="md" />
                  <Container pb="1rem" size="25rem">
                    <SelectCrime
                      updateCrime={updateCrime}
                      selectedCrime={selectedCrime}
                    />
                  </Container>
                  <Text>
                    <Center component="span">
                      {selectedCuadrante === "df" ? "CDMX" : selectedCuadrante}
                    </Center>
                  </Text>
                  <CuadrantesLineChart
                    selectedCrime={selectedCrime}
                    selectedCuadrante={selectedCuadrante}
                    language={language}
                  />
                </>
              </LazyLoad>
            </Drawer>
            <Affix position={{ bottom: 85, right: 20 }} hiddenFrom="md">
              <Button
                px={6}
                variant="filled"
                autoContrast={true}
                color="rgba(255, 255, 255, 1)"
                onClick={toggle}
                aria-label="Options"
              >
                <IconAdjustmentsHorizontal style={{}} />
              </Button>
            </Affix>
          </Grid.Col>
          <Grid.Col visibleFrom="md" span={{ base: 12, md: 3, lg: 3 }} pb={0}>
            <LazyLoad once>
              <>
                <Space h="md" />
                <Title order={1} size="lg">
                  <Center>
                    <Trans>Crimes by Cuadrante</Trans>
                  </Center>
                </Title>
                <Text>
                  <Center component="span">
                    {lastDate
                      ? t("Map from") +
                        " " +
                        lastDate.charAt(0).toUpperCase() +
                        lastDate.slice(1)
                      : " ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀"}
                  </Center>
                </Text>
                <Space h="md" />
                <Container pb="1rem" size="25rem">
                  <SelectCrime
                    updateCrime={updateCrime}
                    selectedCrime={selectedCrime}
                  />
                </Container>
                <Text>
                  <Center component="span">
                    {selectedCuadrante === "df" ? "CDMX" : selectedCuadrante}
                  </Center>
                </Text>
                <CuadrantesLineChart
                  selectedCrime={selectedCrime}
                  selectedCuadrante={selectedCuadrante}
                  language={language}
                />
              </>
            </LazyLoad>
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
