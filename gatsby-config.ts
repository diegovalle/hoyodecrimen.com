import type { GatsbyConfig } from "gatsby";

const deploy_headers_vercel = {
  headers: [
    {
      source: "/service-worker.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
    {
      source: "/service-worker.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "permissions-policy",
          value: "geolocation=*",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "referrer-policy",
          value: "same-origin",
        },
        {
          key: "strict-transport-security",
          value: "max-age=31536000",
        },
      ],
    },
    {
      source: "^/(static)/(.*)$",
      headers: [
        {
          key: "cache-control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "^/(.*)(js|css|png|jpg|jpeg|webp|avif)$",
      headers: [
        {
          key: "cache-control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "^/(.+)(woff|woff2)$",
      headers: [
        {
          key: "cache-control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "^/(sw\\.js|app-data\\.json|.*\\.html|page-data/.*)$",
      headers: [
        {
          key: "cache-control",
          value: "public,max-age=0,must-revalidate",
        },
      ],
    },
  ],
};

const deploy_headers_netlify = {
  // '/': [
  //   'Link: </elcrimen-json/states_hexgrid.json>; rel=preload; as=fetch; crossorigin',
  // ],
  "/static/json/*": [
    "cache-control: public",
    "cache-control: max-age=0",
    "cache-control: must-revalidate",
  ],
  "/*": [
    "Strict-Transport-Security: max-age=31536000",
    "Permissions-Policy: geolocation=(self)",
    "Referrer-Policy: same-origin",
    "X-Frame-Options: DENY",
    "X-XSS-Protection: 1; mode=block",
    "X-Content-Type-Options: nosniff",
  ],
  "/*.html": [
    "cache-control: public",
    "cache-control: max-age=0",
    "cache-control: must-revalidate",
  ],
  "/page-data/*": [
    "cache-control: public",
    "cache-control: max-age=0",
    "cache-control: must-revalidate",
  ],
}; // option to add more headers. `Link` headers are transformed by the below criteria

const config: GatsbyConfig = {
  flags: {
    //PARTIAL_HYDRATION: true
  },
  siteMetadata: {
    title: `hoyodecrimen`,
    siteUrl: `https://hoyodecrimen.com`,
    apiUrl: "https://cooperative-corissa-diegovalle-177b049e.koyeb.app",
    // https://tilehoyo.surge.sh
    osmTilesUrl: `https://hoyodecrimen-tiles.onrender.com/{z}/{x}/{y}.html`,
    spriteUrl: "https://hoyodecrimen-tiles.onrender.com/tiles/sprites/sprite",
    glyphsUrl: "https://hoyodecrimen-tiles.onrender.com/tiles/fonts/{fontstack}/{range}.pbf",
    year: "2024",
    // arcgis "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    // stadia "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
    satelliteMap:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    twitterHandle: "@diegovalle",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-vercel-deploy",
      options: { ...deploy_headers_vercel },
    },
    {
      resolve: `gatsby-plugin-cloudflare-pages`,
      options: {
        headers: { ...deploy_headers_netlify },
      },
    },
    // Proxy to another service
    // /api/*  https://api.hoyodecrimen.com/:splat  200
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: { ...deploy_headers_netlify },
      },
    },
    {
      resolve: "gatsby-plugin-preconnect",
      options: {
        domains: ["https://cooperative-corissa-diegovalle-177b049e.koyeb.app"],
      },
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        //dsn: process.env.SENTRY_DSN,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Crimen en la Ciudad de México`,
        short_name: `HoyoDeCrimen`,
        icon: `src/images/logo.png`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
      },
    },
    // {
    //   resolve: "gatsby-plugin-react-leaflet",
    //   options: {
    //     linkStyles: false, // (default: true) Enable/disable loading stylesheets via CDN
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-HQQDKGGFMW", // Google Analytics / GA
          // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-mdx",
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: ["avif", `auto`, `webp`],
          quality: 50,
          breakpoints: [200, 264, 366, 592, 880, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        },
      },
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-postcss",
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     printRejected: true,
    //     //ignore: ['styles.css', 'maplibre-gl.css'], // Ignore files/folders
    //      purgeOnly : ['bootstrap/'], // Purge only these files/folders
    //   },
    // },
    {
      resolve: "gatsby-remark-opengraph",
      options: {
        background: "#bada55",
        log: true,
        // if you create post-specific open graph images, be sure to prefix `./public`
        //outputPath: markdownNode => path.join('./public', markdownNode.fields.slug),
        texts: [
          {
            text: "Hello world!",
            // font: require.resolve('./src/assets/yourFont.ttf')
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/i18n/translations`,
        name: `translations`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        redirect: false,
        localeJsonSourceName: `translations`,
        languages: [`en`, `es`],
        defaultLanguage: `es`,
        siteUrl: `https://hoyodecrimen.com`,
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
          keySeparator: false,
          nsSeparator: false,
        },
      },
    },
  ],
};

export default config;
