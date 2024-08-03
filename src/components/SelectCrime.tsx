import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Select } from "@mantine/core";
import { useTranslation } from "gatsby-plugin-react-i18next";

function SelectCrime(props) {
  const [crimeList, setCrimeList] = useState(["HOMICIDIO DOLOSO"]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { t } = useTranslation();
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
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCrimeList(data.rows.map((r) => r.crime));
      });
  }, []);

  const handleSelect = (e) => {
    props.updateCrime(e);
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

  return (
    <>
      <Select
        label={t("Crime list")}
        placeholder="HOMICIDIO DOLOSO"
        data={crimeList}
        filter={optionsFilter}
        value={props.selectedCrime}
        onChange={handleSelect}
        allowDeselect={false}
      />
    </>
  );
}

export default SelectCrime;
