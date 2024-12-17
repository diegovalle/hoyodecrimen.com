import React, { StrictMode } from "react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "./src/theme";

// AdSense code in between the <head></head>
// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2949275046149330"
// crossorigin="anonymous"></script>

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
}) => {
  const headComponents = getHeadComponents();
  replaceHeadComponents([
    ...headComponents,
    <script
      async
      key="google-ads"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2949275046149330"
      crossOrigin="anonymous"
    ></script>,
    <ColorSchemeScript key="color-scheme-script" />,
  ]);
};

export const wrapPageElement = ({ element }) => {
  return (
    <StrictMode>
      <MantineProvider theme={theme}>{element}</MantineProvider>
    </StrictMode>
  );
};
