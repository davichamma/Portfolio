import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loading from "./Loading";
import {
  SstIcon,
  SocialResponsibility,
  Innovation,
  Education,
  Projects,
} from "../icons/icons";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { getAllBusinessLines } from "../resources/produtos";
import { validateToken } from "../utils/validateToken";

const Nav = styled.nav`
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
`;

const BusinessCard = styled.div`
  border-radius: 16px;
  width: 110px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.$active ? "6px 6px 10px rgba(0, 0, 0, 1)" : ""};
  transform: ${(props) => (props.$active ? "scale(1.1)" : "")};
`;

const IconImage = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border-radius: 16px;
  background-color: ${(props) =>
    props.$bgColor ? props.$bgColor : "white !important"};
  & svg {
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.p`
  color: rgba(32, 34, 68, 0.8);
  background-color: transparent;
  font-size: 9px;
  font-weight: 700;
  text-align: center;
  margin-top: 10px;
  padding-top: ${(props) => (props.$active ? "4px" : "")};
  text-transform: uppercase;
  transform: ${(props) => (props.$active ? "scale(1.2)" : "")};
`;

const BusinessLines = ({
  selectedBusinessLines,
  setSelectedBusinessLines,
  setBusinessLine,
  setSelectedCategory,
  page = "",
  favorites,
}) => {
  const token = Cookies.get("token");
  const localStorageFavs = localStorage.getItem("favoritos")
    ? JSON.parse(localStorage.getItem("favoritos"))
    : [];
  const localStorageBusinessLines = localStorage.getItem("linhasNegocio")
    ? JSON.parse(localStorage.getItem("linhasNegocio"))
    : [];
  const [businessLines, setBusinessLines] = useState(localStorageBusinessLines);
  const [loading, setLoading] = useState(false);
  const businessLineItems = localStorageBusinessLines;

  useEffect(() => {
    if (token && businessLines.length === 0) {
      setLoading(true);
      getAllBusinessLines(token)
        .then((response) => {
          setBusinessLines(response.data);
          if (page !== "home") {
            setBusinessLine(response.data);
          }
          localStorage.setItem("linhasNegocio", JSON.stringify(response.data));
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar linhasNegocio."
          );
          validateToken(error.response?.status);
        })
        .finally(() => setLoading(false));
    }
  }, [token, businessLines.length, setBusinessLine, page]);

  const getIcon = (linhaNegocio, bgColor) => {
    switch (linhaNegocio) {
      case "Saúde e Segurança no Trabalho":
        return (
          <SstIcon
            fill={page === "home" || page === "suggest" ? "white" : bgColor}
          />
        );
      case "Inovação":
        return (
          <Innovation
            fill={page === "home" || page === "suggest" ? "white" : bgColor}
          />
        );
      case "Educação Básica":
        return (
          <Education
            fill={page === "home" || page === "suggest" ? "white" : bgColor}
          />
        );
      case "Responsabilidade Social":
        return (
          <SocialResponsibility
            fill={page === "home" || page === "suggest" ? "white" : bgColor}
          />
        );
      case "Projetos SESI":
        return (
          <Projects
            fill={page === "home" || page === "suggest" ? "white" : bgColor}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (favorites) {
      setSelectedBusinessLines("Todos");
    }
  }, [favorites, setSelectedBusinessLines]);

  const filteredFavs = businessLineItems.filter((categoria) =>
    favorites
      ? localStorageFavs?.some(
          (fav) => fav.produto.linhaNegocio === categoria.linhaNegocio
        )
      : true
  );

  const handleClick = (label) => {
    setSelectedBusinessLines(selectedBusinessLines === label ? "Todos" : label);
    if (page !== "servicescatalog" && page !== "suggest") {
      setSelectedCategory("Todos");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Nav>
          {filteredFavs.map((businessLine) => (
            <BusinessCard
              key={businessLine.id}
              onClick={() => handleClick(businessLine.linhaNegocio)}
            >
              <ImageContainer
                $active={
                  selectedBusinessLines === businessLine.linhaNegocio ? 1 : 0
                }
              >
                <IconImage
                  alt={businessLine.linhaNegocio}
                  $bgColor={
                    page === "home" || page === "suggest"
                      ? businessLine.corFundo
                      : undefined
                  }
                >
                  {getIcon(businessLine.linhaNegocio, businessLine.corFundo)}
                </IconImage>
              </ImageContainer>
              <Label
                $active={
                  selectedBusinessLines === businessLine.linhaNegocio ? 1 : 0
                }
              >
                {businessLine.linhaNegocio}
              </Label>
            </BusinessCard>
          ))}
        </Nav>
      )}
    </>
  );
};

export default BusinessLines;
