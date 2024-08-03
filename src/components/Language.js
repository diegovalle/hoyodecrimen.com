import React from "react";
import { useI18next, Trans } from "gatsby-plugin-react-i18next";
import us_flag from "../images/us.png";
import mx_flag from "../images/mx.webp";

const { routes } = require("../../i18n/locales");

const Language = (props) => {
  const c = useI18next();
  return (
    <React.Fragment>
      <a
        className={props.className}
        href={c.language === "es" ? c.originalPath : "es"}//routes["es"].translated_routes['/es' + c.path]}
      >
        <img
          src={c.language === "es" ? us_flag : mx_flag}
          width="24"
          height="17"
          alt="English Version"
        />
        <Trans>En</Trans>
      </a>
    </React.Fragment>
  );
};

export default Language;
