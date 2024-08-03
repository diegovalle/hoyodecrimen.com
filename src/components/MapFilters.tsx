import * as React from "react";
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
  Title,
} from "@mantine/core";
import { useTranslation, Trans } from "gatsby-plugin-react-i18next";

import { useDebouncedValue } from '@mantine/hooks';
import MultiSelectCrime from "./MultiSelectCrime";

export const MapFilters = (props: Props) => {
    const { t } = useTranslation();
    const [debounced, cancel] = useDebouncedValue(props.selectedCrimes, 1000);

  return (
    <>
      <Center pl={"1rem"} pr={"1rem"} pt={"2rem"}>
        <Title order={1} size="sm">
          <Trans>
            Police investigations started by the FGJ‑CDMX since January 2019
          </Trans>
        </Title>
      </Center>
      <Container pb="1rem" size="25rem">
        <Space h="xl" />
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
        <Space h="xl" />
        <Text size="sm">
          <Trans>Select a date range</Trans>:
        </Text>
        {props.numMonths ? (
          <RangeSlider
            pl={30}
            pr={50}
            minRange={0}
            min={0}
            max={props.numMonths}
            marks={props.monthMarks}
            label={props.valueLabelFormat}
            onChangeEnd={props.setDateEndValue}
           // classNames={classes}
          />
        ) : null}
        <Space h="xl" />
        <Divider my="sm" variant="dashed" />
        <Text size="sm">
          <Trans>Select an hour range</Trans>:
        </Text>
        <RangeSlider
          pl={30}
          pr={50}
          minRange={0}
          min={5}
          max={28}
          label={props.hourLabelFormat}
          marks={props.hourMarks}
          onChangeEnd={props.setHourEndValue}
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
    </>
  );
};

export default React.memo(MapFilters);