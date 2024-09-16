import React, { useState } from "react";
import {
  OptionsFilter,
  Text,
  CheckIcon,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";
import { useTranslation } from "gatsby-plugin-react-i18next";

function MultiSelectCrime({
  crimeList,
  setSelectedCrimes,
  defaultValue,
} = props) {
  const { t } = useTranslation();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [value, setValue] = useState<string[]>(["HOMICIDIO DOLOSO"]);

  const handleValueSelect = (val: string) => {
    setSelectedCrimes((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );
    setValue((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );
  };

  const handleValueRemove = (val: string) => {
    setSelectedCrimes((current) => current.filter((v) => v !== val));
    setValue((current) => current.filter((v) => v !== val));
  };

  function getColorForText(text) {
    // Convert text to uppercase and remove accents
    const normalizedText = text
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    switch (normalizedText) {
      case "HOMICIDIO DOLOSO":
        return "#e41a1c";
      case "LESIONES POR ARMA DE FUEGO":
        return "#fe9929";
      case "ROBO DE VEHICULO AUTOMOTOR C.V.":
        return "#984ea3";
      case "ROBO DE VEHICULO AUTOMOTOR S.V.":
        return "#41ab5d";
      case "ROBO A TRANSEUNTE C.V.":
        return "#377eb8";
      default:
        return "#777"; // Default color for unknown text
    }
  }

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      <Text fz={"14px"} span c={getColorForText(item || "HOMICIDIO DOLOSO")}>
        ●
      </Text>{" "}
      {item.replace("AUTOMOTOR ", "")}
    </Pill>
  ));

  const sortCrimes = (items) => {
    if (items.length === 1) return items;
    return items.sort(function (a, b) {
      return a
        .replace(/HOMICIDIO DOLOSO/, "0")
        .replace(/LESIONES POR ARMA DE FUEGO/, "1")
        .replace(/ROBO DE VEHICULO AUTOMOTOR C.V./, "2")
        .replace(/ROBO DE VEHICULO AUTOMOTOR S.V./, "3")
        .replace(/ROBO A TRANSEUNTE C.V./, "4")
        .replace(/ROBO A TRANSEUNTE S.V./, "5")
        .localeCompare(
          b
            .replace(/HOMICIDIO DOLOSO/, "0")
            .replace(/LESIONES POR ARMA DE FUEGO/, "1")
            .replace(/ROBO DE VEHICULO AUTOMOTOR C.V./, "2")
            .replace(/ROBO DE VEHICULO AUTOMOTOR S.V./, "3")
            .replace(/ROBO A TRANSEUNTE C.V./, "4")
            .replace(/ROBO A TRANSEUNTE S.V./, "5")
        );
    });
  };

  if (!crimeList) crimeList = ["HOMICIDIO DOLOSO"];
  const options = sortCrimes(crimeList).map((item) => (
    <Combobox.Option value={item} key={item} active={value.includes(item)}>
      <Group gap="sm">
        <Group gap={7}>
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <Text
            fz={"14px"}
            span
            c={getColorForText(item || "HOMICIDIO DOLOSO")}
          >
            ●
          </Text>{" "}
          <span>{item.replace("AUTOMOTOR ", "")}</span>
        </Group>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
          <Pill.Group>
            {values.length > 0 ? (
              values
            ) : (
              <Input.Placeholder>{t("Pick a value")}</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default MultiSelectCrime;
