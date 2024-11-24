import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllSearches, removeSearch, addSearch } from "../resources/user";
import InputWithIcon from "../components/InputWithIcon";
import { validateToken } from "../utils/validateToken";

const Container = styled.div`
  flex: 1;
  padding: 0 80px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin: 4rem 0 3rem 0;
`;

const BackIcon = styled.img`
  width: 20px;
  cursor: pointer;
`;

const CategoryText = styled.span`
  margin-left: 0.5rem;
  font-weight: 700;
  font-size: 21px;
`;

const Section = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.span`
  font-weight: 700;
  font-size: 18px;
`;

const SearchItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const SearchText = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: rgba(160, 164, 171, 1);
  width: 90%;
  cursor: pointer;
`;

const RemoveButton = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: rgba(71, 45, 45, 1);
  width: 10%;
  cursor: pointer;
  padding: 0 1rem;
`;

const SearchApp = () => {
  const usuario = JSON.parse(sessionStorage.getItem("user"))?.name || "";
  const token = Cookies.get("token");
  const localStorageSearches = localStorage.getItem("searches")
    ? JSON.parse(localStorage.getItem("searches"))
    : [];
  const [lastSearches, setLastSearches] = useState(localStorageSearches);
  const [removeSearches, setRemoveSearches] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (search) => navigate("/servicescatalog", { state: { search } }),
    [navigate]
  );

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        if (refresh && search) {
          await addSearch({ search, usuario }, token);
        }

        const response = await getAllSearches(token, usuario);
        setLastSearches(response.data);
        localStorage.setItem("searches", JSON.stringify(response.data));

        if (refresh) {
          setRefresh(false);
          handleSearch(search);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          (refresh && search
            ? "Erro ao buscar."
            : "Erro ao carregar últimas buscas.");
        toast.error(errorMessage);
        validateToken(error.response?.status);
        handleSearch(search);
        setRefresh(false);
      }
    };

    if (
      (token && lastSearches.length === 0 && usuario) ||
      (refresh && search)
    ) {
      fetchSearches();
    }
  }, [token, usuario, lastSearches.length, refresh, search, handleSearch]);

  useEffect(() => {
    if (token && removeSearches.length) {
      const delayDebounceFn = setTimeout(() => {
        removeSearch(removeSearches, token)
          .then((response) => {
            localStorage.setItem("searches", JSON.stringify(lastSearches));
          })
          .catch((error) => {
            toast.error(error.response?.data?.message);
            validateToken(error.response?.status);
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [token, removeSearches, lastSearches]);

  const handleClick = (id) => {
    setRemoveSearches((prev) => [...prev, id]);
    setLastSearches(lastSearches.filter((value) => value.id !== id));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <BackIcon
          src="/assets/leftArrow.svg"
          alt="Voltar"
          onClick={handleGoBack}
        />
        <CategoryText>Pesquisar</CategoryText>
      </Header>
      <InputWithIcon
        search={search}
        setSearch={setSearch}
        setRefresh={setRefresh}
      />
      <Section>
        <SectionTitle>Pesquisas recentes</SectionTitle>
        {lastSearches.map((value) => (
          <SearchItem key={value.id}>
            <SearchText onClick={() => handleSearch(value.search)}>
              {value.search}
            </SearchText>
            <RemoveButton onClick={() => handleClick(value.id)}>X</RemoveButton>
          </SearchItem>
        ))}
      </Section>
    </Container>
  );
};

export default SearchApp;
