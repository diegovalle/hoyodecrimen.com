"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { graphql } from "gatsby";
import Header from "../components/Header/Header";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useViewportSize } from "@mantine/hooks";

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

import DotMap from "../components/HomicideMap/DotMap";
import MapFilters from "../components/MapFilters";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-mapa.jpg";
import social_image_en from "../images/social/social-mapa_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();
  const { width: w } = useViewportSize();
  const [openMenu, { toggle: toggleMenu }] = useDisclosure(false);
  const [
    visibleLoading,
    { open: openLoading, close: closeLoading, toggle: toggleLoading },
  ] = useDisclosure(false);
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
  const [monthsAvailable, setMonthsAvailable] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [hourValue, setHourValue] = useState<[number, number]>([5, 28]);
  const [monthsText, setMonthsText] = useState(t("All"));
  const [hoursText, setHoursText] = useState(t("All"));

  function dateRange(startDate, endDate) {
    // we use UTC methods so that timezone isn't considered
    let start = new Date(startDate);
    const end = new Date(endDate).setUTCHours(12);
    const dates = [];
    while (start <= end) {
      // compensate for zero-based months in display
      const displayMonth = start.getUTCMonth() + 1;
      dates.push(
        new Date(
          [
            start.getUTCFullYear(),
            // months are zero based, ensure leading zero
            displayMonth.toString().padStart(2, "0"),
            // always display the first of the month
            "15",
          ].join("-")
        )
      );

      // progress the start date by one month
      start = new Date(start.setUTCMonth(displayMonth));
    }

    return dates;
  }

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
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
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

        setMonthsAvailable(monthRange(start_date, end_date));

        let totalMonths =
          (parseInt(end_date.slice(0, 4)) - parseInt(start_date.slice(0, 4))) *
            12 +
          parseInt(end_date.slice(5)) -
          1;
        setMonths(dateRange(start_date, end_date));
        setNumMonths(totalMonths);
        setMonthMarks([
          {
            value: 0,
            label: [
              new Date(start_date + "-15").toLocaleString(language, {
                month: "short",
              }),
              new Date(start_date + "-15").getFullYear(),
            ].join(`\n`),
          },
          {
            value: totalMonths,
            label: [
              new Date(end_date + "-15").toLocaleString(language, {
                month: "short",
              }),
              new Date(end_date + "-15").getFullYear(),
            ].join(`\n`),
          },
        ]);
      });
  }, []);

  const hourMarks = [
    { value: 5, label: "5 AM" },
    { value: 17, label: "5 PM" },
    { value: 28, label: "4 AM" },
  ];

  function valueLabelFormat(value: number) {
    return [
      months[value].toLocaleString(language, { month: "short" }),
      months[value].getFullYear(),
    ].join(` `);
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
            span={{ base: 12, md: "auto", lg: "auto" }}
            style={{ height: wSize.height - 60 + 16 }}
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
                monthsAvailable={monthsAvailable}
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
          {w < breakpoints.sm ? (
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
