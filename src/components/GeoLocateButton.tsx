import React from "react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useGeolocated } from "react-geolocated";
import { Modal, Button, Center } from "@mantine/core";
import { IconCurrentLocation, IconMapPin2 } from "@tabler/icons-react";

import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

export const GeoLocateButton = ({ setButtonCoords } = props) => {
  const { t } = useTranslation();
  const icon = <IconCurrentLocation size={14} />;
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { getPosition, coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    suppressLocationOnMount: true,
    //watchPosition: true,
    watchLocationPermissionChange: true,
  });

  useEffect(() => {
    if (coords) setButtonCoords([coords.longitude, coords.latitude]);
  }, [coords]);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsGeolocationAvailable(true);
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            setIsGeolocationEnabled(true);
          } else if (result.state === "prompt") {
            setIsGeolocationEnabled(true);
          } else if (result.state === "denied") {
            setIsGeolocationEnabled(false);
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const buttonPress = (event) => {
    if (isGeolocationEnabled && isGeolocationAvailable) getPosition();
    else open();
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        styles={{
          title: { fontWeight: "bold", fontSize: 20 },
        }}
        title={t("Get nearby results by using precise location")}
      >
        <p>
          <Trans i18nKey="geolocateSettings">
            To let HoyodeCrimen.com use this device's precise location, update
            your location settings.
          </Trans>
        </p>
        <Center>
          <IconMapPin2 size={140} />
        </Center>
      </Modal>
      <Button
        justify="center"
        variant="outline"
        fullWidth
        leftSection={icon}
        onClick={buttonPress}
      >
        {t("Use precise location")}
      </Button>
    </>
  );
};

export default GeoLocateButton;
