import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HomeIcon,
  SaveIcon,
  CatalogIcon,
  CalculatorIcon,
  SuggestIcon,
} from "../icons/icons";

const FooterNavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const FooterNav = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  box-sizing: border-box;
  margin: 10px 0 0 0;
  padding: 20px;
`;

const FooterButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  text-align: center;
  font-weight: 800;

  & span {
    margin-top: 5px;
  }

  &.active {
    & span {
      color: rgba(83, 174, 50, 1);
    }
  }

  &:hover {
    color: rgba(83, 174, 50, 1);
  }
`;

function Footer({ activeTab }) {
  const navigate = useNavigate();

  return (
    <FooterNavWrapper>
      <FooterNav>
        <FooterButton
          className={activeTab === "home" ? "active" : ""}
          onClick={() => navigate("/homeapp")}
        >
          <HomeIcon
            fill={
              activeTab === "home"
                ? "rgba(83, 174, 50, 1)"
                : "rgba(32, 34, 68, 1)"
            }
          />
          <span>Início</span>
        </FooterButton>

        <FooterButton
          className={activeTab === "catalog" ? "active" : ""}
          onClick={() => navigate("/servicescatalog")}
        >
          <CatalogIcon
            fill={
              activeTab === "catalog"
                ? "rgba(83, 174, 50, 1)"
                : "rgba(32, 34, 68, 1)"
            }
          />
          <span>Catálogo</span>
        </FooterButton>

        <FooterButton
          className={activeTab === "fav" ? "active" : ""}
          onClick={() =>
            navigate("/servicescatalog", {
              state: { favorites: true },
            })
          }
        >
          <SaveIcon
            fill={
              activeTab === "fav"
                ? "rgba(83, 174, 50, 1)"
                : "rgba(32, 34, 68, 1)"
            }
          />
          <span>Salvos</span>
        </FooterButton>

        <FooterButton
          className={activeTab === "calculators" ? "active" : ""}
          onClick={() => navigate("/calculadoras")}
        >
          <CalculatorIcon
            fill={
              activeTab === "calculators"
                ? "rgba(83, 174, 50, 1)"
                : "rgba(32, 34, 68, 1)"
            }
          />
          <span>Calculadoras</span>
        </FooterButton>

        <FooterButton
          className={activeTab === "suggest" ? "active" : ""}
          onClick={() => navigate("/suggest")}
        >
          <SuggestIcon
            fill={
              activeTab === "suggest"
                ? "rgba(83, 174, 50, 1)"
                : "rgba(32, 34, 68, 1)"
            }
          />
          <span>Consultar</span>
        </FooterButton>
      </FooterNav>
    </FooterNavWrapper>
  );
}

export default Footer;
