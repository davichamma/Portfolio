import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import ServiceCards from "../components/ServiceCards";
import InputWithIcon from "../components/InputWithIcon";
import BusinessLines from "../components/BusinessLines";
import Footer from "../components/Footer";
import FilterNav from "../components/FilterNav";

const Container = styled.div`
  flex: 1;
  margin-bottom: 100px;
  padding: 0 80px;
`;

const Header = styled.div`
  margin: 3rem 2rem 3rem 0;
  display: flex;
  align-items: center;
  padding-left: 5rem;
`;

const BackIcon = styled.img`
  width: 30px;
  cursor: pointer;
`;

const CategoryText = styled.span`
  margin-left: 0.5rem;
  font-size: 21px;
  font-weight: 700;
`;

const Title = styled.p`
  margin: 1.5rem 0 3.5rem 0;
  font-size: 30px;
  font-weight: 800;
  color: rgba(32, 34, 68, 1);
  text-align: center;
`;

const Banner = styled.div`
  position: relative;
  height: 220px;
  background-color: #53ae32;
`;

const BusinessCards = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 81vw;
  background-color: transparent;
  p {
    color: white;
    margin-top: 16px;
  }
  & * {
    background-color: transparent;
  }
`;

const InputCatalog = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 640px;
  border-radius: 16px;
`;

const CatalogResults = styled.div`
  display: flex;
  margin: 1rem 0 1rem 3rem;
  font-family: "Jost", sans-serif;
  font-weight: 600;
  font-size: 15px;

  span {
    color: #244d9b;
  }
`;

const CardsContainer = styled.div`
  display: ${(props) => (props.$filtered ? "none" : "")};
  margin-top: ${(props) => (props.$filtered ? "" : "1.5rem")};
`;

const CategorySection = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  color: rgba(32, 34, 68, 1);
  margin: 0 auto;
`;

const Details = styled.div`
  display: flex;
  align-items: flex-end;
  color: rgba(22, 65, 148, 1);
  font-size: 12px;
  font-weight: 800;

  & a {
    text-decoration: none;
  }

  & span {
    color: rgba(22, 65, 148, 1);
  }
`;

const CardsCarousel = styled.div`
  position: relative;
`;

const ArrowButton = styled.img`
  position: absolute;
  top: 60%;
  cursor: pointer;
  left: ${(props) => (props.$right ? "105%" : "")};
  right: ${(props) => (props.$right ? "" : "105%")};
`;

const ServicesCatalog = () => {
  const location = useLocation();
  const category = location.state?.category || "Todos";
  const searchText = location.state?.search || "";
  const favorites = location.state?.favorites || "";
  const [selectedBusinessLines, setSelectedBusinessLines] = useState("Todos");
  const [scrollDirections, setScrollDirections] = useState({});
  const [search, setSearch] = useState(searchText);
  const [currentIndex, setCurrentIndex] = useState({});
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    subsidio: [],
    categoria: [],
    cargaHoraria: [],
    ods: [],
  });
  const localStorageBusinessLines = localStorage.getItem("linhasNegocio")
    ? JSON.parse(localStorage.getItem("linhasNegocio"))
    : [];
  const [businessLines, setBusinessLines] = useState(localStorageBusinessLines);

  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const [selectedCategories, setSelectedCategories] = useState(
    businessLines.reduce(
      (acc, line) => ({ ...acc, [line.linhaNegocio]: category }),
      {}
    )
  );

  const [emptyCategories, setEmptyCategories] = useState(
    businessLines.reduce(
      (acc, line) => ({
        ...acc,
        [line.linhaNegocio]: 0,
      }),
      {}
    )
  );

  const handleEmptyCategory = (category, isEmpty) => {
    setEmptyCategories((prevState) => ({
      ...prevState,
      [category]: isEmpty,
    }));
  };

  const handleCategoryChange = (businessLine, newCategory) => {
    setSelectedCategories((prevCategories) => ({
      ...prevCategories,
      [businessLine]: newCategory,
    }));
  };

  const handleScroll = (direction, categoria) => {
    setScrollDirections((prevState) => ({
      ...prevState,
      [categoria]: direction,
    }));
  };

  const handleIndex = (index, categoria) => {
    setCurrentIndex((prevState) => ({
      ...prevState,
      [categoria]: index,
    }));
  };
  useEffect(() => {
    setCurrentIndex(
      businessLines.reduce(
        (acc, line) => ({ ...acc, [line.linhaNegocio]: 0 }),
        {}
      )
    );
  }, [favorites, businessLines]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarOpen(false);
      }
    };

    if (isNavbarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);

  return (
    <>
      <Header>
        <BackIcon
          src="/assets/leftArrow.svg"
          alt="Voltar"
          onClick={handleGoBack}
        />
        <CategoryText>Catálogo de Serviços</CategoryText>
      </Header>
      <Title>CATÁLOGO DE SERVIÇOS</Title>
      <Banner>
        <BusinessCards>
          <Carousel>
            <BusinessLines
              setBusinessLine={setBusinessLines}
              favorites={favorites}
              selectedBusinessLines={selectedBusinessLines}
              setSelectedBusinessLines={setSelectedBusinessLines}
              page="servicescatalog"
            />
          </Carousel>
        </BusinessCards>
        <InputCatalog>
          <InputWithIcon
            search={search}
            setSearch={setSearch}
            setCurrentIndex={setCurrentIndex}
            toggleNavbar={toggleNavbar}
            page="servicescatalog"
          />
        </InputCatalog>
      </Banner>

      {searchText && search === searchText ? (
        <CatalogResults>
          Resultado para "<span>{searchText}</span>"
        </CatalogResults>
      ) : null}

      <FilterNav
        navbarRef={navbarRef}
        isNavbarOpen={isNavbarOpen}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <Container>
        {businessLines.map((value, index) => {
          const filteredServicesForCategory =
            emptyCategories[value.linhaNegocio] || 0;
          if (
            selectedBusinessLines === value.linhaNegocio ||
            selectedBusinessLines === "Todos"
          ) {
            return (
              <CardsContainer
                key={index}
                $filtered={filteredServicesForCategory === 0 ? 1 : 0}
              >
                <CategorySection>
                  {value.linhaNegocio}
                  <Details>
                    <Link
                      to="/newservicesapp"
                      state={{
                        linhaNegocio: value.linhaNegocio,
                        id: value.id,
                        path: "servicescatalog",
                      }}
                    >
                      <span>VER MAIS</span>
                      <img
                        src="/assets/rightArrow.svg"
                        alt="Ver Mais"
                        className="ms-2 mb-1"
                      />
                    </Link>
                  </Details>
                </CategorySection>
                <CardsCarousel>
                  {emptyCategories[value.linhaNegocio] > 3 &&
                  currentIndex[value.linhaNegocio] > 0 ? (
                    <ArrowButton
                      src="/assets/arrowLeft.svg"
                      alt="Left Arrow"
                      onClick={() => handleScroll("left", value.linhaNegocio)}
                    />
                  ) : null}
                  <Carousel>
                    <Categories
                      selectedCategory={selectedCategories[value.linhaNegocio]}
                      setSelectedCategory={(newCategory) =>
                        handleCategoryChange(value.linhaNegocio, newCategory)
                      }
                      cards={{
                        id: value.id,
                        linhaNegocio: value.linhaNegocio,
                      }}
                      setCurrentIndex={handleIndex}
                      page="servicescatalog"
                      favorites={favorites}
                    />
                  </Carousel>
                  <Carousel>
                    <ServiceCards
                      category={selectedCategories[value.linhaNegocio]}
                      businessLine={value.linhaNegocio}
                      type={1}
                      search={search}
                      favorites={favorites}
                      page={"servicescatalog"}
                      onEmpty={handleEmptyCategory}
                      emptyCategories={emptyCategories}
                      scrollDirection={scrollDirections[value.linhaNegocio]}
                      handleScroll={handleScroll}
                      currentIndex={currentIndex}
                      handleIndex={handleIndex}
                      selectedFilters={selectedFilters}
                    />
                  </Carousel>
                  {emptyCategories[value.linhaNegocio] > 3 &&
                  emptyCategories[value.linhaNegocio] -
                    currentIndex[value.linhaNegocio] >
                    3 ? (
                    <ArrowButton
                      src="/assets/arrowRight.svg"
                      alt="Right Arrow"
                      $right={1}
                      onClick={() => handleScroll("right", value.linhaNegocio)}
                    />
                  ) : null}
                </CardsCarousel>
              </CardsContainer>
            );
          }
          return null;
        })}
      </Container>

      <Footer activeTab={favorites ? "fav" : "catalog"} />
    </>
  );
};

export default ServicesCatalog;
