import React from "react";
import { useState } from "react";
import { Group, OptionsFilter, Text, Chip } from "@mantine/core";
import { useTranslation } from "gatsby-plugin-react-i18next";

function MultiChipCrime({
  crimeList,
  setSelectedCrimes,
  defaultValue,
} = props) {
  const { t } = useTranslation();

  const [value, setValue] = useState(["react"]);

  const handleSelect = (e) => {
    e = e.map((x) => x.replace(/💀 |🚘 |🚗 /, ""));
    setSelectedCrimes([...e]);
  };

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort(function (a, b) {
      return a.label
        .replace(/HOMICIDIO DOLOSO/, "0")
        .replace(/LESIONES POR ARMA DE FUEGO/, "1")
        .replace(/ROBO DE VEHICULO AUTOMOTOR C.V./, "2")
        .replace(/ROBO DE VEHICULO AUTOMOTOR S.V./, "3")
        .replace(/ROBO A TRANSEUNTE C.V./, "4")
        .replace(/ROBO A TRANSEUNTE S.V./, "5")
        .localeCompare(
          b.label
            .replace(/HOMICIDIO DOLOSO/, "0")
            .replace(/LESIONES POR ARMA DE FUEGO/, "1")
            .replace(/ROBO DE VEHICULO AUTOMOTOR C.V./, "2")
            .replace(/ROBO DE VEHICULO AUTOMOTOR S.V./, "3")
            .replace(/ROBO A TRANSEUNTE C.V./, "4")
            .replace(/ROBO A TRANSEUNTE S.V./, "5")
        );
    });
    return filtered;
  };

  const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({
    option,
  }) => {
    let color;
    switch (option.value) {
      case "HOMICIDIO DOLOSO":
        color = "#e41a1c";
        break;
      case "ROBO DE VEHICULO AUTOMOTOR C.V.":
        color = "#984ea3";
        break;
      case "ROBO DE VEHICULO AUTOMOTOR S.V.":
        color = "#41ab5d";
        break;
      case "ROBO A TRANSEUNTE C.V.":
        color = "#377eb8";
        break;
      case "LESIONES POR ARMA DE FUEGO":
        color = "#fe9929";
        break;
      default:
        color = "#777";
        break;
    }

    return (
      <div>
        <Text size="sm">
          <span style={{ color: color }}>⚫︎ </span>
          {option.value}
        </Text>
      </div>
    );
  };

  return (
    <>
      {crimeList ? (
        <Chip.Group multiple value={value} onChange={setValue}>
         
            {crimeList.map((item, i) => {
              if (i % 3 === 0)
                return (
                  <Group
                    
                    wrap="wrap"
                    preventGrowOverflow={false}
                    justify="flex-start"
                    mt="xs"
                    gap="xs"
                  >
                    <Chip size="xs" radius="sm" padding={1} value={String(i)}>
                      {item}
                    </Chip>
                  </Group>
                );
              else
                return (
                  <Chip size="xs" radius="sm" padding={1} value={String(i)}>
                    {item}
                  </Chip>
                );
            })}
         
        </Chip.Group>
      ) : null}
      {/* <MultiSelect
        label={t("Crimes")}
        placeholder="Pick value"
        data={crimeList}
        renderOption={renderMultiSelectOption}
        hidePickedOptions
        onChange={handleSelect}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
        mt="md"
        defaultValue={defaultValue} //🚗 🚘 🔫
        filter={optionsFilter}
      /> */}
    </>
  );
}

export default MultiChipCrime;
