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
import { ModalSubscribe } from "../components/MailChimp.tsx";

import ComboboxCrime from "../components/ComboboxCrime";

import useWindowSize from "../components/useWindowSize";

import LazyLoad from "react-lazy-load";
import CuadrantesMap from "../components/HomicideMap/CuadrantesMap";
import CuadrantesLineChart from "../components/CuadrantesLineChart";

import { SEO } from "../components/SEO";
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
        <Grid overflow="hidden">
          <Grid.Col
            span={{ base: 12, md: 9, lg: 9 }}
            style={{ height: wSize.height ? wSize.height - 60 + 16 : 0 }}
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
              offset={8}
              radius="md"
            >
              <Space h="md" />
              <Title order={1} size="lg">
                <Center>
                  <Trans>Crimes by Cuadrante</Trans>
                </Center>
              </Title>
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

                <LazyLoad once>
                  <>
                    <Container pb="1rem" size="25rem">
                      <ComboboxCrime
                        updateCrime={updateCrime}
                        selectedCrime={selectedCrime}
                      />
                    </Container>
                    <Text>
                      <Center component="span">
                        {selectedCuadrante === "df"
                          ? "CDMX"
                          : selectedCuadrante}
                      </Center>
                    </Text>
                    <CuadrantesLineChart
                      selectedCrime={selectedCrime}
                      selectedCuadrante={selectedCuadrante}
                      language={language}
                    />
                  </>
                </LazyLoad>
              </>
            </Drawer>
            <Affix position={{ bottom: 85, right: 20 }} hiddenFrom="md">
              <Button
                px={6}
                variant="filled"
                autoContrast={true}
                color="rgba(255, 255, 255, 1)"
                onClick={toggle}
                aria-label="Options"
                title={t("Crimes by Cuadrante")}
              >
                <IconAdjustmentsHorizontal style={{}} />
              </Button>
            </Affix>
          </Grid.Col>
          <Grid.Col visibleFrom="md" span={{ base: 12, md: 3, lg: 3 }} pb={0}>
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

              <>
                <Container pb="1rem" size="25rem">
                  <ComboboxCrime
                    updateCrime={updateCrime}
                    selectedCrime={selectedCrime}
                  />
                </Container>
                <Text>
                  <Center component="span">
                    {selectedCuadrante === "df" ? "CDMX" : selectedCuadrante}
                  </Center>
                </Text>
                {wSize.height ? (
                  <CuadrantesLineChart
                    selectedCrime={selectedCrime}
                    selectedCuadrante={selectedCuadrante}
                    language={language}
                  />
                ) : null}
              </>
            </>
          </Grid.Col>
        </Grid>
        <ModalSubscribe language={language} />
      </AppShell.Main>
    </AppShell>
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
