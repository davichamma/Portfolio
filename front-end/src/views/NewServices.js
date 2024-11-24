import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import ServiceCards from "../components/ServiceCards";
import Footer from "../components/Footer";
import BusinessLines from "../components/BusinessLines";

const AppContainer = styled.div`
  flex: 1;
  padding: 0 80px;
`;

const HeaderContainer = styled.div`
  margin-top: 3rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 20px;
`;

const CategoryText = styled.span`
  margin-left: 0.5rem;
  color: rgba(32, 34, 68, 1);
  font-size: 21px;
  font-weight: 800;
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
  color: rgba(32, 34, 68, 1);
`;

const NewServicesApp = () => {
  const location = useLocation();
  const linhaNegocio = location?.state?.linhaNegocio;
  const id = location?.state?.id;
  const path = location?.state?.path;
  const localStorageBusinessLines = localStorage.getItem("linhasNegocio")
    ? JSON.parse(localStorage.getItem("linhasNegocio"))
    : [];
  const localStorageCategories = localStorage.getItem("categorias")
    ? JSON.parse(localStorage.getItem("categorias"))
    : [];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBusinessLines, setSelectedBusinessLines] = useState(
    linhaNegocio ? linhaNegocio : "Todos"
  );
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <AppContainer>
      <HeaderContainer onClick={handleGoBack}>
        <BackIcon src="/assets/leftArrow.svg" alt="Voltar" />
        <CategoryText>
          {selectedBusinessLines === "Todos" && linhaNegocio === undefined
            ? "Últimas atualizações de serviços"
            : `${selectedBusinessLines} / ${selectedCategory}`}
        </CategoryText>
      </HeaderContainer>

      <div className="mt-5">
        <Carousel>
          <SectionTitle>Linha de Negócio</SectionTitle>
          <BusinessLines
            selectedBusinessLines={selectedBusinessLines}
            setSelectedBusinessLines={setSelectedBusinessLines}
            setSelectedCategory={setSelectedCategory}
            page="home"
          />
        </Carousel>
        <Carousel>
          <SectionTitle>Categoria</SectionTitle>
          <Categories
            cards={{
              id:
                localStorageBusinessLines.find(
                  (negocio) => negocio.linhaNegocio === selectedBusinessLines
                )?.id ||
                localStorageCategories.find(
                  (negocio) => negocio.categoria === selectedBusinessLines
                )?.linhaNegocioId ||
                id,
            }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            page="newservices"
          />
        </Carousel>
        <Carousel>
          <ServiceCards
            category={selectedCategory}
            type={1}
            page="newservices"
            path={path}
            businessLine={selectedBusinessLines}
          />
        </Carousel>
      </div>

      <Footer activeTab={"catalog"} />
    </AppContainer>
  );
};

export default NewServicesApp;
