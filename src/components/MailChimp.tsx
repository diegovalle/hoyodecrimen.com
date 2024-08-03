import React from "react";
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
import { useForm } from "@mantine/form";
import jsonp from "jsonp";
import { IconAt } from "@tabler/icons-react";

export const MailChimp = () => {
  const { t } = useTranslation();
  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },

    validate: {
      
      email: (value) =>
        // eslint-disable-next-line
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
          value
        )
          ? null
          : "Invalid email",
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
    let url =
      "https://diegovalle.us6.list-manage.com/subscribe/post?u=787fae824c502d9f3ad7d0b73&id=1bd9444074";
    url = url.replace("/post?", "/post-json?");
    jsonp(
      `${url}&EMAIL=${encodeURIComponent(values.email)}`,
      { param: "c" },
      (err, data) => {
        if (err) {
          this.setState({
            status: "error",
            message: err,
          });
        } else if (data.result !== "success") {
          this.setState({
            status: "error",
            message: data.msg,
          });
        } else {
          this.setState({
            status: "success",
            message: data.msg,
          });
        }
      }
    );
  };

  return (
    <>
      <Container fluid mt={120} pb={15} bg="dark.8">
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
          <Flex
            mih={50}
            bg="dark.8"
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <form
              // style={{ justifyContent: "flex-end", display: "flex", flex: 1 }}
              onSubmit={form.onSubmit(handleSubmit)}
            >
              <Group justify="center" mt={2}>
                <TextInput
                  // mt={0}
                  rightSectionPointerEvents="none"
                  rightSection={icon}
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                  placeholder={t("Your email")}
                />

                <Button type="submit" style={{color: "#000"}}><Trans>Submit</Trans></Button>
              </Group>
            </form>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default MailChimp;
