import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllCategories } from "../resources/produtos";
import Cookies from "js-cookie";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { validateToken } from "../utils/validateToken";

const Nav = styled.nav`
  display: flex;
  overflow-x: auto;
  padding: 12px 0;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &.active {
    color: #0077cc;
    font-weight: bold;
  }
`;

const CategoryButton = styled.button`
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  margin: 5px;
  padding: 0 16px;
  height: 30px;
  box-shadow: ${(props) =>
    props.$active ? "4px 4px 10px rgba(0, 0, 0, 1)" : ""};
  color: ${(props) => props.$color};
  background-color: ${(props) => props.$bgColor};
`;

const Categories = ({
  selectedCategory,
  setSelectedCategory,
  page,
  cards,
  setCurrentIndex,
  favorites,
}) => {
  const token = Cookies.get("token");
  const localStorageFavs = localStorage.getItem("favoritos")
    ? JSON.parse(localStorage.getItem("favoritos"))
    : [];
  const localStorageBL = localStorage.getItem("categorias")
    ? JSON.parse(localStorage.getItem("categorias"))
    : [];
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState(localStorageBL);

  useEffect(() => {
    if (token && categorias.length === 0) {
      setLoading(true);
      getAllCategories(token)
        .then((response) => {
          setCategorias(response.data);
          localStorage.setItem("categorias", JSON.stringify(response.data));
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar categorias."
          );
          validateToken(error.response?.status);
        })
        .finally(() => setLoading(false));
    }
  }, [token, categorias.length]);

  useEffect(() => {
    if (page !== "newservices") setSelectedCategory("Todos");
    // eslint-disable-next-line
  }, [favorites, page]);

  const filteredFavs = favorites
    ? categorias.filter((categoria) =>
        localStorageFavs?.some(
          (fav) => fav.produto.categoria === categoria.categoria
        )
      )
    : categorias;

  const filteredNew = filteredFavs.filter((categoria) =>
    page === "newservices" ? categoria.text !== "Novos" : true
  );

  const filteredCategories = cards?.id
    ? filteredNew.filter((categoria) => categoria.linhaNegocioId === cards.id)
    : selectedCategory === "Todos" && page === "newservices"
    ? filteredFavs
    : filteredNew;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Nav>
          {filteredCategories.map((value) => (
            <CategoryButton
              key={value.id}
              $active={selectedCategory === value.categoria ? 1 : undefined}
              $bgColor={value.corFundo}
              $color={value.corFonte}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === value.categoria
                    ? "Todos"
                    : value.categoria
                );
                if (page === "servicescatalog") {
                  setCurrentIndex(0, cards.linhaNegocio);
                }
              }}
            >
              {value.categoria}
            </CategoryButton>
          ))}
        </Nav>
      )}
    </>
  );
};

export default Categories;
