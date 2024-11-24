import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import InputWithIcon from "../components/InputWithIcon";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import ServiceCards from "../components/ServiceCards";
import BusinessLines from "../components/BusinessLines";
import Footer from "../components/Footer";

const AppContainer = styled.div`
  flex: 1;
  padding: 0 80px;
`;

const GreetingHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin-top: 5rem;
`;

const GreetingText = styled.div`
  h1 {
    color: #202244;
    font-size: 24px;
    font-weight: 800;
  }
  p {
    font-size: 14px;
    font-weight: 700;
    color: rgba(84, 84, 84, 0.8);
  }
`;

const Section = styled.section`
  margin-top: ${({ $margin }) => $margin || "1rem"};
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
  color: rgba(32, 34, 68, 1);
  margin-bottom: ${({ $mb }) => $mb || ""};
`;

const SpanArrow = styled.div`
  display: flex;
  align-items: flex-end;
  color: rgba(22, 65, 148, 1);
  font-size: 12px;
  font-weight: 800;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;

    .span-ver {
      color: rgba(22, 65, 148, 1);
    }
  }
`;

const StyledImage = styled.img`
  margin-left: 0.5rem;
  margin-bottom: 0.25rem;
`;

const HomeApp = () => {
  const usuario = (() => {
    const { name = "" } = JSON.parse(sessionStorage.getItem("user") ?? "{}");
    return name.split(" ")[0] || "";
  })();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBusinessLines, setSelectedBusinessLines] = useState("Todos");
  const [search, setSearch] = useState("");
  const localStorageBusinessLines = localStorage.getItem("linhasNegocio")
    ? JSON.parse(localStorage.getItem("linhasNegocio"))
    : [];
  const localStorageCategories = localStorage.getItem("categorias")
    ? JSON.parse(localStorage.getItem("categorias"))
    : [];
  return (
    <AppContainer>
      <GreetingHeader>
        <GreetingText>
          <h1>Oi, {usuario}</h1>
          <p>O que você gostaria de vender hoje?</p>
        </GreetingText>
      </GreetingHeader>

      <InputWithIcon search={search} setSearch={setSearch} redirect={true} />

      <Section $margin="2rem">
        <SectionTitle $mb="1rem">Linhas de Negócio</SectionTitle>
        <Carousel>
          <BusinessLines
            selectedBusinessLines={selectedBusinessLines}
            setSelectedBusinessLines={setSelectedBusinessLines}
            setSelectedCategory={setSelectedCategory}
            page="home"
          />
        </Carousel>
      </Section>

      <Section>
        <SectionTitle>Categorias</SectionTitle>
        <Carousel>
          <Categories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            cards={{
              id:
                localStorageBusinessLines.find(
                  (negocio) => negocio.linhaNegocio === selectedBusinessLines
                )?.id ||
                localStorageCategories.find(
                  (negocio) => negocio.categoria === selectedBusinessLines
                )?.linhaNegocioId,
            }}
          />
        </Carousel>
        <SectionTitle>
          Últimas atualizações de serviços
          <SpanArrow>
            <Link to="/newservicesapp">
              <span className="span-ver">VER TUDO</span>
              <StyledImage src="/assets/rightArrow.svg" alt="Ver Mais" />
            </Link>
          </SpanArrow>
        </SectionTitle>
        <Carousel>
          <ServiceCards
            category={selectedCategory}
            businessLine={selectedBusinessLines}
            page="home"
          />
        </Carousel>
      </Section>

      <Footer activeTab={"home"} />
    </AppContainer>
  );
};

export default HomeApp;
