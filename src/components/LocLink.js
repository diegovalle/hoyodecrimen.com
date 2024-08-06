import React from "react";
import { Link } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";

import { routes } from "../../i18n/locales";

export const LocLink = ({ language, children, to, prefetch, ...props }) => {
  const c = useI18next();
  let r = routes;

  let localizedTo =
    c.language === c.defaultLanguage
      ? to
      : ("/en" + r.translated_routes[to] + "/").replace(/\/\/$/, "/");

  if (typeof localizedTo ===  "undefined")
    throw new Error("❌ Missing entry in i18n/locales/routes");

  if (!prefetch) {
    return (
      <a href={localizedTo} {...props} prefetch="true">
       <span style={{"display": "block"}}> {children} </span>
      </a>
    );
  }
  // if (className2) {
  //   return (
  //     <Link to={localizedTo} {...props} className={className2}>
  //      <span style={{"display": "block"}}>  {children}</span>
  //     </Link>
  //   );
  // }
  return (
    <Link to={localizedTo} {...props}>
     <span style={{"display": "block"}}>  {children}</span>
    </Link>
  );
};


export default LocLink;
