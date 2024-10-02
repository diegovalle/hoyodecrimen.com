import React from "react";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";
import {
  Text,
  AppShell,
  Group,
  Container,
  ActionIcon,
  rem,
  VisuallyHidden,
  Title,
  Center,
  Space,
  Flex,
} from "@mantine/core";

import MailChimp from "../MailChimp";

import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import * as classes from "./FooterCentered.module.css";

function FooterCentered({ language } = props) {
  const { t } = useTranslation();
  const data = [
    {
      title: t("Community"),
      links: [
        { label: t("Follow on 𝕏 (Twitter)"), link: "https://x.com/diegovalle" },
        { label: t("Email newsletter"), link: t("https://eepurl.com/71l2n") },
        {
          label: t("Contact Me"),
          link: t("https://www.diegovalle.net/contact/"),
        },
        {
          label: t("Discussions"),
          link: "https://github.com/diegovalle/hoyodecrimen.com/discussions",
        },
      ],
    },
  ];
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        //onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));
    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <>
      <MailChimp language={language}/>

      <AppShell.Footer
        withBorder={true}
        className={classes.footer}
        pl="md"
        pr="md"
        pb="md"
        mt={0}
        styles={{ footer: { position: "relative" } }}
      >
        <Center>
          <Title order={4}>
            <Trans i18nKey="footerTitle">
              Questions or comments?
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a style={{ color: "#111", fontStyle: "italic" }}>Get in touch</a>
            </Trans>
          </Title>
        </Center>
        <Container className={classes.inner}>
          <div className={classes.logo}>
            <Text className={classes.description}>
              <Trans i18nKey="createdBy">
                Created by
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>Diego Valle-Jones</a>
              </Trans>
            </Text>
            <Space h="xl" />
            <p>
              <Trans i18nKey="dataSource">
                The source of crime data is the
                <a href="https://datos.cdmx.gob.mx/dataset/carpetas-de-investigacion-fgj-de-la-ciudad-de-mexico">
                  FGJ-CDMX
                </a>
                . Shapefiles for the cuadrantes come from the
                <a href="https://datos.cdmx.gob.mx/dataset/cuadrantes">
                  Secretaría de Seguridad Ciudadana (SSC)
                </a>
                and for the colonias from the
                <a href="https://datos.cdmx.gob.mx/dataset/coloniascdmx">
                  Instituto Electoral de la Ciudad de México
                </a>
                . The population figures are based on the
                <a href="https://blog.diegovalle.net/2022/11/inegi-mexico-2020-census-shapefiles.html">
                  2020 Census by Manzana
                </a>
                .
              </Trans>
            </p>
            <Space h="xl" />
            <Text>
              <Trans i18nKey="coolAPI">
                There's also a really cool
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>API</a>.
              </Trans>
            </Text>
            <Space h="xl" />
            <Text>
              <Trans i18nKey="elcrimenLink">
                For a complete crime and safety report for all the states of
                Mexico, please visit
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>El Crimen</a>.
              </Trans>
            </Text>
          </div>
          <div className={classes.groups}>{groups}</div>
        </Container>
        <Container className={classes.afterFooter}>
          <Flex
            mih={50}
            gap="lg"
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Text size="sm">
              ©{" "}
              <Trans i18nKey="copyright">
                Diego Valle-Jones. All Rights Reserved.
              </Trans>
              <Trans i18nKey="Privacy"><a href="/privacidad/">Privacy</a></Trans>
            </Text>
            {/*  <Text size="sm">
              Unless otherwise stated, the content of this page is licensed
              under the{" "}
              <a
                href="http://creativecommons.org/licenses/by/3.0/"
                rel="nofollow"
              >
                Creative Commons Attribution 3.0 License
              </a>
            </Text> */}
          </Flex>
          <Group
            gap={0}
            className={classes.social}
            justify="flex-end"
            wrap="nowrap"
          >
            <ActionIcon
              component="a"
              href="https://x.com/diegovalle"
              size="xl"
              variant="default"
              radius="sm"
              color="#dbdee1"
            >
              <VisuallyHidden>Twitter</VisuallyHidden>
              <FaXTwitter
                style={{
                  backgroundColor: "#dbdee1",
                  width: rem(68),
                  height: rem(68),
                }}
                stroke={0}
              />
            </ActionIcon>
            <Space w="sm" />
            <ActionIcon
              component="a"
              href="https://github.com/diegovalle"
              size="xl"
              variant="default"
              radius="sm"
              color="#dbdee1"
            >
              <VisuallyHidden>GitHub</VisuallyHidden>
              <FaGithub
                style={{
                  backgroundColor: "#dbdee1",
                  width: rem(68),
                  height: rem(68),
                }}
                stroke={0}
              />
            </ActionIcon>
          </Group>
        </Container>
      </AppShell.Footer>
    </>
  );
}

export default FooterCentered;
