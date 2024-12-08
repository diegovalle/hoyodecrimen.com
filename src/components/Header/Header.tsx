import React, { useState, Fragment } from "react";
import { Link } from "gatsby";
import { LocLink } from "../LocLink";
import * as classes from "./MobileNavbar.module.css";

import { HoyodecrimenLogo } from "../HoyodecrimenLogo";
import {
  Menu,
  Center,
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  ScrollArea,
  Text,
  Box,
  ThemeIcon,
  rem,
} from "@mantine/core";

import {
  IconChevronRight,
  IconHome,
  IconInfoCircle,
  IconMap,
  IconChevronDown,
} from "@tabler/icons-react";
import { useTranslation } from "gatsby-plugin-react-i18next";

import { translated_routes } from "../../../i18n/locales/routes/routes";
import us_flag from "../../images/us.png";
import mx_flag from "../../images/mx.webp";

const { routes } = require("../../../i18n/locales");

const LanguageSwitch = ({ language, pageContext, showText = false }) => {
  const { t } = useTranslation();
  function invert(obj) {
    let retObj = {};
    for (let key in obj) {
      retObj[obj[key]] = key;
    }
    return retObj;
  }

  return (
    <>
      <a
        style={{ color: "#0a0a0a" }}
        href={
          language === "es"
            ? "/en" +
              translated_routes[pageContext.localizedPath] +
              (pageContext.localizedPath === "/" ? "" : "/")
            : invert(translated_routes)[
                pageContext.localizedPath.replace("/en", "")
              ]
        }
      >
        <img
          src={language === "es" ? us_flag : mx_flag}
          style={{ margin: showText ? "2px" : "0 0 0 18px" }}
          width="24"
          height="17"
          alt={t("English Version")}
          title={t("English Version")}
        />
      </a>
      {showText && (
        <Box ml="md">
          <Text
            component="a"
            href={
              language === "es"
                ? "/en" +
                  translated_routes[pageContext.localizedPath] +
                  (pageContext.localizedPath === "/" ? "" : "/")
                : invert(translated_routes)[
                    pageContext.localizedPath.replace("/en", "")
                  ]
            }
          >
            {t("English Version")}
          </Text>
        </Box>
      )}
    </>
  );
};

function Header(props) {
  const { t } = useTranslation();
  const [visibility, toggleVisibility] = useState({
    "1": "normal",
    "2": "normal",
    "3": "normal",
    "4": "normal",
    "5": "normal",
    "6": "normal",
    "7": "normal",
  });
  const links = [
    { link: "/", icon: IconHome, label: t("Inicio") },
    { link: "/mapa/", icon: IconMap, label: t("Localización Puntual") },

    {
      link: "#1",
      label: t("Mapas"),
      icon: IconChevronDown,
      links: [
        { link: "/colonias/", label: t("Colonias") },
        { link: "/sectores-mapa/", label: t("Sectores (tasas)") },
        { link: "/cuadrantes-mapa/", label: t("Cuadrantes") },
      ],
    },
    {
      link: "#2",
      label: t("Estadísticas"),
      icon: IconChevronDown,
      links: [
        { link: "/tasas/", label: t("Tasas") },
        { link: "/numero/", label: t("Crímenes") },
        { link: "/crimen/", label: t("Por tipo de Crimen") },
        { link: "/charts/", label: t("Por Sector") },
        { link: "/hora/", label: t("Por Hora") },
        { link: "/dia/", label: t("Por Día de la Semana") },
        { link: "/tendencias/", label: t("Trends") },
        { link: "/cambios/", label: t("Change by Sector") },
        { link: "/subregistro/", label: t("Underreporting Crime") },
        { link: "/comparar-colonias/", label: t("Compare Neighborhoods") },
        { link: "/rumbo-mapa/", label: t("Crime in your Area") },
      ],
    },
    { link: "/acerca/", icon: IconInfoCircle, label: "Acerca" },
  ];

  for (let i = 0; i < links.length; i++) {
    if (links[i].links)
      for (let j = 0; j < links[i].links.length; j++) {
        links[i].links[j].en_link = (
          "/en" + routes.translated_routes[links[i].links[j].link]
        ).replace(/\/\/$/, "/");
      }
    else
      links[i].en_link = (
        "/en" + routes.translated_routes[links[i].link]
      ).replace(/\/\/$/, "/");
  }
  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item
        className={
          item.link === props.pageContext.localizedPath ||
          item.en_link === props.pageContext.localizedPath
            ? classes.submenu + " " + classes.submenuActive
            : classes.submenu
        }
        key={item.link + "menuitem"}
      >
        <LocLink
          to={item.link}
          className={classes.linkDropdown}
          key={item.link + "loclink"}
        >
          {item.label}
        </LocLink>
      </Menu.Item>
    ));
    if (menuItems) {
      return (
        <Menu
          key={link.label + "menu"}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
          styles={{
            itemLabel: {
              display: "inline-flex",
            },
          }}
        >
          <Menu.Target key={link.link + "target"}>
            <Link
              key={link.link + "linkmenu"}
              to={link.link}
              className={classes.link}
              // onClick={(event) => event.preventDefault()}
            >
              <Center key={link.link + "center"}>
                <span
                  key={link.link + "span"}
                  className={
                    link.links.some(
                      (e) =>
                        e.link === props.pageContext.localizedPath ||
                        e.en_link === props.pageContext.localizedPath
                    )
                      ? classes.linkLabel + " " + classes.underlined
                      : classes.linkLabel
                  }
                >
                  {link.label}
                </span>
                <IconChevronDown
                  key={link.link + "iconc"}
                  size="0.9rem"
                  stroke={1.5}
                />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <LocLink
        key={link.label + "loclink2"}
        to={link.link}
        className={
          props.pageContext.localizedPath === link.link ||
          props.pageContext.localizedPath === link.en_link
            ? classes.link + " " + classes.underlined
            : classes.link
        }

        //onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </LocLink>
    );
  });

  const LinksGroup = ({
    links,
    label,
    link,
    en_link,
    icon: Icon,
    language,
    i: itemNumber,
  }) => {
    const hasLinks = Array.isArray(links);
    const items = (hasLinks ? links : []).map((link) => (
      <Link
        key={link.link + "linksgroup"}
        to={language === "es" ? link.link : link.en_link}
      >
        <Text
          span
          c="#0000FF"
          //className={classes.link}
          key={link.label + "textlinkgroup"}
          className={
            props.pageContext.localizedPath === link.link ||
            props.pageContext.localizedPath === link.en_link
              ? classes.link + " " + classes.textUnderlined
              : classes.link
          }
          // onClick={(event) => event.preventDefault()}
        >
          {link.label}
        </Text>
      </Link>
    ));

    return (
      <>
        <UnstyledButton className={classes.control}>
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              {hasLinks ? (
                <ThemeIcon
                  onClick={() => {
                    let updatedValue = {};
                    let key = itemNumber.toString();
                    let value =
                      visibility[itemNumber.toString()] === "highlighted"
                        ? "normal"
                        : "highlighted";
                    updatedValue = {
                      [key.toString()]: value,
                    };
                    toggleVisibility({ ...visibility, ...updatedValue });
                  }}
                  variant={hasLinks ? "default" : "light"}
                  size={30}
                  styles={{ root: { border: "none" } }}
                >
                  {/* <Icon style={{ width: rem(18), height: rem(18) }} /> */}
                </ThemeIcon>
              ) : (
                <Link to={language === "es" ? link : en_link}>
                  <ThemeIcon variant={hasLinks ? "default" : "light"} size={30}>
                    <Icon style={{ width: rem(18), height: rem(18) }} />
                  </ThemeIcon>{" "}
                </Link>
              )}
              <Box ml="md">
                {" "}
                {hasLinks ? (
                  <Text
                    c="#777"
                    span
                    onClick={() => {
                      let updatedValue = {};
                      let key = itemNumber.toString();
                      let value =
                        visibility[itemNumber.toString()] === "highlighted"
                          ? "normal"
                          : "highlighted";
                      updatedValue = {
                        [key.toString()]: value,
                      };
                      toggleVisibility({ ...visibility, ...updatedValue });
                    }}
                  >
                    {label}
                  </Text>
                ) : (
                  <Link to={language === "es" ? link : en_link}>
                    <Text
                      span
                      c="#0000FF"
                      className={
                        props.pageContext.localizedPath === link ||
                        props.pageContext.localizedPath === en_link
                          ? classes.textUnderlinedBig
                          : ""
                      }
                    >
                      {label}
                    </Text>
                  </Link>
                )}
              </Box>
            </Box>
          </Group>
        </UnstyledButton>
        {hasLinks ? (
          <div
            style={{
              borderRadius: "5px",
              transition: "background-color 1.3s ease",
              background:
                visibility[itemNumber.toString()] === "highlighted"
                  ? "#FFF8DC"
                  : "fff",
            }}
          >
            {items}
          </div>
        ) : null}
      </>
    );
  };

  const MobileNavbarNested = ({ language }) => {
    const mobileLinks = links.map((item, i) => (
      <Fragment key={"fragmenent" + i}>
        <LinksGroup {...item} language={language} i={i} key={"mobile" + i} />
      </Fragment>
    ));

    return (
      <nav
      //className={classes.navbar}
      >
        <ScrollArea
        //className={classes.links}
        >
          {mobileLinks}
          <UnstyledButton className={classes.control}>
            <Group justify="space-between" gap={0}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <LanguageSwitch
                  language={props.language}
                  pageContext={props.pageContext}
                  showText
                />
              </Box>
            </Group>
          </UnstyledButton>
        </ScrollArea>
      </nav>
    );
  };

  return (
    <>
      <AppShell.Header
        withBorder={false}
        styles={{
          header: {
            position: "absolute",
            boxShadow: "0 0 .5rem 0 rgba(0, 0, 0, 0.3)",
            backgroundColor: "rgb(240, 240, 240)",
            color: "black",
          },
        }}
        fz="12px"
      >
        <Group h="100%" px="md">
          <Burger
            opened={props.opened}
            onClick={props.toggle}
            hiddenFrom="sm"
            size="sm"
            color="black"
            aria-label="Toggle navigation"
          />
          <Group justify="space-between" style={{ flex: 1 }}>
            <HoyodecrimenLogo size={40} />
            <Group ml="sm" gap={0} visibleFrom="sm">
              {items}
              <LanguageSwitch
                language={props.language}
                pageContext={props.pageContext}
              />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4} zIndex={300}>
        <MobileNavbarNested
          key="moiblenavbarnested"
          language={props.language}
        />
      </AppShell.Navbar>
    </>
  );
}

export default Header;
