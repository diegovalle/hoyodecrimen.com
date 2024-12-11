import * as React from "react";
import { useState } from "react";
import {
  Space,
  RangeSlider,
  Container,
  Divider,
  Text,
  Center,
  Title,
} from "@mantine/core";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDebouncedValue } from "@mantine/hooks";
import MultiSelectCrime from "./MultiSelectCrime";
import { YYYYmmToStr } from "./utils";

import * as classes from "./MapLayer.module.css";

export const MapFilters = (props: Props) => {
  const { t } = useTranslation();
  const [debounced] = useDebouncedValue(props.selectedCrimes, 1000);

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const [active, setActive] = useState(0);

  const data = [t("Streets"), t("Satellite")];

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => {
        if (data[index] === t("Streets")) props.setChecked("OpenStreetMap");
        else props.setChecked("Satellite");
        setActive(index);
      }}
      mod={{ active: active === index }}
    >
      <span className={classes.controlLabel}>{item}</span>
    </UnstyledButton>
  ));

  return (
    <>
      <Center pl={"1rem"} pr={"1rem"} pt={"2rem"}>
        <Title order={1} size="sm">
          <Trans>Police investigations started by the FGJ‑CDMX</Trans>
        </Title>
      </Center>
      <Space h="sm" />

      <Container pb="1rem" fluid>
        <Text fw={500} size="sm">
          {t("Base Map") + ":"}
        </Text>
        <Center pl={"1rem"} pr={"1rem"}>
          <div className={classes.root} ref={setRootRef}>
            {controls}
            <FloatingIndicator
              target={controlsRefs[active]}
              parent={rootRef}
              className={classes.indicator}
            />
          </div>
        </Center>
        <Divider my="sm" variant="dashed" />
        {/* <Space h="sm" /> */}
        <Text size="sm">
          <Text fw={500} span>
            <Trans>Select a date range</Trans>:
          </Text>{" "}
          {props.monthsText}
        </Text>
        {/* <AspectRatio ratio={309.75 / (16+32)} style={{ flex: `0 0 ${rem(0)}` }}> */}
        {props.numMonths ? (
          <RangeSlider
            size="lg"
            pl={30}
            pr={50}
            minRange={0}
            min={0}
            max={props.numMonths}
            marks={props.monthMarks}
            label={props.valueLabelFormat}
            value={
              props.dateValue === null ? [0, props.numMonths] : props.dateValue
            }
            onChange={props.setDateValue}
            onChangeEnd={(v) => {
              props.setDateEndValue(v);
              props.setMonthsText(
                !props.monthMarks
                  ? t("All")
                  : YYYYmmToStr(
                      props.monthsAvailable.current[v[0]],
                      props.language
                    ) +
                      " - " +
                      YYYYmmToStr(
                        props.monthsAvailable.current[v[1]],
                        props.language
                      )
              );
            }}
            styles={{
              markLabel: {
                color: "var(--mantine-color-gray-7)",
                fontSize: "var(--mantine-font-size-sm)",
              },
            }}
            // classNames={classes}
          />
        ) : (
          <RangeSlider
            size="lg"
            pl={30}
            pr={50}
            minRange={0}
            min={0}
            max={70}
            marks={[{ value: 0, label: "⠀⠀⠀" }]}
          />
        )}
        {/* <Skeleton height={19+32} radius="xl" /> */}
        {/* </AspectRatio> */}
        <Space h="lg" />
        <Divider my="sm" variant="dashed" />
        <Text size="sm">
          <Text fw={500} span>
            <Trans>Select an hour range</Trans>:{" "}
          </Text>{" "}
          {props.hoursText}
        </Text>
        <RangeSlider
          size="lg"
          pl={30}
          pr={50}
          minRange={0}
          min={5}
          max={28}
          label={props.hourLabelFormat}
          marks={props.hourMarks}
          value={props.hourValue ? props.hourValue : [0, 28]}
          onChange={props.setHourValue}
          onChangeEnd={(v) => {
            let meridiem_start = v[0] % 24 >= 12 ? " PM" : " AM";
            let meridiem_end = v[1] % 24 >= 12 ? " PM" : " AM";
            let hour_start = v[0] % 12 === 0 ? 12 : v[0] % 12;
            let hour_end = v[1] % 12 === 0 ? 12 : v[1] % 12;
            props.setHoursText(
              hour_start + meridiem_start + " - " + hour_end + meridiem_end
            );
            props.setHourEndValue(v);
          }}
          styles={{
            markLabel: {
              color: "var(--mantine-color-gray-7)",
              fontSize: "var(--mantine-font-size-sm)",
            },
          }}
        />
        <Space h="lg" />
        <Divider my="sm" variant="dashed" />
        <MultiSelectCrime
          pl={30}
          pr={30}
          crimeList={props.crimeList}
          setSelectedCrimes={props.setSelectedCrimes}
          defaultValue={debounced}
        />
      </Container>
    </>
  );
};

export default React.memo(MapFilters);
