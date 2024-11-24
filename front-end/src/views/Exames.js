import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { getAllExames } from "../resources/calculadora";
import { toast } from "react-toastify";
import { maskCurrency } from "../utils/masks";
import { ExpandedIcon } from "../icons/icons";
import { validateToken } from "../utils/validateToken";

const TotalRow = styled.tr`
  background-color: rgba(83, 174, 50, 1) !important;
  font-weight: 700;
  font-size: 14px;

  & * {
    padding: 1rem !important;
    color: white !important;
    background-color: rgba(83, 174, 50, 1) !important;
  }
`;

const ValuesContainer = styled.div`
  background-color: white;
  padding: 1rem;
  & * {
    background-color: rgba(246, 246, 246, 1);
  }
`;

const ValuesRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  border-radius: 16px;
  padding: 0.5rem 1.5rem;
`;

const ValuesText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(87, 87, 86, 1);
`;

const ValuesAmount = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: rgba(32, 34, 68, 1);
  margin: 0 auto;
`;

const TableTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(22, 65, 148, 1);
  border: 1px solid rgba(91, 109, 169, 1);
  color: white;
  padding: 1rem;
  font-weight: 700;
  font-size: 14px;
  & svg {
    background-color: rgba(22, 65, 148, 1);
    transform: ${(props) =>
      props.$active ? "rotate(180deg)" : "rotate(0deg)"};
    transition: transform 0.3s ease-in-out;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  & * {
    background-color: white;
  }
`;

const Exames = ({ search }) => {
  const token = Cookies.get("token");
  const localStoragePrecos = localStorage.getItem("exames")
    ? JSON.parse(localStorage.getItem("exames"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("all");
  const [selectedCity, setSelectedCity] = useState("campoGrande");
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [quantities, setQuantities] = useState({});
  const [openSections, setOpenSections] = useState({
    exames: true,
  });

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllExames(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("exames", JSON.stringify(response.data.results));
          toast.success(`Exames carregados com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar exames."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (localStorageCart?.exames?.length) {
      const newQuantities = {};
      localStorageCart.exames.forEach((item) => {
        if (item.markup) {
          newQuantities[`${item.name}-${item.city}`] = item.markup;
        }
        if (item.quantity) {
          newQuantities[`qtd-${item.name}-${item.city}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart.length]);

  const filteredExames = precos.filter((value) => {
    const matchesType = selected === "all" || value.tipo === selected;
    const matchesServico = value.servico
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesServico;
  });

  const total = filteredExames.reduce((sum, value) => {
    if (quantities[`${value.servico}-${selectedCity}`]) {
      return sum + (value[selectedCity] || 0);
    }
    return sum;
  }, 0);

  const totalM = filteredExames.reduce((sum, value) => {
    if (quantities[`${value.servico}-${selectedCity}`]) {
      const margem =
        (100 - (quantities[`${value.servico}-${selectedCity}`] || 0)) / 100;
      return sum + (value[selectedCity] || 0) / margem;
    }
    return sum;
  }, 0);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, exames: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (value, markup, category) => {
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartExames = cart.exames || [];
    const cityValue = value[selectedCity];
    const total = calculateTotal(cityValue, markup);

    const existingItem = cartExames.find(
      (item) => item.name === value.servico && item.city === selectedCity
    );

    if (existingItem) {
      if (markup === "") {
        cartExames = cartExames.filter(
          (item) => !(item.name === value.servico && item.city === selectedCity)
        );
      } else {
        if (category === "qtd-") {
          existingItem.quantity = markup;
        } else {
          existingItem.markup = markup;
          existingItem.total = total;
        }
      }
    } else {
      cartExames.push({
        name: value.servico,
        description: value.descricao,
        quantity: markup,
        city: selectedCity,
        value: cityValue,
        total: total,
      });
    }

    setCart(cartExames);

    setQuantities((prev) => ({
      ...prev,
      [`${category}${value.servico}-${selectedCity}`]: markup,
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotalRow = (value) => {
    const margem =
      (100 - (quantities[`${value.servico}-${selectedCity}`] || 0)) / 100;
    return (value[selectedCity] || 0) / margem;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <>
          <div className="" style={{ paddingBottom: "160px" }}>
            <ValuesContainer>
              <ValuesRow $row={0}>
                <div>
                  <ValuesText>Custos Diretos: </ValuesText>
                  <ValuesAmount>{maskCurrency(total)}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Valor Venda: </ValuesText>
                  <ValuesAmount>{maskCurrency(totalM)}</ValuesAmount>
                </div>
              </ValuesRow>
            </ValuesContainer>
            <FilterContainer>
              <div className="d-flex mt-2 py-3 align-items-center">
                <div
                  className="mx-2 bg-white"
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "rgba(80, 80, 80, 1)",
                  }}
                >
                  Categoria:
                </div>
                <select
                  className="form-select"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  <option value="all">Todos</option>
                  <option value="ce">Exames/Consultas</option>
                  <option value="el">Exames Laboratoriais</option>
                  <option value="ei">Exames de Imagem</option>
                </select>
                <div
                  className="mx-2 bg-white"
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "rgba(80, 80, 80, 1)",
                  }}
                >
                  Município:
                </div>
                <select
                  className="form-select ms-2"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um município
                  </option>
                  <option value="apDoTaboado">Aparecida do Taboado</option>
                  <option value="aquidauana">Aquidauana</option>
                  <option value="campoGrande">Campo Grande</option>
                  <option value="chapadaoDoSul">Chapadão do Sul</option>
                  <option value="corumba">Corumbá</option>
                  <option value="coxim">Coxim</option>
                  <option value="dourados">Dourados</option>
                  <option value="maracaju">Maracaju</option>
                  <option value="navirai">Naviraí</option>
                  <option value="novaAndradina">Nova Andradina</option>
                  <option value="paranaiba">Paranaíba</option>
                  <option value="pontaPora">Ponta Porã</option>
                  <option value="ribasDoRioPardo">Ribas do Rio Pardo</option>
                  <option value="rioVerde">Rio Verde</option>
                  <option value="sidrolandia">Sidrolândia</option>
                  <option value="sonora">Sonora</option>
                  <option value="tresLagoas">Três Lagoas</option>
                </select>
              </div>
            </FilterContainer>
            <TableTitle
              onClick={() => toggleSection("exames")}
              $active={openSections?.exames}
            >
              CONSULTAS E EXAMES <ExpandedIcon size="24px" />
            </TableTitle>

            <table className="table table-striped table-hover">
              {openSections?.exames ? (
                <thead className="sticky-top bg-white">
                  <tr>
                    <th>Exame</th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Quantidade
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Valor
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Margem
                    </th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {openSections?.exames
                  ? filteredExames.map((value, index) => (
                      <tr key={index}>
                        <td>{value.servico}</td>
                        <td className="text-center">
                          <input
                            min={0}
                            step={1}
                            placeholder={0}
                            disabled={value[selectedCity] === null}
                            type="number"
                            className="form-control"
                            value={
                              quantities[
                                `qtd-${value.servico}-${selectedCity}`
                              ] ?? ""
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                value,
                                e.target.value,
                                "qtd-"
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {maskCurrency(value[selectedCity] || 0)}
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            disabled={
                              value[selectedCity] === null ||
                              !quantities[
                                `qtd-${value.servico}-${selectedCity}`
                              ] ||
                              quantities[
                                `qtd-${value.servico}-${selectedCity}`
                              ] === "0"
                            }
                            type="number"
                            className="form-control"
                            value={
                              quantities[`${value.servico}-${selectedCity}`] ??
                              ""
                            }
                            onChange={(e) =>
                              handleQuantityChange(value, e.target.value, "")
                            }
                          />
                        </td>

                        <td className="text-center">
                          {maskCurrency(calculateTotalRow(value))}
                        </td>
                      </tr>
                    ))
                  : null}
                <TotalRow>
                  <td colSpan={3}>TOTAL CONSULTAS E EXAMES</td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(totalM)}
                  </td>
                </TotalRow>
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Exames;
