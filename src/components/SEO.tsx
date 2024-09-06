import React from "react";
import { useSiteMetadata } from "../hooks/use-site-metadata";
import { translations } from "../../i18n/translations/head_translations";
import { translated_routes } from "../../i18n/locales/routes/routes";

export const SEO = ({ image, props }) => {
  const { language, localizedPath } = props.pageContext;
  const { data } = props;
  const { siteUrl } = useSiteMetadata();

  if (siteUrl === "") {
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

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'http://schema.org/',
          '@type': 'Organization',
          url: 'https://hoyodecrimen.com',
          '@id': 'https://hoyodecrimen.com/#Organization',
          name: 'Hoyo de Crimen',
          description: 'Mexico City Crime Rates',
          logo: {
            '@type': 'ImageObject',
            url: 'https://hoyodecrimen.com/logo_hoyodecrimen.png',
            width: '411',
            height: '411',
          },
          founder: {
            '@type': 'Person',
            '@id': 'https://www.diegovalle.net/#Person',
            name: 'Diego Valle-Jones',
            givenName: 'Diego',
            familyName: 'Valle-Jones',
            sameAs: [
              'https://twitter.com/diegovalle',
              'https://github.com/diegovalle',
              'https://facebook.com/diegovalle',
              'https://www.linkedin.com/in/diegovalle',
              '',
              '',
            ],
            url: 'https://www.diegovalle.net',
          },
          foundingDate: '2011',
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: "Hoyo de Crimen",
          inLanguage: props.lang === 'es' ? 'en' : 'es',
          url:
            props.lang === 'es' ? 'https://hoyodecrimen.com' : 'https//hoyodecrimen.com/en/',
          author: [
            {
              '@type': 'Person',
              '@id': 'https://www.diegovalle.net/#Person',
              name: 'Diego Valle-Jones',
              givenName: 'Diego',
              familyName: 'Valle-Jones',
              sameAs: [
                'https://twitter.com/diegovalle',
                'https://github.com/diegovalle',
                'https://facebook.com/diegovalle',
                'https://www.linkedin.com/in/diegovalle',
                '',
                '',
              ],
              url: 'https://www.diegovalle.net',
            },
          ],
        })}
      </script>

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
        href={`${siteUrl}${localizedPath}${
          language === "en" && localizedPath !== "/" ? "/" : ""
        }`.replace(/\/\/$/, "/")}
      />
      <meta
        property="og:url"
        content={`${siteUrl}${localizedPath}${language === "en" ? "/" : ""}`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={
          props.socialTitle || translations[language][localizedPath + "_title"]
        }
      />
      <meta property="og:site_name" content={'Hoyo de Crimen'} />
      <meta
        property="og:description"
        content={translations[language][localizedPath + "_description"]}
      />
      <link
        rel="alternate"
        hrefLang={language === "es" ? "en" : "es"}
        href={
          siteUrl.replace(/\/$/, "") +
          (language === "es"
            ? "/en" +
              translated_routes[props.location.pathname] +
              (localizedPath !== "/" ? "/" : "")
            : invert(translated_routes)[
                props.location.pathname
                  .replace("/en", "")
                  .replace(/(?:[\w]{1})\/$/, "")
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
      <meta property="og:image" content={siteUrl + image} />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:width" content="1200" />
      <meta name="twitter:image" content={siteUrl + image} />
    </>
  );
};
