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
  const result = headComponents.find((item: any) => item?.props && Object.hasOwn(item.props, 'hrefLang'));
  // Add the adsense script only to the non-English pages
  // if hrefLang is not 'en' then it's in English (sound weird, I know)
  if (result?.props?.hrefLang !== "en") {
    return replaceHeadComponents([
      ...headComponents,
      <script
        async
        key="google-ads"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2949275046149330"
        crossOrigin="anonymous"
      ></script>,
      <ColorSchemeScript key="color-scheme-script" />,
    ]);
  } else {
    return replaceHeadComponents([
      ...headComponents,
      <ColorSchemeScript key="color-scheme-script" />,
    ]);
  }

};

export const wrapPageElement = ({ element }) => {
  return (
    <StrictMode>
      <MantineProvider theme={theme}>{element}</MantineProvider>
    </StrictMode>
  );
};
