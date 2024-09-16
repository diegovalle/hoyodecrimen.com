import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import {
  Combobox,
  Group,
  Input,
  InputBase,
  useCombobox,
  Text,
} from "@mantine/core";

function ComboboxCrime(props) {
  // const [value, setValue] = useState<string | null>("HOMICIDIO DOLOSO");
  const [crimeList, setCrimeList] = useState(["HOMICIDIO DOLOSO"]);
  const meta = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          satelliteMap
          apiUrl
        }
      }
    }
  `);

  useEffect(() => {
    const url = `${meta.site.siteMetadata.apiUrl}/api/v1/crimes`;
    const fetchData = async () => {
      let retries = 0;
      while (retries < 3) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setCrimeList(data.rows.map((r) => r.crime));
          return;
        } catch (error) {
          retries++;
          console.error(`Attempt ${retries} failed. ${error.message}`);
          if (retries === 3) {
            console.error("Failed to fetch crime list after 3 attempts");
          }
        }
      }
    };

    fetchData();
  }, [meta.site.siteMetadata.apiUrl]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
        combobox.opened = false;
      }
    },
  });

  const sortOptions = (items) => {
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

  const options = sortOptions(crimeList).map((item) => (
    <Combobox.Option
      value={item}
      key={item}
      active={item === props.selectedCrime}
    >
      <Group gap="xs">
        {/*  {item === value && <CheckIcon size={12} />} */}
        <Text fz={"14px"} span c={getColorForText(item)}>
          ●
        </Text>
        <Text fz={"14px"} span>
          {item.replace(/AUTOMOTOR /g, "")}
        </Text>
      </Group>
    </Combobox.Option>
  ));

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

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      withinPortal={false}
      onOptionSubmit={(val) => {
        //setValue(val);
        props.updateCrime(val);
        combobox.updateSelectedOptionIndex("active");
        combobox.toggleDropdown();
      }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {(
            <>
              <Text
                fz={"14px"}
                span
                c={getColorForText(props.selectedCrime || "HOMICIDIO DOLOSO")}
              >
                ●
              </Text>{" "}
              {props.selectedCrime.replace(/AUTOMOTOR /g, "")}
            </>
          ) || (
            <Input.Placeholder fz={"14px"}>
              <Text span>HOMICIDIO DOLOSO</Text>
            </Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default ComboboxCrime;
