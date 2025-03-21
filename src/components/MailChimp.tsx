import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "gatsby-plugin-react-i18next";
import {
  Button,
  Group,
  TextInput,
  Container,
  Flex,
  Text,
  Title,
  rem,
  Center,
  Modal,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLocalStorage } from "@mantine/hooks";
import { useIdle } from "@mantine/hooks";
import { useForm, isEmail } from "@mantine/form";
import jsonp from "jsonp";
import { IconAt, IconMail } from "@tabler/icons-react";

const trackSubscribe = (data) => {
  // if (typeof window !== "undefined" && window.gtag) {
  //   window.gtag("send", "subscribe_newsletter", data);
  // }
  if (typeof window !== "undefined" && zaraz?.track) {
    zaraz.track("subscribe_newsletter", data);
  }
};

const trackModalOpen = (data) => {
  // if (typeof window !== "undefined" && window.gtag) {
  //   window.gtag("send", "open_modal", data);
  // }
  if (typeof window !== "undefined" && zaraz?.track) {
    zaraz.track("open_modal", data);
  }
};

export const MailChimp = ({ language, localizedPath }) => {
  const { t } = useTranslation();
  const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useLocalStorage({
    key: "showPopup",
    defaultValue: true,
  });

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
    //url = url.replace("/post?", "/post-json?");
    jsonp(
      `${url}&EMAIL=${encodeURIComponent(values.email)}`,
      { param: "c" },
      (err, data) => {
        if (err) {
          console.log(err);
          setError(t("Invalid email"));
        } else if (data.result !== "success") {
          console.log(data);
          setError(data.msg);
        } else {
          console.log(err);
          setSuccess(true);
          setShowPopup(false);
        }
      }
    );
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.email) {
      setError(t("Invalid email"));
    }
  };

  return (
    <>
      <Container
        fluid
        pb={"2em"}
        pt={"3rem"}
        // bg="dark.8"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(20,6,54,1) 0%, rgba(0,0,0,1) 47%, rgba(20,6,54,1) 100%)",
        }}
      >
        <Center>
          <svg
            width="300px"
            height="300px"
            viewBox="0 0 1024 1024"
            fill="#000000"
            className="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M975.928 744.598a8.006 8.006 0 0 1-7.856-6.608l-55.538-314.996a7.998 7.998 0 0 1 6.482-9.262c4.216-0.774 8.48 2.124 9.26 6.48l55.54 314.998a8.002 8.002 0 0 1-7.888 9.388zM984.268 791.84a7.99 7.99 0 0 1-7.856-6.606c-7.214-40.824-163.534-48.354-260.38-43.464-4.826 0.218-8.184-3.186-8.386-7.59a7.974 7.974 0 0 1 7.574-8.372c27.098-1.376 264.926-11.34 276.938 56.646a7.992 7.992 0 0 1-6.482 9.26c-0.47 0.094-0.94 0.126-1.408 0.126z"
              fill="white"
            />
            <path
              d="M676.722 521.292a8 8 0 0 1-7.858-6.606 8 8 0 0 1 6.482-9.264c67.906-11.994 241.374-58.66 228.848-129.69a7.998 7.998 0 0 1 6.48-9.262c4.25-0.774 8.496 2.124 9.262 6.48 7.686 43.528-31.5 81.814-116.46 113.792-60.91 22.918-124.708 34.312-125.35 34.422a7.408 7.408 0 0 1-1.404 0.128z"
              fill="white"
            />
            <path
              d="M912.05 382.34a7.992 7.992 0 0 1-7.856-6.614 7.998 7.998 0 0 1 6.48-9.262l31.518-5.544c4.28-0.688 8.512 2.14 9.262 6.498a7.996 7.996 0 0 1-6.482 9.262l-31.516 5.542a8.534 8.534 0 0 1-1.406 0.118z"
              fill="white"
            />
            <path
              d="M1015.754 786.296a8.006 8.006 0 0 1-7.856-6.608l-72.186-409.5a7.996 7.996 0 0 1 6.48-9.262c4.28-0.774 8.496 2.124 9.262 6.482l72.186 409.5a8 8 0 0 1-7.886 9.388z"
              fill="white"
            />
            <path
              d="M984.268 791.84a7.992 7.992 0 0 1-1.374-15.868l31.484-5.542c4.232-0.812 8.48 2.108 9.262 6.48a8 8 0 0 1-6.48 9.262l-31.486 5.542a7.112 7.112 0 0 1-1.406 0.126zM558.12 769.554a8.006 8.006 0 0 1-7.856-6.608l-38.888-220.492a7.912 7.912 0 0 1 1.328-5.966 7.86 7.86 0 0 1 5.154-3.294l157.49-27.77c4.232-0.794 8.48 2.124 9.262 6.482a7.998 7.998 0 0 1-6.482 9.262l-149.62 26.378 36.11 204.75 149.62-26.378c4.28-0.796 8.496 2.124 9.26 6.48a8 8 0 0 1-6.48 9.262l-157.49 27.77c-0.472 0.078-0.94 0.124-1.408 0.124z"
              fill="white"
            />
            <path
              d="M558.134 769.554a7.24 7.24 0 0 1-1.638-0.172l-84.306-17.618a7.96 7.96 0 0 1-6.23-6.436l-27.77-157.49a7.974 7.974 0 0 1 3.656-8.184l73.184-45.384a8.13 8.13 0 0 1 7.482-0.5 7.966 7.966 0 0 1 4.606 5.904l38.888 220.492a7.944 7.944 0 0 1-2.31 7.122 7.934 7.934 0 0 1-5.562 2.266z m-77.37-32.346l67.44 14.104-34.782-197.238-58.552 36.328 25.894 146.806zM710.05 710.27a8.004 8.004 0 0 1-7.856-6.608l-27.77-157.49a8 8 0 0 1 6.48-9.262c4.282-0.796 8.496 2.11 9.262 6.482l27.77 157.49a8 8 0 0 1-7.886 9.388z"
              fill="white"
            />
            <path
              d="M483.092 620.374a7.98 7.98 0 0 1-7.856-6.608 8.016 8.016 0 0 1 6.48-9.278l15.744-2.748c4.28-0.75 8.496 2.124 9.26 6.498a7.974 7.974 0 0 1-6.48 9.244l-15.744 2.782a10.708 10.708 0 0 1-1.404 0.11zM499.74 714.876a7.98 7.98 0 0 1-7.856-6.622 7.974 7.974 0 0 1 6.496-9.246l15.776-2.78c4.278-0.718 8.48 2.154 9.244 6.496a8.014 8.014 0 0 1-6.496 9.278l-15.774 2.748a6.954 6.954 0 0 1-1.39 0.126zM491.432 667.632a8.006 8.006 0 0 1-7.856-6.608 8 8 0 0 1 6.48-9.262l15.744-2.78c4.216-0.812 8.482 2.11 9.26 6.48a8 8 0 0 1-6.48 9.262l-15.744 2.782c-0.466 0.08-0.936 0.126-1.404 0.126zM533.6 538.41a7.994 7.994 0 0 1-1.376-15.868l31.486-5.56c4.216-0.774 8.48 2.124 9.262 6.48a7.998 7.998 0 0 1-6.482 9.262l-31.484 5.56c-0.468 0.08-0.938 0.126-1.406 0.126zM773.038 975.242a7.982 7.982 0 0 1-7.138-4.406l-75.028-149.148c-1.984-3.954-0.406-8.762 3.544-10.73 3.904-2 8.73-0.422 10.73 3.544l75.028 149.15c1.984 3.952 0.406 8.762-3.544 10.73a7.8 7.8 0 0 1-3.592 0.86zM694.292 989.14a7.98 7.98 0 0 1-7.136-4.404l-75.03-149.182c-1.982-3.952-0.404-8.762 3.546-10.728 3.92-2 8.73-0.438 10.728 3.544l75.03 149.182c1.982 3.952 0.406 8.762-3.546 10.728a7.764 7.764 0 0 1-3.592 0.86z"
              fill="white"
            />
            <path
              d="M678.502 991.906a7.992 7.992 0 0 1-7.856-6.608 7.992 7.992 0 0 1 6.48-9.262l110.264-19.444c4.246-0.796 8.48 2.108 9.26 6.48a8 8 0 0 1-6.48 9.262l-110.262 19.446a6.964 6.964 0 0 1-1.406 0.126zM582.204 814.034a8 8 0 0 1-7.856-6.606l-3.124-17.726a7.992 7.992 0 0 1 6.482-9.262c4.232-0.812 8.48 2.124 9.26 6.482l3.124 17.726a8 8 0 0 1-7.886 9.386z"
              fill="white"
            />
            <path
              d="M582.204 814.034a8.004 8.004 0 0 1-7.872-6.636 8.01 8.01 0 0 1 6.528-9.246l141.81-24.52a8.08 8.08 0 0 1 9.244 6.528 8.01 8.01 0 0 1-6.528 9.246l-141.81 24.52c-0.452 0.06-0.92 0.108-1.372 0.108z"
              fill="white"
            />
            <path
              d="M724.012 789.514a8.004 8.004 0 0 1-7.856-6.608l-2.78-15.742a8 8 0 0 1 6.48-9.262c4.264-0.796 8.496 2.124 9.262 6.482l2.78 15.742a8 8 0 0 1-7.886 9.388zM1015.77 527.868a7.99 7.99 0 0 1-7.996-7.996V40.092c0-4.42 3.576-7.998 7.996-7.998s7.996 3.578 7.996 7.998v479.78a7.99 7.99 0 0 1-7.996 7.996zM104.186 751.766a7.992 7.992 0 0 1-7.996-7.996V40.092a7.994 7.994 0 0 1 7.996-7.998 7.994 7.994 0 0 1 7.998 7.998v703.678a7.992 7.992 0 0 1-7.998 7.996z"
              fill="white"
            />
            <path
              d="M56.208 799.742a7.99 7.99 0 0 1-7.996-7.996 7.992 7.992 0 0 1 7.996-7.996c22.052 0 39.982-17.93 39.982-39.98a7.992 7.992 0 0 1 7.996-7.996 7.992 7.992 0 0 1 7.998 7.996c0 30.858-25.114 55.972-55.976 55.972z"
              fill="white"
            />
            <path
              d="M56.208 799.742c-30.862 0-55.974-25.114-55.974-55.972 0-4.42 3.576-7.996 7.996-7.996s7.996 3.576 7.996 7.996c0 22.05 17.93 39.98 39.982 39.98a7.992 7.992 0 0 1 7.996 7.996 7.988 7.988 0 0 1-7.996 7.996z"
              fill="white"
            />
            <path
              d="M8.23 751.766a7.99 7.99 0 0 1-7.996-7.996V88.068c0-4.42 3.576-7.996 7.996-7.996s7.996 3.576 7.996 7.996v655.702a7.99 7.99 0 0 1-7.996 7.996zM72.202 751.766a7.99 7.99 0 0 1-7.996-7.996V56.084c0-4.42 3.576-7.996 7.996-7.996s7.996 3.576 7.996 7.996v687.686a7.99 7.99 0 0 1-7.996 7.996zM40.216 751.766a7.992 7.992 0 0 1-7.996-7.996V72.076a7.992 7.992 0 0 1 7.996-7.996 7.992 7.992 0 0 1 7.998 7.996v671.694a7.994 7.994 0 0 1-7.998 7.996z"
              fill="white"
            />
            <path
              d="M56.208 767.758c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996a8.012 8.012 0 0 0 7.996-7.996c0-4.42 3.576-7.996 7.996-7.996s7.996 3.576 7.996 7.996c0.002 13.226-10.758 23.988-23.988 23.988z"
              fill="white"
            />
            <path
              d="M56.208 767.758c-13.228 0-23.99-10.762-23.99-23.988a7.992 7.992 0 0 1 7.996-7.996 7.992 7.992 0 0 1 7.998 7.996 8.012 8.012 0 0 0 7.996 7.996c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996zM505.502 799.742H56.208a7.99 7.99 0 0 1-7.996-7.996 7.992 7.992 0 0 1 7.996-7.996h449.294a7.994 7.994 0 0 1 7.998 7.996 7.992 7.992 0 0 1-7.998 7.996zM1015.77 48.088H104.186a7.994 7.994 0 0 1-7.996-7.996 7.994 7.994 0 0 1 7.996-7.998h911.584a7.992 7.992 0 0 1 7.996 7.998 7.992 7.992 0 0 1-7.996 7.996zM951.798 208.014H200.142a7.99 7.99 0 0 1-7.996-7.996V104.062a7.992 7.992 0 0 1 7.996-7.998h751.656a7.992 7.992 0 0 1 7.996 7.998v95.956a7.99 7.99 0 0 1-7.996 7.996z m-743.66-15.992h735.664V112.058H208.138v79.964z"
              fill="white"
            />
            <path
              d="M903.82 160.036H248.12c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h655.7c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996zM919.812 799.742h-143.934a7.99 7.99 0 0 1-7.996-7.996 7.992 7.992 0 0 1 7.996-7.996h143.934a7.99 7.99 0 0 1 7.996 7.996 7.988 7.988 0 0 1-7.996 7.996zM424.042 415.918h-223.9a7.99 7.99 0 0 1-7.996-7.996v-143.934a7.99 7.99 0 0 1 7.996-7.996H424.04a7.992 7.992 0 0 1 7.996 7.996v143.934a7.99 7.99 0 0 1-7.994 7.996z m-215.904-15.992h207.906v-127.942H208.138v127.942z"
              fill="white"
            />
            <path
              d="M296.1 399.926a8.008 8.008 0 0 1-6.404-12.792l47.978-63.97a8.014 8.014 0 0 1 11.198-1.6 8.006 8.006 0 0 1 1.61 11.19l-47.978 63.97a8 8 0 0 1-6.404 3.202z"
              fill="darkred"
            />
            <path
              d="M392.054 399.926a7.992 7.992 0 0 1-6.402-3.202l-47.978-63.97a8.004 8.004 0 0 1 1.608-11.19 7.996 7.996 0 0 1 11.198 1.6l47.978 63.97a8.008 8.008 0 0 1-6.404 12.792zM248.122 399.926a7.998 7.998 0 0 1-6.654-12.432l31.986-47.978a8.008 8.008 0 0 1 11.088-2.216 7.998 7.998 0 0 1 2.218 11.088l-31.986 47.978a7.992 7.992 0 0 1-6.652 3.56z"
              fill="darkred"
            />
            <path
              d="M290.758 367.942a7.994 7.994 0 0 1-6.654-3.56l-10.652-15.994a7.994 7.994 0 0 1 2.218-11.088c3.638-2.454 8.622-1.46 11.088 2.216l10.65 15.994a7.994 7.994 0 0 1-6.65 12.432zM248.122 335.956c-13.228 0-23.99-10.76-23.99-23.988s10.76-23.99 23.99-23.99 23.988 10.762 23.988 23.99-10.76 23.988-23.988 23.988z m0-31.986c-4.404 0-7.996 3.584-7.996 7.996s3.592 7.996 7.996 7.996 7.996-3.584 7.996-7.996-3.592-7.996-7.996-7.996z"
              fill="darkred"
            />
            <path
              d="M679.924 271.984H472.018c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.996 7.998-7.996h207.906c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M679.924 319.962H472.018c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.996 7.998-7.996h207.906c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M679.924 367.942H472.018c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.998 7.998-7.998h207.906c4.42 0 7.996 3.578 7.996 7.998s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M679.924 415.918H472.018c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.996 7.998-7.996h207.906c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M679.924 463.896H472.018c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.996 7.998-7.996h207.906c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M504.004 511.876h-31.986c-4.42 0-7.998-3.576-7.998-7.996s3.578-7.996 7.998-7.996h31.986c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M424.79 463.896H200.892c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h223.898c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M392.804 655.808h-191.912c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h191.912c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M408.796 703.788H200.892c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h207.904c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M424.79 751.766H200.892c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h223.898c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M424.79 511.876H200.892c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.996 7.996-7.996h223.898c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M408.796 559.854H200.892c-4.42 0-7.996-3.576-7.996-7.996s3.576-7.998 7.996-7.998h207.904c4.42 0 7.996 3.578 7.996 7.998s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M392.804 607.832h-191.912a7.992 7.992 0 0 1-7.996-7.996 7.992 7.992 0 0 1 7.996-7.998h191.912a7.992 7.992 0 0 1 7.996 7.998 7.992 7.992 0 0 1-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M951.798 271.984H727.902c-4.422 0-7.998-3.576-7.998-7.996s3.576-7.996 7.998-7.996h223.896c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M951.798 319.962H727.902c-4.422 0-7.998-3.576-7.998-7.996s3.576-7.996 7.998-7.996h223.896c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M871.836 367.942h-143.934c-4.422 0-7.998-3.576-7.998-7.996s3.576-7.998 7.998-7.998h143.934c4.42 0 7.996 3.578 7.996 7.998s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
            <path
              d="M823.858 415.918h-95.956c-4.422 0-7.998-3.576-7.998-7.996s3.576-7.996 7.998-7.996h95.956c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="amber"
            />
            <path
              d="M743.894 463.896h-15.992c-4.422 0-7.998-3.576-7.998-7.996s3.576-7.996 7.998-7.996h15.992c4.42 0 7.996 3.576 7.996 7.996s-3.576 7.996-7.996 7.996z"
              fill="#FFBF00"
            />
          </svg>
        </Center>
        <Flex
          mih={0}
          //bg="dark.8"
          gap="xs"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Title
            visibleFrom="md"
            order={3}
            size="h1"
            c="white"
            style={{ textAlign: "center" }}
          >
            <Trans>¿Sabes cuantos crímenes se cometieron por tu rumbo?</Trans>
          </Title>
          <Title hiddenFrom="md" order={3} size="h1" c="white">
            <Trans>¿Sabes cuantos crímenes se cometieron por tu rumbo?</Trans>
          </Title>
          <Title
            visibleFrom="md"
            order={4}
            size="h2"
            mt={0}
            mb={1}
            c="white"
            style={{ textAlign: "center" }}
          >
            <Trans i18nKey="emailText">
              Mantente informado de los últimos hechos criminales en la Ciudad
              de México
            </Trans>
          </Title>
          <Title hiddenFrom="md" order={4} size="h2" mt={0} mb={1} c="white">
            <Trans i18nKey="emailText">
              Mantente informado de los últimos hechos criminales en la Ciudad
              de México
            </Trans>
          </Title>

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
                type="email"
                withErrorStyles
                rightSectionPointerEvents="none"
                rightSection={icon}
                key={form.key("email")}
                {...form.getInputProps("email")}
                placeholder={t("Your email")}
                error={error}
                disabled={success}
                aria-label="Email for submission"
                size="md"
              />

              <Button
                type="submit"
                onClick={() =>
                  trackSubscribe({
                    type: "EmbeddedSubscribe",
                    language: language,
                    localizedPath: localizedPath,
                  })
                }
                style={{ color: "#000" }}
                bg={success ? "#4caf50" : "#0972C8"}
                disabled={success}
                size="md"
                id="PageSubscribeButton"
              >
                {success ? (
                  <Text c="#ffffff" fw={500} span>
                    <Trans>✓ Success</Trans>
                  </Text>
                ) : (
                  <Text c="#ffffff" fw={500} span>
                    <Trans>Submit</Trans>
                  </Text>
                )}
              </Button>
            </Flex>
          </form>
          <Space hiddenFrom="md" pt={"25px"} />
          <Text c="white" size="xl" span>
            <Text hiddenFrom="md" span>
              ✓{" "}
            </Text>
            <Trans>Únete a más de </Trans>
            <Text fw={700} fs="italic" c="#ff9912" span>
              <Trans>1,000 lectores</Trans>
            </Text>{" "}
            <br className="mantine-hidden-from-md" />{" "}
            <Text visibleFrom="md" span>
              |{" "}
            </Text>
            <Text hiddenFrom="md" span>
              ✓{" "}
            </Text>
            <Text fw={700} fs="italic" c="#ff9912" span>
              <Trans> 1 email</Trans>
            </Text>{" "}
            <Trans>por mes</Trans> <br className="mantine-hidden-from-md" />{" "}
            <Text visibleFrom="md" span>
              |{" "}
            </Text>
            <Text hiddenFrom="md" span>
              ✓{" "}
            </Text>
            100%{" "}
            <Text fw={700} fs="italic" c="#ff9912" span>
              <Trans>gratis</Trans>
            </Text>
          </Text>
        </Flex>
      </Container>
    </>
  );
};

export const ModalSubscribe = ({ language, localizedPath }) => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [showPopup, setShowPopup] = useLocalStorage({
    key: "showPopup",
    defaultValue: true,
  });
  const idle = useIdle(50000, { initialState: false });

  // const [leftPage, setLeftPage] = useState(0);
  // usePageLeave(() => {
  //   setLeftPage((p) => p + 1);
  // });

  // Value is set both to state and localStorage at 'color-scheme'
  // setValue("light");
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
    //url = url.replace("/post?", "/post-json?");
    jsonp(
      `${url}&EMAIL=${encodeURIComponent(values.email)}`,
      { param: "c" },
      (err, data) => {
        if (err) {
          console.log(err);
          setError(t("Invalid email"));
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
      setError(t("Invalid email"));
    }
  };

  useEffect(() => {
    if ((idle) && showPopup) {
      // trackModalOpen({
      //   type: "ModalOpen",
      //   language: language,
      //   localizedPath: localizedPath,
      // });
      open();
    }
    // Some logic only to be performed when variable changes OR at initial render
  }, [idle, open, showPopup]);

  return (
    // <>
    //   <Modal opened={opened} onClose={close} title="Authentication">
    //     {/* Modal content */}
    //   </Modal>

    // </>
    <>
      <Modal
        centered
        opened={opened}
        closeButtonProps={{ "aria-label": t("Close") }}
        // withCloseButton
        onClose={() => {
          setShowPopup(false);
          close();
        }}
        title={t("Subscribe to email newsletter")}
        size="sm"
        radius="md"
        transitionProps={{ duration: 50, transition: "pop" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 6,
        }}
        styles={{
          title: {
            fontWeight: "bold",
            fontSize: "var(--mantine-font-size-xl)",
          },
        }}
        // shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        // position={{ bottom: 5, right: 5 }}
      >
        {/* <Text size="md" fw={500}>
          <Trans>Subscribe to email newsletter</Trans>
        </Text> */}
        <Center>
          <IconMail size="3rem" stroke={1.5} />
        </Center>
        <Text size="sm" mb="xs" fw={400} c="#222">
          <Trans>One email per month and more than 1,000 subscribers</Trans>
        </Text>
        <form
          onSubmit={form.onSubmit(handleSubmit, handleError)}
          id="ModalForm"
        >
          <Group align="flex-end">
            <TextInput
              // mt={0}
              type="email"
              withErrorStyles
              rightSectionPointerEvents="none"
              rightSection={icon}
              key={form.key("email")}
              {...form.getInputProps("email")}
              placeholder={t("Your email")}
              error={error}
              disabled={success}
              aria-label="Email for submission"
              size="sm"
              styles={{
                input: { outline: "none", border: ".1px solid #aaa" },
              }}
            />

            <Button
              type="submit"
              onClick={() =>
                trackSubscribe({
                  type: "ModalSubscribe",
                  language: language,
                  localizedPath: localizedPath,
                })
              }
              style={{ color: "#000" }}
              bg={success ? "#4caf50" : "#0972C8"}
              disabled={success}
              size="sm"
              aria-label="close popup"
              id="PopupButton"
            >
              {success ? (
                <Text c="#ffffff" fw={500} span>
                  <Trans>✓ Success</Trans>
                </Text>
              ) : (
                <Text c="#ffffff" fw={500} span>
                  <Trans>Subscribe</Trans>
                </Text>
              )}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default MailChimp;
