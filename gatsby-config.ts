import type { GatsbyConfig } from "gatsby";

// const osmTilesUrl = `https://tileshoyo.surge.sh/{z}/{x}/{y}.html`, //(cors hoyodecrimen.com / no pbf fonts [glyphsUrl])
// const osmTilesUrl = `https://tileshoyo.surge.sh/{z}/{x}/{y}.html`, //(cors hoyodecrimen.com / no pbf fonts [glyphsUrl])
// const osmTilesUrl = `https://tiles-n.hoyodecrimen.com/{z}/{x}/{y}.html`, //(cors hoyodecrimen.com)
// const osmTilesUrl = `https://tiles-r.hoyodecrimen.com/{z}/{x}/{y}.html`,
const osmTilesUrl = "https://tiles-r.hoyodecrimen.com";

// const apiUrl = "https://cooperative-corissa-diegovalle-177b049e.koyeb.app";
// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.hoyodecrimen.com";

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
  "/*": [
    "Strict-Transport-Security: max-age=31536000",
    "Permissions-Policy: geolocation=(self)",
    "Referrer-Policy: same-origin",
    "X-Frame-Options: DENY",
    "X-XSS-Protection: 1; mode=block",
    "X-Content-Type-Options: nosniff",
    `Link: <${apiUrl}>; rel=preconnect, <${osmTilesUrl}>; rel=preconnect`,
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
  "/static/*": [
    "cache-control: public",
    "cache-control: max-age=2592000",
    "cache-control: immutable",
  ],
  "/sw.js": [
    "cache-control: public",
    "cache-control: max-age=0",
    "cache-control: must-revalidate",
  ],
  "/*.js": [
    "cache-control: public",
    "cache-control: max-age=2592000",
    "cache-control: immutable",
  ],
}; // option to add more headers. `Link` headers are transformed by the below criteria

let config_no_gtag: GatsbyConfig = {
  flags: {
    //PARTIAL_HYDRATION: true
  },
  siteMetadata: {
    title: `hoyodecrimen`,
    siteUrl: `https://hoyodecrimen.com`,
    startYear: 2019,
    apiUrl: apiUrl,
    osmTilesUrl: `${osmTilesUrl}/{z}/{x}/{y}.html`,

    spriteUrl: "https://hoyodecrimen-tiles.onrender.com/tiles/sprites/sprite",
    glyphsUrl:
      "https://hoyodecrimen-tiles.onrender.com/tiles/fonts/{fontstack}/{range}.pbf",
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
        domains: [apiUrl, osmTilesUrl],
      },
    },
    /* {
      resolve: "@sentry/gatsby",
      options: {
        //dsn: "https://afbcfff6bdfb4cc0ab632bc99414c4fa@o55429.ingest.us.sentry.io/120420",
      },
    }, */
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Crimen en la Ciudad de México`,
        short_name: `HoyoDeCrimen`,
        icon: `src/images/logo.png`,
        start_url: `/`,
        lang: "es",
        background_color: `#f7f0eb`,
        display: `standalone`,
        localize: [
          {
            start_url: `/en/`,
            lang: `en`,
            name: `Mexico City Crime`,
            short_name: `CDMX Crime`,
          },
        ],
      },
    },
    // {
    //   resolve: "gatsby-plugin-react-leaflet",
    //   options: {
    //     linkStyles: false, // (default: true) Enable/disable loading stylesheets via CDN
    //   },
    // },
    // {
    //   resolve: `gatsby-plugin-google-gtag`,
    //   options: {
    //     // You can add multiple tracking ids and a pageview event will be fired for all of them.
    //     trackingIds: [
    //       "G-HQQDKGGFMW", // Google Analytics / GA
    //       // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
    //       // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
    //     ],
    //   },
    // },
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
    // {
    //   resolve: "gatsby-remark-opengraph",
    //   options: {
    //     background: "#bada55",
    //     log: true,
    //     // if you create post-specific open graph images, be sure to prefix `./public`
    //     //outputPath: markdownNode => path.join('./public', markdownNode.fields.slug),
    //     texts: [
    //       {
    //         text: "Hello world!",
    //         // font: require.resolve('./src/assets/yourFont.ttf')
    //       },
    //     ],
    //   },
    // },
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
    {
      resolve: `gatsby-plugin-posthog`,
      options: {
        // Specify the API key for your PostHog Project (required)
        apiKey: "phc_HWvAvFNyLWtPqQJRiJxMqAv8onqtgdJJyOkR0mJLxnd",
        // Specify the app host if self-hosting (optional, default: https://us.i.posthog.com)
        apiHost: "https://piggy.diegovalle.net",
        // Puts tracking script in the head instead of the body (optional, default: true)
        head: true,
        // Enable posthog analytics tracking during development (optional, default: false)
        isEnabledDevMode: true,
      },
    },
    // {
    //   resolve: "gatsby-plugin-rollbar",
    //   options: {
    //     accessToken: "01e6e28461fb46f7ad79d087bf33a744", // POST_CLIENT_ITEM_ACCESS_TOKEN
    //     // For all configuration options, see https://docs.rollbar.com/docs/rollbarjs-configuration-reference
    //     captureUncaught: true,
    //     maxItems: 10,
    //     itemsPerMinute: 5,
    //     captureUnhandledRejections: true,
    //     payload: {
    //       environment: "production",
    //     },
    //   },
    // },
  ],
};

let config: GatsbyConfig;
if (!process.env.CLOUDFLARE) {
  config_no_gtag.plugins.push({
    resolve: "gatsby-plugin-google-tagmanager",
    options: {
      id: "G-HQQDKGGFMW",
      includeInDevelopment: false,
      defaultDataLayer: { platform: "gatsby" },
      enableWebVitalsTracking: true,
    },
  });
  config = { ...config_no_gtag };
} else config = { ...config_no_gtag };

export default config;
