import * as React from "react";
import { useState } from "react";
import {
  Radio,
  Group,
  CheckIcon,
  Space,
  RangeSlider,
  Container,
  Divider,
  Text,
  Center,
  AspectRatio,
  Title,
  rem,
  Skeleton,
} from "@mantine/core";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDebouncedValue } from "@mantine/hooks";
import MultiSelectCrime from "./MultiSelectCrime";
import { YYYYmmToStr } from "./utils";

export const MapFilters = (props: Props) => {
  const { t } = useTranslation();
  const [debounced, cancel] = useDebouncedValue(props.selectedCrimes, 1000);

  return (
    <>
      <Group>
        <Center pl={"1rem"} pr={"1rem"} pt={"2rem"}>
          <Title order={1} size="sm">
            <Trans>
              Police investigations started by the FGJ‑CDMX since January 2019
            </Trans>
          </Title>
        </Center>
        <Container pb="1rem" size="25rem">
          
          <Radio.Group
            name="favoriteFramework"
            label={t("Base Map")}
            defaultValue={props.checked}
          >
            <Group mt="xs">
              <Radio
                icon={CheckIcon}
                value="OpenStreetMap"
                label={t("Streets")}
                onChange={(event) => {
                  props.setChecked("OpenStreetMap");
                }}
              />
              <Radio
                icon={CheckIcon}
                value="Satellite"
                label={t("Satellite")}
                onChange={(event) => props.setChecked("Satellite")}
              />
            </Group>
          </Radio.Group>
          <Divider my="sm" variant="dashed" />
          <Space h="lg" />
          <Text size="sm">
            <Trans>Select a date range</Trans>: {props.monthsText}
          </Text>
          {/* <AspectRatio ratio={309.75 / (16+32)} style={{ flex: `0 0 ${rem(0)}` }}> */}
          {props.numMonths ? (
            <RangeSlider
              pl={30}
              pr={50}
              minRange={0}
              min={0}
              max={props.numMonths}
              marks={props.monthMarks}
              label={props.valueLabelFormat}
              value={
                props.dateValue === null
                  ? [0, props.numMonths]
                  : props.dateValue
              }
              onChange={props.setDateValue}
              onChangeEnd={(v) => {
                props.setDateEndValue(v);
                props.setMonthsText(
                  !props.monthMarks
                    ? t("All")
                    : YYYYmmToStr(props.monthsAvailable[v[0]], props.language) +
                        " - " +
                        YYYYmmToStr(props.monthsAvailable[v[1]], props.language)
                );
              }}
              // classNames={classes}
            />
          ) : (
            <RangeSlider
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
          <Space h="xl" />
          <Divider my="sm" variant="dashed" />
          <Text size="sm">
            <Trans>Select an hour range</Trans>: {props.hoursText}
          </Text>
          <RangeSlider
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
          />
          <Space h="xl" />
          <Divider my="sm" variant="dashed" />
          <MultiSelectCrime
            pl={30}
            pr={30}
            crimeList={props.crimeList}
            setSelectedCrimes={props.setSelectedCrimes}
            defaultValue={debounced}
          />
        </Container>
      </Group>
    </>
  );
};

export default React.memo(MapFilters);
