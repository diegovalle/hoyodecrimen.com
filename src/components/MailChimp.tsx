import React, { useState } from "react";
import { Trans, useTranslation } from "gatsby-plugin-react-i18next";
import {
  Button,
  Group,
  TextInput,
  Container,
  Flex,
  Text,
  rem,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import jsonp from "jsonp";
import { IconAt } from "@tabler/icons-react";

export const MailChimp = ({ language }) => {
  const { t } = useTranslation();
  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const errorMessage = t("Invalid email");
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },

    validate: {
      validateInputOnChange: true,
      email: isEmail(errorMessage),
    },
  });

  // EN Newsletter:
  //   Signup form URL: https://eepurl.com/71l2n
  //   Form action: https://hoyodecrimen.us6.list-manage.com/subscribe/post
  //   u: 787fae824c502d9f3ad7d0b73
  //   id: 102491489b

  // ES Newsletter:
  //   Signup form URL: http://eepurl.com/bilEkL
  //   Form action: https://hoyodecrimen.us6.list-manage.com/subscribe/post
  //   u: 787fae824c502d9f3ad7d0b73
  //  id: 99835eea14
  // //mc.us6.list-manage.com/subscribe/landing-page?u=787fae824c502d9f3ad7d0b73&id=1bd9444074&f_id=005f0be2f0

  const handleSubmit = (values: typeof form.values) => {
    if (!form.isValid()) return;
    let u, id;
    if (language === "es") {
      u = "787fae824c502d9f3ad7d0b73";
      id = "99835eea14";
    } else {
      u = "787fae824c502d9f3ad7d0b73";
      id = "102491489b";
    }
    let url = `https://hoyodecrimen.us6.list-manage.com/subscribe/post?u=${u}&id=${id}`;
    url = url.replace("/post?", "/post-json?");
    jsonp(
      `${url}&EMAIL=${encodeURIComponent(values.email)}`,
      { param: "c" },
      (err, data) => {
        if (err) {
          console.log(err);
          setError("Invalid");
        } else if (data.result !== "success") {
          console.log(data);
          setError(data.msg);
        } else {
          console.log(err);
          setSuccess(true);
        }
      }
    );
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.email) {
      setError("Invalid Email");
    }
  };

  return (
    <>
      <Container fluid mt={"9rem"} pb={"2em"} bg="dark.8">
        <Flex
          mih={0}
          bg="dark.8"
          gap="xs"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Text mt={20} mb={0} size="xl" c="white">
            <Trans>Subscribe to our newsletter</Trans>
          </Text>
          <Text mt={0} mb={1} c="white">
            <Trans i18nKey="emailText">
              Receive an email when I update the crime data. No spam and
              unsubscribe anytime.
            </Trans>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
            <Flex
              mih={56}
              gap="md"
              justify="flex-start"
              align="flex-start"
              direction="row"
              wrap="wrap"
            >
              <TextInput
                // mt={0}
                withErrorStyles
                rightSectionPointerEvents="none"
                rightSection={icon}
                key={form.key("email")}
                {...form.getInputProps("email")}
                placeholder={t("Your email")}
                error={error}
                disabled={success}
                aria-label="Email for submission"
              />

              <Button
                type="submit"
                style={{ color: "#000" }}
                bg={success ? "#4caf50" : "#1c7ed6"}
                disabled={success}
              >
                {success ? <Trans>✓ Success</Trans> : <Trans>Submit</Trans>}
              </Button>
            </Flex>
          </form>
        </Flex>
      </Container>
    </>
  );
};

export default MailChimp;
