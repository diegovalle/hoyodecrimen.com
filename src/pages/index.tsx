"use client";

import React, { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import type { PageProps } from "gatsby";
import {
  AspectRatio,
  Title,
  Center,
  Space,
  Divider,
  Container,
  Text,
  Grid,
  Card,
  Group,
  Blockquote,
  Table,
} from "@mantine/core";

import LazyLoad from "react-lazy-load";
import { LocLink } from "../components/LocLink";
import ColoniasMap from "../components/HomicideMap/ColoniasMap";
import { round1, comma } from "../components/utils";

import Layout from "../components/Layout";

import { IconInfoCircle } from "@tabler/icons-react";

import CDMXLineChart from "../components/CDMXLineChart";

import { StaticImage } from "gatsby-plugin-image";

import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-index.jpg";
import social_image_en from "../images/social/social-index_en.jpg";

export function BellasArtes() {
  return (
    <StaticImage
      src="../images/Gemini_Generated_Image_1usvj61usvj61usv.jpeg"
      alt="Bellas Artes"
      style={{ borderRadius: "50%" }}
      aspectRatio={1}
      width={400}
      height={400}
    />
  );
}

export function CrimeIndexPic() {
  const { t } = useTranslation();
  return (
    <StaticImage
      src="../images/Gemini_Generated_Image_8coph78coph78cop.jpeg"
      alt={t("Crime Locations")}
      aspectRatio={590 / 332}
      //width={400}
      //height={160}
      layout="fullWidth"
      breakpoints={[300, 400, 500, 600, 700, 800]}
    />
  );
}

export function CuadrantesPic() {
  const { t } = useTranslation();
  return (
    <StaticImage
      src="../images/029248f5177b47dfa35873ab2f01ebcc_77225ca9ddf64e6bbcfaa9c1e3243802.jpg"
      alt={t("Sectores")}
      aspectRatio={590 / 332}
      //width={400}
      //height={160}
      layout="fullWidth"
      breakpoints={[300, 400, 500, 600, 700, 800]}
    />
  );
}

export function ColoniasPic() {
  const { t } = useTranslation();
  return (
    <StaticImage
      src="../images/f8421efb3fc34e7f8a0fa62aa07727ee_e77d198874fa458ba83de750c4a04aed.jpg"
      alt={t("Neighborhoods")}
      aspectRatio={590 / 332}
      //width={400}
      // height={160}
      layout="fullWidth"
      breakpoints={[300, 400, 500, 600, 700, 800]}
    />
  );
}

export function CGPic() {
  const { t } = useTranslation();
  return (
    <StaticImage
      src="../images/Gemini_Generated_Image_1a4ywa1a4ywa1a4y.jpeg"
      alt={t("Crime in your area")}
      aspectRatio={590 / 332}
      //width={400}
      //height={160}
      layout="fullWidth"
      breakpoints={[300, 400, 500, 600, 700, 800]}
    />
  );
}

const MyCard = ({ children, href }) => {
  const firstChild = React.Children.toArray(children)[0];
  const secondChild = React.Children.toArray(children)[1];
  const thirdChild = React.Children.toArray(children)[2];
  // const fourthChild = React.Children.toArray(children)[3];
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {firstChild === undefined ? "undefined" : firstChild}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} fz="xl">
          <LocLink to={href}>
            {secondChild === undefined ? "undefined" : secondChild}
          </LocLink>
        </Text>
        {/*  <Badge color="pink">On Sale</Badge> */}
      </Group>

      <Text size="lg">
        {thirdChild === undefined ? "undefined" : thirdChild}
      </Text>

      {/*  <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        component="a"
        href={href}
      >
        {fourthChild === undefined ? "undefined" : fourthChild}
      </Button> */}
    </Card>
  );
};

const IndexPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  const { language } = pageContext;
  const { t } = useTranslation();
  const [lastDate, setLastDate] = useState(null);
  const [maxRate, setMaxRate] = useState(null);
  const [yearlyHomicides, setYearlyHomicides] = useState(null);
  const icon = <IconInfoCircle />;

  const rows = yearlyHomicides
    ? yearlyHomicides.map((element) => (
        <Table.Tr key={element.year}>
          <Table.Td>{element.year}</Table.Td>
          <Table.Td>{comma(element.count)}</Table.Td>
          <Table.Td>{comma(element.population)}</Table.Td>
          <Table.Td>
            {round1((element.count / element.population) * 100000)}
          </Table.Td>
        </Table.Tr>
      ))
    : null;

  return (
    <Layout language={language} pageContext={pageContext}>
      <SocialImage
        social_image={social_image}
        social_image_en={social_image_en}
        siteUrl={data.site.siteMetadata.siteUrl}
        language={language}
      />
      <Title order={1} py=".5rem" align="center">
        <Trans>Mexico City Crime</Trans>
      </Title>
      <Title order={2} size="sm" align="center">
        <Trans>Homicide Map</Trans>
      </Title>
      <Center>
        <Title order={2} size="sm">
          {lastDate ? lastDate : " ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀ ⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀"}
        </Title>
      </Center>
      <Center>
        <Space h="sm" />

        {/* <Text size="xl" styles={{ height: "20px" }} lineClamp={1}>
          &nbsp;
          {lastDate
            ? [
                language === "es" ? "Reporte " : "",
                lastDate.toLocaleString(language, { month: "long" }),
                lastDate.getFullYear(),
                language === "en" ? " Report" : "",
              ].join(" ")
            : null}
        </Text> */}
      </Center>
      <div style={{ height: "400px", width: "100%" }}>
        <ColoniasMap
          selectedCrime={"HOMICIDIO DOLOSO"}
          setSelectedCuadrante={null}
          setLastDate={setLastDate}
          lang={language}
          setMaxRate={setMaxRate}
        />
      </div>

      <Space h="sm"></Space>
      <Container
        pb={0}
        size="xs"
        style={{
          height: "20px",
          background:
            "linear-gradient(90deg,  #30123BFF 0%, #455BCDFF 10%, #3E9BFEFF 20%, #18D6CBFF 30%, #46F884FF 40%, #A2FC3CFF 50%, #E1DD37FF 60%, #FEA632FF 70%, #F05B12FF 80%, #C42503FF 90%, #7A0403FF 100%)",
        }}
      ></Container>
      <Container size="xs" px={0}>
        <Group justify="space-between">
          <Text size="xs">
            <Trans>less homicides</Trans>
          </Text>
          <Text size="xs" ta="right">
            {/* {maxRate ? Math.ceil(maxRate) : "⠀⠀"}{" "} */}
            <Trans>more homicides</Trans>
          </Text>
        </Group>
      </Container>

      <Space h="lg"></Space>
      <Container
        size="xs"
        p={"1rem"}
        bg="var(--mantine-color-blue-light)"
        r="--mantine-radius-md"
      >
        <Title order={2} size={"md"}>
          <Trans>What is a smoothed rate?</Trans>
        </Title>
        <Space h="xs"></Space>
        <Text>
          <Trans i18nKey="smoothed"></Trans>
        </Text>
      </Container>

      <Divider my="xl" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
          <Container size="sm" mt="md">
            <Title order={2} py={20}>
              <Trans>Official Crime Data</Trans>
            </Title>

            <Text size="xl">
              <Trans i18nKey="intro">
                The Mexico City Police Department divided the city into 847
                quadrants. Thanks to the
                <a href="https://datos.cdmx.gob.mx/explore/dataset/carpetas-de-investigacion-pgj-cdmx/custom/">
                  open data initiative
                </a>{" "}
                by the Mexico City government, there is geolocated data
                available for all crimes committed in Mexico City.
              </Trans>
              <br />
              <Trans i18nKey="intro2">
                With this data, citizens and authorities can visualize the most
                violent parts of the city; businessmen can decide where to
                locate or expand; drivers can find in which parking lots their
                cars are least likely to be stolen... With interactive maps, the
                Mexico City government can be held accountable for its
                incompetence in managing the city's crime problem.
              </Trans>
            </Text>
          </Container>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
          <Center>
            <BellasArtes />
          </Center>
        </Grid.Col>
      </Grid>
      <Divider my="xl" />
      <Space h="xl" />
      <Center>
        <Title order={2}>
          <Trans>Annualized Homicide Rate in Mexico City</Trans>
        </Title>
      </Center>
      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 10, lg: 8 }}
          offset={{ base: 0, md: 1, lg: 2 }}
        >
          <Space h="xl" />
          <AspectRatio ratio={5 / 4} h={450} p={15}>
            <LazyLoad offset={1300}>
              <CDMXLineChart
                height={450}
                lang={language}
                title=""
                yname={t("tasa de homicidio")}
                setYearlyHomicides={setYearlyHomicides}
              />
            </LazyLoad>
          </AspectRatio>
        </Grid.Col>
      </Grid>

      <Container size="xs" p={"1rem"} r="--mantine-radius-md">
        <Blockquote color="blue" cite="" icon={icon} mt="xl">
          <Text>
            <Trans i18nKey="annualized"></Trans>
          </Text>
        </Blockquote>
      </Container>

      <Space h="xl" />

      <Grid justify="center">
        <Grid.Col span={{ base: 12, md: 5, lg: 5, xl: 4 }}>
          <Center>
            <Title order={3}>
              <Trans>What is the murder rate in Mexico City?</Trans>
            </Title>
          </Center>
          <Space h="xl" />
          <Table striped size="xl">
            <Table.Thead>
              <Table.Tr>
                <Table.Th role="columnheader" scope="col">{t("Year")}</Table.Th>
                <Table.Th role="columnheader" scope="col">{t("Homicides")}</Table.Th>
                <Table.Th role="columnheader" scope="col">{t("Population")}</Table.Th>
                <Table.Th role="columnheader" scope="col">{t("Rate")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          <Space h="xl" />

          {yearlyHomicides ? (
            <Text size="xl" component="div">
              <Title order={4}>
                {t("homicide_rate", {
                  year: yearlyHomicides[yearlyHomicides.length - 1].year,
                  rate: round1(
                    (yearlyHomicides[yearlyHomicides.length - 1].count /
                      yearlyHomicides[yearlyHomicides.length - 1].population) *
                      100000
                  ),
                })}
              </Title>
            </Text>
          ) : (
            "         "
          )}

          <Space h="xl" />
          <Text size="xl" component="div">
            <Trans i18nKey="murder_rate">
              aaa<em>zzz</em>
            </Trans>
          </Text>
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Grid>
        <Grid.Col
          pt={40}
          offset={{ base: 1, md: 1, lg: 1 }}
          span={{ base: 10, md: 6, lg: 4 }}
        >
          <MyCard href="/mapa/">
            <CrimeIndexPic />
            <Trans>Crime Locations</Trans>
            <Trans>
              Each and every major crime reported to the police mapped and
              geolocated
            </Trans>
            <Trans>Crime</Trans>
          </MyCard>
        </Grid.Col>
        <Grid.Col
          pt={40}
          offset={{ base: 1, md: 0, lg: 2 }}
          span={{ base: 10, md: 6, lg: 4 }}
        >
          <MyCard href="/colonias/">
            <ColoniasPic />
            <Trans>Neighborhoods</Trans>
            <Trans>
              Estimates of homicide rates at the neighborhood level using
              advanced statistical techniques
            </Trans>
            <Trans>Crime</Trans>
          </MyCard>
        </Grid.Col>
        <Grid.Col
          pt={40}
          offset={{ base: 1, md: 1, lg: 1 }}
          span={{ base: 10, md: 6, lg: 4 }}
        >
          <MyCard href="/sectores-mapa/">
            <CuadrantesPic />
            <Trans>Sectores</Trans>
            <Trans>
              Number of crimes in each of the police blocks that make up Mexico
              City. Will you lose your iPhone or your life...
            </Trans>
            <Trans>Crime</Trans>
          </MyCard>
        </Grid.Col>
        <Grid.Col
          pt={40}
          offset={{ base: 1, md: 0, lg: 2 }}
          span={{ base: 10, md: 6, lg: 4 }}
        >
          <MyCard href="/rumbo-mapa/">
            <CGPic />
            <Trans>Geolocated Crime</Trans>
            <Trans>
              All crimes within 700 meters of where you are right now
            </Trans>
            <Trans>Crime</Trans>
          </MyCard>
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default IndexPage;

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
