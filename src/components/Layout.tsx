import PropTypes from "prop-types";
import React from "react";

import { useDisclosure } from "@mantine/hooks";
import Header from "./Header/Header";
import FooterCentered from "./Footer/FooterCentered";
import { AppShell } from "@mantine/core";
import { ModalSubscribe } from "./MailChimp.tsx";
import { Partytown } from "@builder.io/partytown/react";

const Layout = ({ children, language, pageContext } = props) => {
  const [opened, { toggle }] = useDisclosure();

  function toggle2() {
    toggle();
  }
  return (
    <>
      <Partytown key="partytown" forward={["gtag"]} />
      <script
        key="google-analytics"
        type="text/partytown"
        src={`https://www.googletagmanager.com/gtag/js?id=G-HQQDKGGFMW`}
        //src="/piggy"
      />
      <script
        key="google-analytics-config"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){ window.dataLayer.push(arguments);}
      gtag('js', new Date()); 
      gtag('config', 'G-HQQDKGGFMW', { send_page_view: false })`,
        }}
      />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <Header
          opened={opened}
          toggle={toggle2}
          language={language}
          pageContext={pageContext}
        />
        <AppShell.Main>{children}</AppShell.Main>
        <FooterCentered
          language={language}
          localizedPath={pageContext?.localizedPath}
        />
        <ModalSubscribe
          language={language}
          localizedPath={pageContext?.localizedPath}
        />
      </AppShell>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
