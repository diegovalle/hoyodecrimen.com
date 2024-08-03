"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDisclosure, useElementSize } from "@mantine/hooks";
//import { MantineLogo } from "@mantine/ds";
import type { HeadFC, PageProps } from "gatsby";
import Header from "../components/Header/Header";
import {
  AppShell,
  Grid,
  Drawer,
  Affix,
  Button,
  Container,
  Stack,
  ScrollArea,
  Text,
  Center,
  Space,
  Title,
  Divider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { translations } from "../../i18n/translations/head_translations";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-sectores-mapa.jpg";
import social_image_en from "../images/social/social-sectores-mapa_en.jpg";

import LazyLoad from "react-lazy-load";
import SectoresMap from "../components/HomicideMap/SectoresMap";
import SelectCrime from "../components/SelectCrime";
import SectoresLineChart from "../components/SectoresLineChart";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [lastDate, setLastDate] = useState(null);
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [opened, { close, toggle }] = useDisclosure(false);
  const { ref, height } = useElementSize();

  const [selectedSector, setSelectedSector] = useState("df");
  const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");
  const updateCrime = (crime) => {
    setSelectedCrime(crime);
  };

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
      <Header opened={openMenu} toggle={toggleMenu} />

      <AppShell.Main ref={ref}>
        <Grid overflow="hidden">
          <Grid.Col
            span={{ base: 12, md: 9, lg: 9 }}
            style={{ height: height + 16 }}
            pb={0}
          >
            {height ? (
              <SectoresMap
                selectedCrime={selectedCrime}
                setSelectedSector={setSelectedSector}
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
              <LazyLoad once>
                <>
                  <Space h="md" />
                  <Title order={1} size="lg">
                    <Center>
                      <Trans>Crime Rates by Sector</Trans>
                    </Center>
                  </Title>
                  <Text>
                    <Center>
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
                    <Center>
                      {selectedSector === "df" ? "CDMX" : selectedSector}
                    </Center>
                  </Text>
                  <SectoresLineChart
                    selectedCrime={selectedCrime}
                    selectedSector={selectedSector}
                    language={language}
                  />
                  <Divider size="lg" />
                <Space/>
                <ScrollArea h={250} hover>
                  <Stack>
                    <Container size="sm">
                      <Trans i18nKey="1"></Trans>
                    </Container>

                   
                  </Stack>
                </ScrollArea>
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
                    <Trans>Crime Rates by Sector</Trans>
                  </Center>
                </Title>
                <Text>
                  <Center>
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
                  <Center>
                    {selectedSector === "df" ? "CDMX" : selectedSector}
                  </Center>
                </Text>
                <SectoresLineChart
                  selectedCrime={selectedCrime}
                  selectedSector={selectedSector}
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
      filter: {
        ns: { in: ["common", "sectores-mapa"] }
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
