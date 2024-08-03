"use client";

import * as React from "react";
import { graphql } from "gatsby";
import { useEffect } from "react";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import type { PageProps } from "gatsby";
import { Title, Center, Grid, Space, Divider } from "@mantine/core";
import "@mantine/core/styles.css";
import Layout from "../components/Layout";
import { SocialImage } from "../components/SocialImage";
import social_image from "../images/social/social-colonias.jpg";
import social_image_en from "../images/social/social-colonias_en.jpg";

const TasasPage: React.FC<PageProps> = ({ pageContext, location, data }) => {
  useEffect(() => {}, []);
  const { language } = pageContext;
  const { t } = useTranslation();

  return (
    <Layout>
      <SocialImage
        social_image={social_image}
        social_image_en={social_image_en}
        siteUrl={data.site.siteMetadata.siteUrl}
        language={language}
      />
      <Center>
        <Title
          order={1}
          py=".5rem"
          /* styles={{
                root: {
                  fontFamily:
                    "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif;",
                },
              }} */
        >
          <Trans>Privacy Policy</Trans>
        </Title>
      </Center>
      <Center>
        <Space h="sm" />
      </Center>
      <Divider my="xl" />

      <Grid pl={20}>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 6 }}
          offset={{ base: 0, md: 3, lg: 3 }}
        >
         
          <p>
            <strong>HoyoDeCrimen</strong> respects your privacy and is committed
            to protecting your personal information. This Privacy Policy
            outlines how we collect, use, disclose, and protect your information
            when you visit our website (https://hoyodecrimen.com) or interact
            with our services.
          </p>{" "}
           <strong>Information We Collect</strong>
          <p>We collect information from you in several ways, including:</p>
          <ul>
            <li>
              <strong>Information You Provide:</strong> When you voluntarily
              submit information through our website, such as by filling out
              forms, subscribing to our newsletter, or contacting us, we may
              collect information like your name, email address, and other
              contact details.
            </li>
            <li>
              <strong>Automatically Collected Information:</strong> We may
              automatically collect certain information about your device and
              browsing activities, such as your IP address, browser type,
              operating system, referring URLs, and information about your
              interactions with our website. This information is collected
              through cookies and similar technologies.
            </li>
            <li>
              <strong>Information from Third-Party Services:</strong> We use
              third-party services like Mailchimp, Cloudflare, and Google Ads to
              enhance our website's functionality and user experience. These
              services may collect information about you in accordance with
              their respective privacy policies.
            </li>
          </ul>{" "}
            How We Use Your Information
          <p>We may use your information for the following purposes:</p>
          <ul>
            <li>To provide and improve our website and services.</li>
            <li>
              To communicate with you, such as responding to inquiries or
              sending newsletters.
            </li>
            <li>To personalize your experience on our website.</li>
            <li>To analyze website traffic and user behavior.</li>
            <li>To comply with legal obligations.</li>
          </ul>{" "}
            Sharing of Information
          <p>We may share your information with the following third parties:</p>
          <ul>
            <li>
              <strong>Mailchimp:</strong> We use Mailchimp to manage our email
              marketing campaigns. Your email address and other relevant
              information may be transferred to Mailchimp for this purpose.
            </li>
            <li>
              <strong>Cloudflare:</strong> We use Cloudflare to improve website
              performance and security. Cloudflare may collect and process
              information about your website visits in accordance with its
              privacy policy.
            </li>
            <li>
              <strong>Google Ads:</strong> We use Google Ads to display
              advertisements on our website. Google may collect information
              about your online activities to deliver targeted ads.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share your information
              with trusted third-party service providers who assist us in
              operating our website and business.
            </li>
          </ul>{" "}
            Data Security
          <p>
            We implement reasonable security measures to protect your personal
            information from unauthorized access, disclosure, alteration, and
            destruction. However, no method of transmission or storage is
            completely secure, and we cannot guarantee absolute security.
          </p>{" "}
            Your Choices
          <p>You have certain choices regarding your personal information:</p>
          <ul>
            <li>
              <strong>Opt-Out of Email Marketing:</strong> You can unsubscribe
              from our marketing emails by following the instructions provided
              in the email.
            </li>
            <li>
              <strong>Cookies:</strong> You can manage your cookie preferences
              through your browser settings.
            </li>
          </ul>
          Children's Privacy
          <p>
            Our website is not intended for children under the age of 18. We do
            not knowingly collect personal information from children.
          </p>{" "}
            Changes to This Privacy Policy
          <p>
            We reserve the right to modify this Privacy Policy at any time. We
            will notify you of any material changes by posting the updated
            policy on our website.
          </p>{" "}
            Contact Us
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at https://www.diegovalle.net/contact/
          </p>
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default TasasPage;

export { Head } from "../components/Head";

export const query = graphql`
  query ($language: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        year
        satelliteMap
        osmTilesUrl
      }
    }
    locales: allLocale(
      filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
