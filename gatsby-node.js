"use strict";
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
// exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
//   if (stage === "build-html") {
//     actions.setWebpackConfig({
//       module: {
//         rules: [
//           {
//             test: /semiotic/,
//             use: loaders.null(),
//           },
//         ],
//       },
//     })
//   }
// }
// const path = require(`path`)

// pages locale
// exports.onCreatePage = ({ page, actions }) => {
//     const { createPage, deletePage } = actions
//     deletePage(page)
//     // You can access the variable "locale" in your page queries now
//     createPage({
//         ...page,
//         context: {
//             ...page.context,
//             locale: page.context.intl.language,
//         },
//     })
// }
//const routes = require ('./src/constants/routes');

// Create directories
/* 

i18n/
├─ routes/
│  ├─ dateLoc/
│  │  ├─ es_mx
│  ├─ routes/
│  │  ├─ routes.js
│  ├─ index.js
├─ translations/
│  ├─ es/
│  │  ├─ common.json
│  │  ├─ page_1.json
│  ├─ en/
│  │  ├─ common.json
│  │  ├─ page_1.json
*/

const { routes } = require("./i18n/locales");

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise((resolve) => {
    deletePage(page);

    let localizedPath;
    if (routes[page.context.language].default) {
      localizedPath = page.path;
    } else {
      if (
        routes.translated_routes.hasOwnProperty(page.context.i18n.originalPath)
      ) {
        localizedPath =
          "/en" + routes.translated_routes[page.context.i18n.originalPath];
      } else {
        localizedPath = page.path;
      }
    }

    createPage({
      ...page,
      path: localizedPath,
      context: {
        ...page.context,
        localizedPath: localizedPath,
      },
    });

    //});

    resolve();
  });
};
