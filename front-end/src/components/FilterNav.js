import React from "react";
import styled from "styled-components";
import { CheckIcon, CheckedIcon } from "../icons/icons";

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.5s ease-in-out;
  z-index: 1000;
  overflow-y: auto; /* or use overflow-y: scroll; */
  max-height: 100vh; /* Adjust this to control the visible height */

  &.open {
    transform: translateX(0);
  }
`;

const Title = styled.h3`
  padding: 1rem 1rem 0;
  font-weight: 700;
  font-size: 21px;
`;

const FilterSection = styled.div`
  margin-bottom: 1rem; /* Spacing between filter sections */
`;

const FilterTitle = styled.h4`
  padding: 0.5rem 1rem;
  font-size: 18px;
  font-weight: bold;
  color: rgba(32, 34, 68, 1);
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 2.5rem;
  font-size: 14px;
  font-weight: bold;
`;

const FilterNav = ({
  isNavbarOpen,
  navbarRef,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleChange = (category, value) => {
    setSelectedFilters((prevSelectedFilters) => {
      const isTodos = value === 0;
      const formattedValue =
        category === "ods" ? String(value).padStart(2, "0") : value;
      const isSelected = prevSelectedFilters[category].includes(formattedValue);

      if (isTodos) {
        return {
          ...prevSelectedFilters,
          [category]: isSelected
            ? []
            : Array.from({ length: options[category].length }, (_, i) =>
                category === "ods" ? String(i).padStart(2, "0") : i
              ),
        };
      } else {
        const updatedCategory = isSelected
          ? prevSelectedFilters[category].filter(
              (item) => item !== formattedValue
            )
          : [...prevSelectedFilters[category], formattedValue];

        return {
          ...prevSelectedFilters,
          [category]:
            updatedCategory.includes("0") && updatedCategory.length > 1
              ? updatedCategory.filter((item) => item !== "0")
              : updatedCategory,
        };
      }
    });
  };

  const options = {
    subsidio: ["Todos", "Possui subsídio", "Não possui subsídio"],
    categoria: ["Todos", "Presencial", "Semipresencial", "EAD"],
    cargaHoraria: [
      "Todos",
      "0-2 Horas",
      "3-6 horas",
      "7-16 horas",
      "17+ horas",
    ],
    ods: [
      "Todos",
      "1. Erradicação da pobreza",
      "2. Fome zero e agricultura sustentável",
      "3. Saúde e Bem-Estar",
      "4. Educação de qualidade",
      "5. Igualdade de gênero",
      "6. Água potável e saneamento",
      "7. Energia limpa e acessível",
      "8. Trabalho decente e crescimento econômico",
      "9. Indústria, inovação e infraestrutura",
      "10. Redução das desigualdades",
      "11. Cidades e comunidades sustentáveis",
      "12. Consumo e produção responsáveis",
      "13. Ação contra a mudança global do clima",
      "14. Vida na água",
      "15. Vida terrestre",
      "16. Paz, justiça e instituições eficazes",
      "17. Parcerias e meios de implementação",
      "18. Igualdade étnico-racial",
    ],
  };

  return (
    <Container
      className={`right-navbar ${isNavbarOpen ? "open" : ""}`}
      ref={navbarRef}
    >
      <Title>Filtros</Title>

      <FilterSection>
        <FilterTitle>Subsídio</FilterTitle>
        {options.subsidio.map((category, index) => (
          <CheckboxContainer
            key={index}
            onClick={() => handleChange("subsidio", index)}
          >
            {selectedFilters.subsidio.includes(index) ? (
              <CheckedIcon className="mx-3" size="28px" />
            ) : (
              <CheckIcon className="mx-3" size="28px" />
            )}

            <label>{category}</label>
          </CheckboxContainer>
        ))}
      </FilterSection>

      <FilterSection>
        <FilterTitle>Categoria</FilterTitle>
        {options.categoria.map((category, index) => (
          <CheckboxContainer
            key={index}
            onClick={() => handleChange("categoria", index)}
          >
            {selectedFilters.categoria.includes(index) ? (
              <CheckedIcon className="mx-3" size="28px" />
            ) : (
              <CheckIcon className="mx-3" size="28px" />
            )}
            <label>{category}</label>
          </CheckboxContainer>
        ))}
      </FilterSection>

      <FilterSection>
        <FilterTitle>Carga Horária</FilterTitle>
        {options.cargaHoraria.map((hours, index) => (
          <CheckboxContainer
            key={index}
            onClick={() => handleChange("cargaHoraria", index)}
          >
            {selectedFilters.cargaHoraria.includes(index) ? (
              <CheckedIcon className="mx-3" size="28px" />
            ) : (
              <CheckIcon className="mx-3" size="28px" />
            )}
            <label>{hours}</label>
          </CheckboxContainer>
        ))}
      </FilterSection>

      <FilterSection>
        <FilterTitle>Objetivos de Desenvolvimento Sustentável</FilterTitle>
        {options.ods.map((ods, index) => (
          <CheckboxContainer
            key={index}
            onClick={() => handleChange("ods", index)}
          >
            {selectedFilters.ods.includes(String(index).padStart(2, "0")) ? (
              <CheckedIcon className="mx-3" size="28px" />
            ) : (
              <CheckIcon className="mx-3" size="28px" />
            )}
            <label>{ods}</label>
          </CheckboxContainer>
        ))}
      </FilterSection>
    </Container>
  );
};

export default FilterNav;
