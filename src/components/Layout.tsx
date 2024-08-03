import PropTypes from "prop-types";
import React from "react";

import { useDisclosure } from "@mantine/hooks";
import Header from "./Header/Header";
import FooterCentered from "./Footer/FooterCentered";
import { AppShell, MantineProvider } from "@mantine/core";

const Layout = ({ children, language} = props ) => {
  const [opened, { toggle }] = useDisclosure();

  function toggle2() {
    toggle();
  }
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <Header opened={opened} toggle={toggle2}  language={language} />
        <AppShell.Main>{children}</AppShell.Main>
        <FooterCentered language={language} />
      </AppShell>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
