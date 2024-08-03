import * as React from "react";
import {
  Menu,
  Group,
  Center,
  Burger,
  Container,
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { MantineLogo } from "@mantine/ds";
import * as classes from "./HeaderMenu.module.css";

const links = [
  { link: "/about", label: "Inicio" },
  { link: "/about", label: "Tasas" },
  { link: "/about", label: "Crímenes" },
  {
    link: "#1",
    label: "Mapas",
    links: [
      { link: "/docs", label: "Localización Puntual" },
      { link: "/resources", label: "Sectores (tasas)" },
      { link: "/community", label: "Cuadrantes" },
    ],
  },
  {
    link: "#2",
    label: "Estadísticas",
    links: [
      { link: "/faq", label: "Series por Crimen" },
      { link: "/demo", label: "Series por Sector" },
      { link: "/forums", label: "por Hora" },
      { link: "/forums", label: "por Día de la Semana" },
      { link: "/forums", label: "Cambios (Cuadrantes)" },
    ],
  },
  { link: "/about", label: "Acerca" },
];

export function HeaderMenu() {
  //const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
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
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <MantineLogo size={28} />
          <Group gap={0} visibleFrom="sm">
            {items}
          </Group>
          <Burger
            title="Open navigation"
            label="Toggle Navigation"
            aria-label="Toggle Navigation Menu"
            opened={opened}
            onClick={toggle}
            size="sm"
          />
        </div>
      </Container>
    </header>
  );
}
