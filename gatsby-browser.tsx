// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
// import '@mantine/core/styles.css';

// A list of CSS files that you can import from
// @mantine/core package as a replacement for
// import "@mantine/core/styles.css";

// All Mantine components depend on global styles,
// you need to import them before all other styles:
import "@mantine/core/styles/global.css";

// If you are not sure which components are used in a
// particular component, you can import all styles for
// components that are reused in other components:
import "@mantine/core/styles/ScrollArea.css";
import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/VisuallyHidden.css";
import "@mantine/core/styles/Paper.css";
import "@mantine/core/styles/Popover.css";
import "@mantine/core/styles/CloseButton.css";
import "@mantine/core/styles/Group.css";
import "@mantine/core/styles/Loader.css";
import "@mantine/core/styles/Overlay.css";
import "@mantine/core/styles/ModalBase.css";
import "@mantine/core/styles/Input.css";
import "@mantine/core/styles/InlineInput.css";
import "@mantine/core/styles/Flex.css";

//import '@mantine/core/styles/TypographyStylesProvider.css';
import "@mantine/core/styles/ActionIcon.css";
import "@mantine/core/styles/Affix.css";
import "@mantine/core/styles/AppShell.css";
import "@mantine/core/styles/AspectRatio.css";
import "@mantine/core/styles/Blockquote.css";
import "@mantine/core/styles/Burger.css";
import "@mantine/core/styles/Button.css";
import "@mantine/core/styles/Card.css";
import "@mantine/core/styles/Center.css";
import "@mantine/core/styles/Checkbox.css";
//import '@mantine/core/styles/Chip.css';
import "@mantine/core/styles/Combobox.css";
import "@mantine/core/styles/Combobox.css";
import "@mantine/core/styles/Container.css";
import "@mantine/core/styles/Divider.css";
import "@mantine/core/styles/Drawer.css";
import "@mantine/core/styles/Grid.css";
import "@mantine/core/styles/List.css";
import "@mantine/core/styles/LoadingOverlay.css";
import "@mantine/core/styles/Menu.css";
import "@mantine/core/styles/Modal.css";
import "@mantine/core/styles/NavLink.css";
import "@mantine/core/styles/Notification.css";
import "@mantine/core/styles/Paper.css";
import "@mantine/core/styles/Pill.css";
import "@mantine/core/styles/PillsInput.css";
import "@mantine/core/styles/Radio.css";
import "@mantine/core/styles/Skeleton.css";
import "@mantine/core/styles/Slider.css";
import "@mantine/core/styles/Stack.css";
import "@mantine/core/styles/Table.css";
import "@mantine/core/styles/Text.css";
import "@mantine/core/styles/ThemeIcon.css";
import "@mantine/core/styles/Title.css";
import "@mantine/core/styles/Tooltip.css";

import "@mantine/notifications/styles.css";

import "./src/css/global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { theme } from "./src/theme";

export const wrapPageElement = ({ element }) => {
  return <MantineProvider theme={theme}>{element}</MantineProvider>;
};

export const replaceHydrateFunction = () => {
  return (element, container) => {
    const root = ReactDOM.createRoot(container);
    root.render(element);
  };
};
