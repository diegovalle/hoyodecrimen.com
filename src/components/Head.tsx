import React from "react";

import type { HeadFC } from "gatsby";
import { translations } from "../../i18n/translations/head_translations";
import { translated_routes } from "../../i18n/locales/routes/routes";

export const Head: HeadFC = (props) => {
  const { language, localizedPath } = props.pageContext;
  const { data } = props;
  const defaults = data.site.siteMetadata;

  if (defaults.siteUrl === "" && typeof window !== "undefined") {
    defaults.siteUrl = window.location.origin;
  }

  if (defaults.siteUrl === "") {
    console.error("Please set a siteUrl in your site metadata!");
    return null;
  }

  function invert(obj) {
    let retObj = {};
    for (let key in obj) {
      retObj[obj[key]] = key;
    }
    return retObj;
  }
  return (
    <>
      <html lang={language} />
      <title>{translations[language][localizedPath + "_title"]}</title>
      <meta
        name="description"
        content={translations[language][localizedPath + "_description"]}
      />
      {/* Schema.org tags */}
      {/* <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script> */}
      <link
        rel="canonical"
        href={`${defaults.siteUrl}${localizedPath}${
          language === "en" && localizedPath !== "/" ? "/" : ""
        }`.replace(/\/\/$/, "/")}
      />
      <meta
        property="og:url"
        content={`${defaults.siteUrl}${localizedPath}${
          language === "en" ? "/" : ""
        }`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={props.socialTitle || translations[language][localizedPath + "_title"]}
      />
      <meta
        property="og:description"
        content={translations[language][localizedPath + "_description"]}
      />
      <link
        rel="alternate"
        hrefLang={language === "es" ? "en" : "es"}
        href={
          defaults.siteUrl.replace(/\/$/, "") +
          (language === "es"
            ? "/en" +
              translated_routes[props.location.pathname] +
              (localizedPath !== "/" ? "/" : "")
            : invert(translated_routes)[
                props.location.pathname.replace("/en", "").replace(/(?:[\w]{1})\/$/, "")
              ])
        }
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={data.site.twitterHandle} />
      <meta
        name="twitter:title"
        content={
          props.socialTitle || translations[language][localizedPath + "_title"]
        }
      />
      <meta
        name="twitter:description"
        content={translations[language][localizedPath + "_description"]}
      />
      {/* sectores-mapa colonias index cuadrantes-mapa mapa preload surge*/}
      {/*   <meta
          property="og:image"
          content={
            defaults.siteUrl.replace(/\/$/, "") +
            (language === "es" ? social_image : social_image_en)
          }
        /> */}
      {/*   <meta property="og:image:height" content="630" />
        <meta property="og:image:width" content="1200" /> */}
      {/*  <meta
          name="twitter:image"
          content={
            defaults.siteUrl.replace(/\/$/, "") +
            (language === "es" ? social_image : social_image_en)
          }
        /> */}
    </>
  );
};
