import React, { StrictMode } from "react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "./src/theme";

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
}) => {
  const headComponents = getHeadComponents();
  replaceHeadComponents([
    ...headComponents,
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
