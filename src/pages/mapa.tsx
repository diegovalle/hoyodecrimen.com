"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import Header from "../components/Header/Header";
import { useTranslation } from "gatsby-plugin-react-i18next";

import { useDisclosure } from "@mantine/hooks";
import type { PageProps } from "gatsby";
import {
  AppShell,
  Grid,
  Drawer,
  Affix,
  Button,
  ScrollArea,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useHash } from "@mantine/hooks";
//import "@mantine/core/styles.css";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import useWindowSize from "../components/useWindowSize";
import { mmddToLocale } from "../components/utils";

import DotMap from "../components/HomicideMap/DotMap";
import MapFilters from "../components/MapFilters";
import { SEO } from "../components/SEO";
import { dateRange, getMonthYear } from "../components/utils";
import social_image from "../images/social/social-mapa.jpg";
import social_image_en from "../images/social/social-mapa_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [visibleLoading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);
  const [opened, { close, toggle }] = useDisclosure(false);
  const wSize = useWindowSize();
  const [hash, setHash] = useHash({ getInitialValueInEffect: true });
  const breakpoints = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1408,
  };

  // const [selectedCrime, setSelectedCrime] = useState("HOMICIDIO DOLOSO");
  // const updateCrime = (crime) => {
  //   setSelectedCrime(crime);
  //   console.log(selectedCrime);
  // };
  const [checked, setChecked] = useState("OpenStreetMap");

  const [crimeList, setCrimeList] = useState(null);
  const [selectedCrimes, setSelectedCrimes] = useState(["HOMICIDIO DOLOSO"]);
  const [monthMarks, setMonthMarks] = useState(null);
  const [numMonths, setNumMonths] = useState(null);
  const [months, setMonths] = useState(null);
  const [dateEndValue, setDateEndValue] = useState(null);
  const [hourEndValue, setHourEndValue] = useState(null);
  const monthsAvailable = useRef(null);
  const [dateValue, setDateValue] = useState(null);
  const [hourValue, setHourValue] = useState<[number, number]>([5, 28]);
  const [monthsText, setMonthsText] = useState(t("All"));
  const [hoursText, setHoursText] = useState(t("All"));

  const monthRange = (start_date, end_date) => {
    let allMonths = [];
    for (
      let i = parseInt(start_date.slice(0, 4));
      i <= parseInt(end_date.slice(0, 4));
      i++
    ) {
      if (i === parseInt(end_date.slice(0, 4))) {
        for (let j = 1; j <= parseInt(end_date.slice(5)); j++)
          allMonths.push(`${i}-${j.toString().padStart(2, "0")}`);
      } else {
        for (let j = 1; j <= 12; j++)
          allMonths.push(`${i}-${j.toString().padStart(2, "0")}`);
      }
    }
    return allMonths;
  };

  useEffect(() => {
    const url = `${data.site.siteMetadata.apiUrl}/api/v1/crimes_extra`;
    const fetchData = async () => {
      let retries = 0;
      const maxRetries = 3;
      while (retries < maxRetries) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          setCrimeList(
            data.crimes.map((r) => {
              switch (r.crime) {
                case "HOMICIDIO DOLOSO":
                  return "HOMICIDIO DOLOSO";
                case "ROBO DE VEHICULO AUTOMOTOR S.V.":
                  return "ROBO DE VEHICULO AUTOMOTOR S.V.";
                case "ROBO DE VEHICULO AUTOMOTOR C.V.":
                  return "ROBO DE VEHICULO AUTOMOTOR C.V.";
                default:
                  return r.crime;
              }
            })
          );

          let start_date = data.date_range[0];
          let end_date = data.date_range[1];

          monthsAvailable.current = monthRange(start_date, end_date);

          let totalMonths =
            (parseInt(end_date.slice(0, 4)) -
              parseInt(start_date.slice(0, 4))) *
              12 +
            parseInt(end_date.slice(5)) -
            1;
          setMonths(dateRange(start_date, end_date));
          setNumMonths(totalMonths);
          setMonthMarks([
            {
              value: 0,
              label: mmddToLocale(language, start_date),
            },
            {
              value: totalMonths,
              label: mmddToLocale(language, end_date),
            },
          ]);

          return;
        } catch (error) {
          retries++;
          console.error(`Attempt ${retries} failed. ${error.message}`);
          if (retries === maxRetries) {
            console.error("Failed to fetch data after 3 attempts");
          }
        }
      }
    };

    fetchData();
  }, [data.site.siteMetadata.apiUrl, language]);

  const hourMarks = [
    { value: 5, label: "5 AM" },
    { value: 17, label: "5 PM" },
    { value: 28, label: "4 AM" },
  ];

  function valueLabelFormat(value: number) {
    return getMonthYear(months[value], language, "short", " ");
  }

  function hourLabelFormat(value: number) {
    let hours1 = Array.from({ length: 11 }, (_, i) => i + 1 + " AM");
    let hours2 = Array.from({ length: 11 }, (_, i) => i + 1 + " PM");
    return ["12 AM", ...hours1, "12 PM", ...hours2][value % 24];
  }

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
            span={{ base: 12, md: "auto", lg: "auto" }}
            style={{ height: wSize.height ? wSize.height - 60 + 16 : 0 }}
            pb={0}
          >
            {wSize.height ? (
              <DotMap
                checked={checked}
                setHash={setHash}
                hash={hash}
                selectedCrimes={selectedCrimes}
                dateEndValue={dateEndValue}
                hourEndValue={hourEndValue}
                ref={monthsAvailable}
                openLoading={openLoading}
                closeLoading={closeLoading}
                dateValue={dateValue}
                setDateValue={setDateValue}
                hourValue={hourValue}
                setHourValue={setHourValue}
              />
            ) : null}

            <Affix position={{ bottom: 85, right: 20 }} hiddenFrom="md">
              <Button
                px={6}
                variant="filled"
                autoContrast={true}
                color="rgba(255, 255, 255, 1)"
                onClick={toggle}
                aria-label="Filters"
              >
                <IconAdjustmentsHorizontal style={{}} />
              </Button>
            </Affix>
          </Grid.Col>
          {wSize.width < breakpoints.sm ? (
            <Drawer
              opened={opened}
              onClose={close}
              lockScroll={false}
              title={t("Filters")}
              keepMounted={true}
              zIndex={250}
              scrollAreaComponent={ScrollArea.Autosize}
            >
              <Box pos="relative">
                <LoadingOverlay
                  visible={visibleLoading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 1 }}
                />
                {wSize.height}
                <MapFilters
                  checked={checked}
                  setChecked={setChecked}
                  numMonths={numMonths}
                  monthMarks={monthMarks}
                  valueLabelFormat={valueLabelFormat}
                  hourLabelFormat={hourLabelFormat}
                  hourMarks={hourMarks}
                  crimeList={crimeList}
                  setSelectedCrimes={setSelectedCrimes}
                  selectedCrimes={selectedCrimes}
                  setDateEndValue={setDateEndValue}
                  setHourEndValue={setHourEndValue}
                  monthsAvailable={monthsAvailable}
                  language={language}
                  dateValue={dateValue}
                  setDateValue={setDateValue}
                  hourValue={hourValue}
                  setHourValue={setHourValue}
                  hoursText={hoursText}
                  setHoursText={setHoursText}
                  monthsText={monthsText}
                  setMonthsText={setMonthsText}
                />
              </Box>
            </Drawer>
          ) : (
            <Grid.Col
              visibleFrom="md"
              span={{ base: 12, md: 3, lg: 3 }}
              p={0}
              m={0}
            >
              <Box style={{ height: "100%" }} pos="relative">
                <LoadingOverlay
                  visible={visibleLoading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 1 }}
                />
                <MapFilters
                  checked={checked}
                  setChecked={setChecked}
                  numMonths={numMonths}
                  monthMarks={monthMarks}
                  valueLabelFormat={valueLabelFormat}
                  hourLabelFormat={hourLabelFormat}
                  hourMarks={hourMarks}
                  crimeList={crimeList}
                  setSelectedCrimes={setSelectedCrimes}
                  selectedCrimes={selectedCrimes}
                  setDateEndValue={setDateEndValue}
                  setHourEndValue={setHourEndValue}
                  monthsAvailable={monthsAvailable}
                  language={language}
                  dateValue={dateValue}
                  setDateValue={setDateValue}
                  hourValue={hourValue}
                  setHourValue={setHourValue}
                  hoursText={hoursText}
                  setHoursText={setHoursText}
                  monthsText={monthsText}
                  setMonthsText={setMonthsText}
                />
              </Box>
            </Grid.Col>
          )}

          {/* </Grid.Col> */}
        </Grid>
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
      filter: { ns: { in: ["common", "mapa"] }, language: { eq: $language } }
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
