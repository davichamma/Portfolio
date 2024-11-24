import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const StyledInput = styled.input`
  width: 100%;
  border-radius: 16px;
  border: 1px solid #ddd;
  padding: 10px 45px 10px;
  outline: none;
  height: 64px;
  background-color: #fff;
`;

const StyledButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
`;

const StyledIcon = styled.img`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  margin-left: 5px;
  padding-bottom: 2px;
`;

const ButtonIcon = styled.img`
  font-size: 1.2em;
  margin: 2px 4px 0 0;
`;

const InputWithIcon = ({
  search,
  setSearch,
  setRefresh,
  redirect,
  toggleNavbar,
  page,
  setCurrentIndex,
}) => {
  const handleChange = (word) => {
    setSearch(word);
    page === "servicescatalog" &&
      setCurrentIndex((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, 0]))
      );
  };

  return (
    <>
      {redirect ? (
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="/searchapp"
        >
          <InputWrapper>
            <StyledIcon src="/assets/search.svg" alt="Buscar" />
            <StyledInput
              type="text"
              placeholder="Pesquisar por..."
              value={search}
              $icon={0}
              onChange={(e) => handleChange(e.currentTarget.value)}
            />
            <StyledButton onClick={() => (redirect ? "" : setRefresh(true))}>
              <ButtonIcon src={"/assets/filter.svg"} alt="Filtrar" />
            </StyledButton>
          </InputWrapper>
        </Link>
      ) : (
        <InputWrapper>
          <StyledIcon src="/assets/search.svg" alt="Buscar" />
          <StyledInput
            type="text"
            placeholder="Pesquisar por..."
            value={search}
            $icon={0}
            onChange={(e) => handleChange(e.currentTarget.value)}
          />
          <StyledButton
            onClick={() =>
              page ? toggleNavbar() : setRefresh ? setRefresh(true) : ""
            }
          >
            <ButtonIcon src={"/assets/filter.svg"} alt="Filtrar" />
          </StyledButton>
        </InputWrapper>
      )}
    </>
  );
};

export default InputWithIcon;
