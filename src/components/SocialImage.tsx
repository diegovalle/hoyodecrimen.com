import React from "react";
import Helmet from "react-helmet";

export const SocialImage = ({ social_image, social_image_en, siteUrl, language }) => {
  return (
    <Helmet>
      <meta
        property="og:image"
        content={
          siteUrl.replace(/\/$/, "") +
          (language === "es" ? social_image : social_image_en)
        }
      />
      <meta property="og:image:height" content="628" />
      <meta property="og:image:width" content="1200" />
      <meta
        name="twitter:image"
        content={
          siteUrl.replace(/\/$/, "") +
          (language === "es" ? social_image : social_image_en)
        }
      />
    </Helmet>
  );
};

export default SocialImage;