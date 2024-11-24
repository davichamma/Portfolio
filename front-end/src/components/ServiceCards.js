import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { getAllProdutosPortfolio, getFavs } from "../resources/produtos";
import { isWithinDays } from "../utils/date";
import Modal from "./Modal";
import { FavIcon, NotFavIcon } from "../icons/icons";
import { validateToken } from "../utils/validateToken";

const Container = styled.div`
  height: ${({ $path, $page, $quantity }) =>
    $path === "Consultar"
      ? "30vh"
      : $page === "newservices"
      ? `${Math.min(($quantity > 1 ? $quantity : 2) * 10, 60)}vh`
      : $page === "servicescatalog"
      ? "20vh"
      : "40vh"};
  overflow: hidden;

  &.service-cards-carousel {
    margin-left: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-top: 1rem;
    &::-webkit-scrollbar {
      height: 10px;
    }
  }

  &.service-cards-carousel-vert {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    border-radius: 16px;
    padding: 10px;
    gap: 10px;
    padding-bottom: 100px;
  }

  &.service-catalog {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    border-radius: 16px;
  }
`;

const ServiceCard = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  &.service-card,
  &.service-card-vert,
  &.service-card-catalog {
    position: relative;
    min-width: 190px;
    height: ${(props) => (props.$page === "suggest" ? "240px" : "210px")};
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
    scroll-snap-align: start;
    background-color: white;
    border-radius: 10px;
    width: 190px;
    margin-top: 10px;
  }

  &.service-card-vert {
    margin-top: 0;
  }

  &.service-card-catalog {
    min-width: 190px;
  }

  &.service-card-vert {
    min-width: 190px;
  }
`;

const ServiceCardTitle = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  margin: 0 auto;
  background-color: white;
`;

const ServiceCardText = styled.p`
  display: flex;
  text-align: left;
  font-size: 10.55px;
  font-weight: 700;
  color: rgba(32, 34, 68, 1);
  margin: 0 auto;
  padding-top: 8px;
  background-color: white;
`;

const CardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 10px 10px 0 0;
  font-size: 12px;
  font-weight: 900;
  padding: 10px;
  color: white;
`;

const TextContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  padding: 10px;
  border-radius: 16px;
  background-color: white;
`;

const Carousel = styled.div`
  gap: 10px;
  border-radius: 10px;
`;

const ServiceCards = ({
  type = 0,
  page,
  category,
  businessLine,
  search = "",
  favorites = "",
  sugeridos = [],
  cliente = { compras: [] },
  path = "",
  onEmpty,
  emptyCategories,
  loading = false,
  scrollDirection,
  handleScroll,
  currentIndex,
  handleIndex,
  selectedFilters,
}) => {
  const usuario = JSON.parse(sessionStorage.getItem("user"))?.name || "";
  const token = Cookies.get("token");
  const visibleCardsCount = 3;
  const [services, setServices] = useState(() => {
    return page === "suggest"
      ? []
      : JSON.parse(localStorage.getItem("produtosPortfolio")) || [];
  });
  const [favoritos, setFavoritos] = useState(() => {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  });
  const serviceCardsRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(loading);
  const navigate = useNavigate();
  const getColor = (business) => {
    const colors = {
      "Saúde e Segurança no Trabalho": "sst",
      Inovação: "innovation",
      "Responsabilidade Social": "responsibility",
      "Projetos SESI": "projects",
      "Educação Básica": "education",
    };
    return colors[business];
  };

  useEffect(() => {
    if (page === "suggest" && sugeridos.length) {
      setServices(sugeridos);
    } else if (page === "suggest") {
      setServices([]);
    }
  }, [page, sugeridos]);

  useEffect(() => {
    if (
      token &&
      usuario &&
      services.length === 0 &&
      page !== "suggest" &&
      path !== "Consultar"
    ) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const portfolioResponse = await getAllProdutosPortfolio(token);
          const portfolioData = portfolioResponse.data;

          const favResponse = await getFavs(usuario, token);
          const favData = favResponse.data;

          if (portfolioData !== services) {
            localStorage.setItem(
              "produtosPortfolio",
              JSON.stringify(portfolioData)
            );
            setServices(portfolioData);
          }

          if (favData !== favoritos) {
            localStorage.setItem("favoritos", JSON.stringify(favData));
            setFavoritos(favData);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch data");
          validateToken(error.response?.status);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [
    token,
    usuario,
    path,
    page,
    services.length,
    sugeridos.length,
    favoritos,
    services,
  ]);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const handleFavoritoToggle = (produtoId, categoria, linhaNegocio) => {
    const exists = favoritos.some((fav) => fav.produtoId === produtoId);
    setFavoritos((prevFavoritos) => {
      if (exists) {
        return prevFavoritos.filter((fav) => fav.produtoId !== produtoId);
      } else {
        return [
          ...prevFavoritos,
          { produtoId, produto: { categoria, linhaNegocio } },
        ];
      }
    });
    toast.success(
      `Favorito ${exists ? "removido" : "adicionado"} com sucesso.`
    );
  };

  const filterSubsidio = selectedFilters?.subsidio
    ? services.filter((value) => {
        const subsidio = selectedFilters.subsidio;

        if (!subsidio.length || subsidio.length >= 2) {
          return true;
        }

        return subsidio.includes(1) ? value.subsidio : !value.subsidio;
      })
    : services;

  const filterModalidade = selectedFilters?.categoria
    ? filterSubsidio.filter((value) => {
        const categoria = selectedFilters.categoria;
        if (!categoria.length || categoria.length >= 3) {
          return true;
        }

        const modalidadeArray = value.modalidade
          ?.split(" - ")
          .map((item) => item.trim());

        return (
          (categoria.includes(1) && modalidadeArray?.includes("Presencial")) ||
          (categoria.includes(2) &&
            modalidadeArray?.includes("Semipresencial")) ||
          (categoria.includes(3) && modalidadeArray?.includes("EAD"))
        );
      })
    : filterSubsidio;

  const filterHorario = selectedFilters?.cargaHoraria
    ? filterModalidade.filter((value) => {
        const cargaHoraria = selectedFilters.cargaHoraria;
        if (!cargaHoraria.length || cargaHoraria.length >= 4) {
          return true;
        }

        return (
          (value.horas &&
            cargaHoraria.includes(1) &&
            value.horas >= 0 &&
            value.horas <= 2) ||
          (cargaHoraria.includes(2) && value.horas >= 3 && value.horas <= 6) ||
          (cargaHoraria.includes(3) && value.horas >= 7 && value.horas <= 16) ||
          (cargaHoraria.includes(4) && value.horas >= 17)
        );
      })
    : filterModalidade;

  const filterOds = selectedFilters?.ods
    ? filterHorario.filter((value) => {
        const ods = selectedFilters.ods;
        if (!ods.length || ods.length >= 18) {
          return true;
        }
        return value.ods.some((item) => ods.includes(item.ods));
      })
    : filterHorario;

  const filteredFav = favorites
    ? filterOds.filter((value) =>
        favoritos.some((fav) => fav.produtoId === value.id)
      )
    : filterOds;

  const filteredCategories =
    category !== "Todos"
      ? filteredFav.filter(
          (value) =>
            value.categoria === category || value.linhaNegocio === category
        )
      : filteredFav;

  const filteredText = search.trim().toLowerCase()
    ? filteredCategories.filter(({ linhaNegocio, produto, categoria }) =>
        [linhaNegocio, produto, categoria].some((text) =>
          text.toLowerCase().includes(search.toLowerCase())
        )
      )
    : filteredCategories;

  const filteredBusinessLines = filteredText.filter(
    (value) => value.linhaNegocio === businessLine || businessLine === "Todos"
  );

  const filteredServices =
    page === "home" || (page === "newservices" && path === "")
      ? filteredBusinessLines.filter((value) => {
          return isWithinDays(value.updatedAt);
        })
      : filteredBusinessLines;

  const scrollLeft = useCallback(() => {
    const newIndex = Math.max((currentIndex[businessLine] || 0) - 1, 0);
    handleIndex(newIndex, businessLine);
    handleScroll("", businessLine);
  }, [businessLine, handleScroll, currentIndex, handleIndex]);

  const scrollRight = useCallback(() => {
    const maxIndex = filteredServices.length - visibleCardsCount;
    const newIndex = Math.min((currentIndex[businessLine] || 0) + 1, maxIndex);
    handleIndex(newIndex, businessLine);
    handleScroll("", businessLine);
  }, [
    businessLine,
    handleScroll,
    handleIndex,
    currentIndex,
    filteredServices.length,
    visibleCardsCount,
  ]);

  useEffect(() => {
    if (scrollDirection === "left") {
      scrollLeft();
    } else if (scrollDirection === "right") {
      scrollRight();
    }
  }, [scrollDirection, scrollLeft, scrollRight]);

  useEffect(() => {
    const filteredCount = filteredServices.length;
    if (
      (search !== "" || selectedFilters) &&
      filteredCount !== emptyCategories[businessLine]
    ) {
      onEmpty(businessLine, filteredCount);
    }
  }, [
    search,
    filteredServices,
    businessLine,
    onEmpty,
    emptyCategories,
    sugeridos,
    selectedFilters,
  ]);

  const oddServices = filteredServices.filter((_, index) => index % 2 !== 0);
  const evenServices = filteredServices.filter((_, index) => index % 2 === 0);

  const verifyClass = () => {
    return page === "servicescatalog"
      ? "service-catalog"
      : `service-cards-carousel${type === 1 ? "-vert" : ""}`;
  };

  const verifyCard = () => {
    return page === "servicescatalog"
      ? "service-card-catalog"
      : `service-card${type === 1 ? "-vert" : ""}`;
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const handleModal = (id) => {
    setProduct(cliente.compras.find((compra) => compra.produtoId === id));
    toggleModal();
  };

  const renderServiceCard = (service, index) => (
    <ServiceCard
      className={verifyCard()}
      ref={serviceCardsRef}
      key={index}
      $page={page}
    >
      <CardBackground
        onClick={() =>
          navigate("/productapp", {
            state: { product: service },
          })
        }
      >
        {service.categoria}
      </CardBackground>
      <TextContent className={service.color}>
        <ServiceCardTitle>
          {cliente?.compras?.some(
            (compra) => compra.produtoId === service.id
          ) ? (
            <span
              className="bg-white me-2"
              onClick={() => handleModal(service.id)}
              style={{ fontSize: "15px" }}
            >
              ⭐
            </span>
          ) : null}
          <span className={`bg-white ${getColor(service.linhaNegocio)}`}>
            {service.linhaNegocio}
          </span>
          {favoritos.some((fav) => fav.produtoId === service.id) ? (
            <FavIcon
              onClick={() =>
                handleFavoritoToggle(
                  service.id,
                  service.categoria,
                  service.linhaNegocio
                )
              }
            />
          ) : (
            <NotFavIcon
              onClick={() =>
                handleFavoritoToggle(
                  service.id,
                  service.categoria,
                  service.linhaNegocio
                )
              }
            />
          )}
        </ServiceCardTitle>
        <ServiceCardText>{service.produto}</ServiceCardText>
      </TextContent>
    </ServiceCard>
  );

  const getCarouselType = () => {
    if (page === "servicescatalog") {
      return filteredServices.slice(
        currentIndex[businessLine] || 0,
        (currentIndex[businessLine] || 0) + visibleCardsCount
      );
    }

    return filteredServices;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container
          className={verifyClass()}
          ref={serviceCardsRef}
          $path={path}
          $page={page}
          $quantity={filteredServices.length}
        >
          {modalOpen ? (
            <Modal produto={product} toggleModal={toggleModal} />
          ) : null}
          {page === "newservices" ||
          page === "suggest" ||
          page === "servicescatalog" ? (
            getCarouselType().map(renderServiceCard)
          ) : (
            <>
              <Carousel className="d-flex cards-carousel">
                {evenServices.map(renderServiceCard)}
              </Carousel>
              <Carousel className="d-flex cards-carousel">
                {oddServices.map(renderServiceCard)}
              </Carousel>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default ServiceCards;
