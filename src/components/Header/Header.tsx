import React from "react";
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
          style={{ margin: showText ? "2px" : "0 0 0 18px"}}
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
  const links = [
    { link: "/", icon: IconHome, label: t("Inicio") },
    { link: "/mapa/", icon: IconMap, label: t("Localización Puntual") },

    {
      link: "#1",
      label: t("Mapas"),
      icon: IconChevronDown,
      links: [
        { link: "/sectores-mapa/", label: t("Sectores (tasas)") },
        { link: "/cuadrantes-mapa/", label: t("Cuadrantes") },
        { link: "/colonias/", label: t("Colonias") },
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
        { link: "/comparar-colonias/", label: t("Compare Neighborhoods") },
        { link: "/rumbo-mapa/", label: t("Crime in your Area") },
      ],
    },
    { link: "/acerca/", icon: IconInfoCircle, label: "Acerca" },
  ];

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item className={classes.submenu} key={item.link}>
        <LocLink to={item.link} className={classes.linkDropdown}>
          {item.label}
        </LocLink>
      </Menu.Item>
    ));
    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
          styles={{
            itemLabel: {
              display: "inline-flex",
            },
          }}
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              // onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <LocLink
        key={link.label}
        to={link.link}
        className={classes.link}
        //onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </LocLink>
    );
  });

  const LinksGroup = ({ links, label, link, icon: Icon }) => {
    const hasLinks = Array.isArray(links);
    const items = (hasLinks ? links : []).map((link) => (
      <Text<"a">
        component="a"
        className={classes.link}
        href={link.link}
        key={link.label}
        // onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <>
        <UnstyledButton className={classes.control}>
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" size={30}>
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Box ml="md">
                {" "}
                {hasLinks ? (
                  label
                ) : (
                  <Text component="a" href={link}>
                    {label}
                  </Text>
                )}
              </Box>
            </Box>
            {hasLinks && (
              <IconChevronRight
                // className={classes.chevron}
                stroke={1.5}
                style={{
                  width: rem(16),
                  height: rem(16),
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        {hasLinks ? items : null}
      </>
    );
  };

  const NavbarNested = () => {
    const mobileLinks = links.map((item) => (
      <LinksGroup {...item} key={item.label} />
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
        <NavbarNested />
      </AppShell.Navbar>
    </>
  );
}

export default Header;
