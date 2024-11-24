import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loading from "../components/Loading";
import Cookies from "js-cookie";
import Carousel from "../components/Carousel";
import ServiceCards from "../components/ServiceCards";
import BusinessLines from "../components/BusinessLines";
import Select from "react-select";
import { toast } from "react-toastify";
import { formatCnpj } from "../utils/masks";
import Footer from "../components/Footer";
import { getEmpresas } from "../resources/empresas";
import { getEmpresasEconodata } from "../resources/empresasEconodata";
import { getProdutos, getClientes } from "../resources/produtos";
import { validateToken } from "../utils/validateToken";

const Container = styled.div`
  flex: 1;
  padding: 0 80px;
`;

const HeaderContainer = styled.div`
  margin: 3rem 2rem 3rem 0;
  display: flex;
  align-items: center;
`;

const Title = styled.p`
  margin: 4.5rem 0 1.7rem 0;
  font-size: 30px;
  font-weight: 800;
  color: rgba(32, 34, 68, 1);
  text-align: center;
`;

const BackButton = styled.img`
  width: 30px;
  cursor: pointer;
`;

const ReturnText = styled.span`
  font-size: 21px;
  font-weight: 700;
  color: #333;
  margin-left: 0.5rem;
`;

const SelectContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  & * {
    background-color: transparent;
  }
`;

const SelectIcon = styled.img`
  position: absolute;
  top: 20px;
  left: 15px;
  width: 20px;
  cursor: pointer;
`;

const FilterIcon = styled.img`
  position: absolute;
  top: 13px;
  right: 20px;
  width: 38px;
  cursor: pointer;
`;

const InfoText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #545454cc;
`;

const SuggestFields = styled.div`
  border-radius: 16px;
  margin: 20px 0;
  border: 0.5px solid rgba(180, 189, 196, 1);
  & * {
    background-color: rgba(232, 232, 232, 1);
  }
`;

const SuggestContainer = styled.div`
  display: flex;
  padding: 0.7rem;
  border-radius: ${(props) => (props.$up ? "16px 16px 0 0" : "0 0 16px 16px")};
`;

const SuggestOptions = styled.div`
  display: flex;
  align-items: center;
  width: ${(props) => (props.$75 ? "75%" : "25%")};
  flex: 0 0 auto;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 700;
  color: rgba(87, 87, 86, 1);
  width: 35px;
  margin-left: ${(props) => (props.$ms ? ".5rem" : "")};
`;

const Input = styled.input`
  font-size: 12px;
  font-weight: 600;
  color: rgba(180, 189, 196, 1);
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  margin-left: 1.25rem;
  background-color: #f5f9ff;
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
  color: rgba(32, 34, 68, 1);
  margin-bottom: ${({ $mb }) => $mb || ""};
`;

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    padding: "10px 70px 10px 10px",
    border: "1px solid #ddd",
    height: "64px",
    outline: "none",
    fontSize: "16px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: "35px",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "16px",
    color: "rgba(180, 189, 196, 1)",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: "none",
  }),
};

const Suggest = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const [clientes, setClientes] = useState(
    () => JSON.parse(localStorage.getItem("clientes")) || []
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [cnpjs, setCNPJS] = useState([]);
  const [cnpj, setCNPJ] = useState("");
  const [selectedCNPJ, setSelectedCNPJ] = useState("");
  const [detalhes, setDetalhes] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [comprasCliente, setComprasCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusinessLines, setSelectedBusinessLines] = useState("Todos");

  const handleGoBack = () => {
    navigate(-1);
  };

  const updateClientesArray = useCallback(
    (clientes, cnpj, produtos, detalhes, compras) => {
      const existingIndex = clientes.findIndex(
        (cliente) => cliente.cnpj === cnpj
      );
      const newClient = { cnpj, produtos, detalhes, compras };

      if (existingIndex > -1) {
        return clientes.map((cliente, index) =>
          index === existingIndex ? newClient : cliente
        );
      }
      return [...clientes, newClient];
    },
    []
  );

  useEffect(() => {
    if (token && cnpj) {
      setIsLoading(true);
      setComprasCliente();
      const delayDebounceFn = setTimeout(() => {
        getEmpresas(encodeURIComponent(cnpj), token)
          .then((response) => {
            setData(response.data);
            setCNPJS(
              response.data?.map((empresa) => ({
                value: empresa.cnpj,
                label: formatCnpj(empresa.cnpj),
              }))
            );
          })
          .catch((error) => {
            setCNPJS([]);
            toast.error(error.response?.data?.message);
            validateToken(error.response?.status);
          })
          .finally(() => setIsLoading(false));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [token, cnpj, navigate]);

  useEffect(() => {
    if (token && selectedCNPJ) {
      setIsLoading(true);
      const empresa = clientes.find((value) => value.cnpj === selectedCNPJ);
      if (empresa) {
        setDetalhes(empresa.detalhes);
        setProdutos(empresa.produtos);
        setComprasCliente(empresa.compras);
        setIsLoading(false);
      } else {
        getEmpresasEconodata(encodeURIComponent(selectedCNPJ), token)
          .then((response) => setDetalhes(response.data[0]))
          .catch((error) => {
            toast.error(error.response?.data?.message);
            validateToken(error.response?.status);
          })
          .finally(() => {
            getClientes(encodeURIComponent(selectedCNPJ), token)
              .then((response) => setComprasCliente(response?.data?.results))
              .catch((error) => {
                toast.error(error.response?.data?.message);
                validateToken(error.response?.status);
              })
              .finally(() => setIsLoading(false));
          });
      }
    }
  }, [token, selectedCNPJ, clientes]);

  useEffect(() => {
    if (token && detalhes?.porte && selectedCNPJ && comprasCliente) {
      if (!clientes.find((value) => value.cnpj === selectedCNPJ)) {
        setLoading(true);
        getProdutos(detalhes.codigo, detalhes.porte, token)
          .then(({ data: { results: products } }) => {
            setProdutos(products);
            setClientes((prevClientes) => {
              const updatedClientes = updateClientesArray(
                prevClientes,
                selectedCNPJ,
                products,
                detalhes,
                comprasCliente
              );
              localStorage.setItem("clientes", JSON.stringify(updatedClientes));
              return updatedClientes;
            });
            setLoading(false);
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Failed to fetch products"
            );
            validateToken(error.response?.status);
          });
      }
    }
  }, [
    token,
    detalhes,
    selectedCNPJ,
    comprasCliente,
    updateClientesArray,
    clientes,
  ]);

  return (
    <Container>
      <HeaderContainer>
        <BackButton
          src="/assets/leftArrow.svg"
          alt="Voltar"
          onClick={handleGoBack}
        />
        <ReturnText>Consultar CNPJ</ReturnText>
      </HeaderContainer>
      <Title>PRODUTOS SUGERIDOS</Title>
      <SelectContainer>
        <Select
          placeholder="00.000.000/000-00"
          isLoading={isLoading}
          isClearable
          isSearchable
          name="cnpj"
          inputValue={cnpj}
          options={
            cnpjs.length > 0
              ? cnpjs
              : clientes.map((empresa) => ({
                  value: empresa.cnpj,
                  label: formatCnpj(empresa.cnpj),
                }))
          }
          onInputChange={(e) => setCNPJ(formatCnpj(e))}
          onChange={(selectedOption) =>
            setSelectedCNPJ(selectedOption?.value || "")
          }
          styles={customSelectStyles}
        />
        <SelectIcon src="/assets/search.svg" alt="Pesquisar" />
        <FilterIcon src="/assets/filter.svg" alt="Pesquisar" />
      </SelectContainer>

      <InfoText>
        Abaixo estão os serviços recorrentes para o CNPJ consultado com base nos
        dados fornecidos.
      </InfoText>

      <SuggestFields>
        <SuggestContainer $up={1}>
          <Label className="d-flex col-1 align-items-center">Nome:</Label>
          <Input
            type="text"
            defaultValue={
              data?.find((empresa) => empresa.cnpj === selectedCNPJ)?.nome ||
              detalhes?.nome
            }
            disabled
          />
        </SuggestContainer>

        <SuggestContainer>
          <SuggestOptions>
            <Label>Porte:</Label>
            <Input type="text" defaultValue={detalhes?.porte || ""} disabled />
          </SuggestOptions>
          <SuggestOptions $75={1}>
            <Label $ms={1}>CNAE:</Label>
            <Input
              type="text"
              defaultValue={detalhes?.texto?.toUpperCase() || ""}
              disabled
            />
          </SuggestOptions>
        </SuggestContainer>
      </SuggestFields>

      {loading ? (
        <Loading />
      ) : (
        <>
          <Carousel>
            <SectionTitle $mb="1rem">Linhas de Negócio</SectionTitle>
            <BusinessLines
              selectedBusinessLines={selectedBusinessLines}
              setSelectedBusinessLines={setSelectedBusinessLines}
              page="suggest"
            />
          </Carousel>

          <div>
            <Carousel>
              <ServiceCards
                category={"Todos"}
                businessLine={selectedBusinessLines}
                type={1}
                favorites={""}
                sugeridos={produtos}
                page="suggest"
                isLoading={loading}
                cliente={clientes.find(
                  (cliente) => cliente.cnpj === selectedCNPJ
                )}
              />
            </Carousel>
          </div>
        </>
      )}

      <Footer activeTab={"suggest"} />
    </Container>
  );
};

export default Suggest;
