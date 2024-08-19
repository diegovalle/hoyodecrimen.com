// src/theme.ts
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  headings: {
    fontFamily:
      "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif",
  },
  fontFamily:
    "'Cooper Hewitt',Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
  fontFamilyMonospace:
    "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.65",
    xl: "1.65",
  },
});
