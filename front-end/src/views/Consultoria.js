import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getAllConsultorias } from "../resources/calculadora";
import { maskCurrency } from "../utils/masks";
import { ExpandedIcon } from "../icons/icons";
import DeslocamentoTable from "../components/DeslocamentoTable";
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

const Consultoria = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const localStoragePrecos = localStorage.getItem("consultorias")
    ? JSON.parse(localStorage.getItem("consultorias"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [refresh, setRefresh] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [funcionarios, setFuncionarios] = useState("100 a 249 Funcionários");
  const [deslocamento, setDeslocamento] = useState(0);

  const filteredConsultorias = precos.filter(
    (value) =>
      value.atividade !== "SISTEMA SST S+" && value.porte === funcionarios
  );

  const filteredText = search?.trim().toLowerCase()
    ? filteredConsultorias.filter(({ atividade, cargo }) =>
        [atividade, cargo].some((text) =>
          text.toLowerCase().includes(search.toLowerCase())
        )
      )
    : filteredConsultorias;

  const filteredSMais = precos.filter(
    (value) =>
      value.atividade === "SISTEMA SST S+" && value.porte === funcionarios
  );

  const handleTotal = (total, index, category) => {
    const markup = (100 - (quantities[`${category}-${index}`] || 0)) / 100;
    return total / markup;
  };

  const totalValorConsultoria = [...filteredText].reduce(
    (sum, item, index) => sum + handleTotal(item.total, index, "markup") || 0,
    0
  );

  const totalValorSMais =
    filteredSMais.reduce(
      (sum, value, index) =>
        sum +
          handleTotal(
            value.valor_unitario *
              value.horas_contrato *
              quantities[`smais-${index}`],
            0,
            "smais-markup"
          ) || 0,
      0
    ) +
    (parseInt(quantities["ativacao-0"]) || 0) * 0 * 0;

  const valorTotal = totalValorConsultoria + totalValorSMais;

  useEffect(() => {
    if ((token && precos.length === 0) || refresh) {
      setIsLoading(true);
      getAllConsultorias(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem(
            "consultorias",
            JSON.stringify(response.data.results)
          );
          toast.success(
            `Consultorias ${
              refresh ? "atualizadas" : "carregadas"
            } com sucesso.`
          );
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar consultorias."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
          if (refresh) {
            setRefresh(false);
          }
        });
    }
  }, [token, precos.length, refresh]);

  useEffect(() => {
    if (localStorageCart?.consultorias?.length) {
      const newQuantities = {};
      localStorageCart.consultorias.forEach((item) => {
        newQuantities[`${item.category}-${item.id}`] = item.markup;
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.consultorias?.length]);

  const [openSections, setOpenSections] = useState({
    consultoria: true,
    sMais: true,
    deslocamento: true,
  });

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, consultorias: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    index,
    value,
    category,
    description,
    productName,
    price
  ) => {
    if (category.includes("markup")) {
      const calculateTotal = (value, markup) => {
        const margem = (100 - markup) / 100;
        return Math.round((value / margem) * 100) / 100;
      };

      const cart = getCart();
      let cartConsultorias = cart.consultorias || [];

      const total = calculateTotal(price, value);

      const existingItem = cartConsultorias.find(
        (item) => item.name === productName
      );

      if (existingItem) {
        if (value === "") {
          cartConsultorias = cartConsultorias.filter(
            (item) => !(item.name === productName)
          );
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      } else {
        cartConsultorias.push({
          id: index,
          category: category,
          name: productName,
          description: description,
          markup: value,
          value: price,
          total: total,
        });
      }

      setCart(cartConsultorias);
    }
    setQuantities((prev) => ({
      ...prev,
      [`${category}-${index}`]: value,
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div style={{ paddingBottom: "130px" }}>
          <ValuesContainer>
            <ValuesRow $row={0}>
              <div>
                <ValuesText>Custos Diretos: </ValuesText>
                <ValuesAmount>{maskCurrency(valorTotal)}</ValuesAmount>
              </div>
              <div>
                <ValuesText>Deslocamento: </ValuesText>
                <ValuesAmount>{maskCurrency(deslocamento)}</ValuesAmount>
              </div>
              <div>
                <ValuesText>Custos Totais:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(valorTotal + deslocamento)}
                </ValuesAmount>
              </div>
            </ValuesRow>
          </ValuesContainer>
          <FilterContainer>
            <div className="d-flex align-items-center">
              <div
                className="mx-2 bg-white"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "rgba(80, 80, 80, 1)",
                }}
              >
                Funcionários:
              </div>
              <select
                className="form-select"
                value={funcionarios}
                onChange={(e) => setFuncionarios(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="100 a 249 Funcionários">
                  De 100 a 249 funcionários
                </option>
                <option value="250 a 499 Funcionários">
                  De 250 a 499 funcionários
                </option>
                <option value="500 a 999 Funcionários">
                  De 500 a 999 funcionários
                </option>
                <option value="Acima de 1000">
                  Acima de 1000 funcionários
                </option>
              </select>
            </div>
          </FilterContainer>
          <TableTitle
            onClick={() => toggleSection("consultoria")}
            $active={openSections?.consultoria}
          >
            CONSULTORIA SST
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table
            className="table table-striped table-hover"
            style={{ margin: "0 auto" }}
          >
            {openSections.consultoria ? (
              <thead className="thead-light sticky-top">
                <tr>
                  <th style={{ width: "30%" }} scope="col">
                    Cargo
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "20%" }}
                    scope="col"
                  >
                    Atividade
                  </th>
                  <th style={{ width: "10%" }} scope="col">
                    Horas/Contrato
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "15%" }}
                    scope="col"
                  >
                    Valor Unitário
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Margem
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "15%" }}
                    scope="col"
                  >
                    Total
                  </th>
                </tr>
              </thead>
            ) : null}

            <tbody>
              {openSections.consultoria
                ? filteredText.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.cargo}</td>
                      <td className="text-center">{value.atividade}</td>
                      <td className="text-center">{value.horas_contrato}</td>
                      <td className="text-center">
                        {maskCurrency(value.valor_unitario)}
                      </td>
                      <td>
                        <input
                          min={0}
                          placeholder={0}
                          type="number"
                          className="form-control"
                          value={quantities[`markup-${index}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              e.target.value,
                              "markup",
                              value.atividade,
                              value.atividade,
                              value.total
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(
                          handleTotal(value.total, index, "markup")
                        )}
                      </td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td colSpan={5} className="">
                  TOTAL CONSULTORIA SST
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalValorConsultoria)}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <TableTitle
            onClick={() => toggleSection("sMais")}
            $active={openSections?.sMais}
          >
            SISTEMA S+
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table className="table table-striped table-hover">
            {openSections?.sMais ? (
              <thead className="thead-light sticky-top bg-white">
                <tr>
                  <th style={{ width: "30%" }} scope="col">
                    Identificação
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "20%" }}
                    scope="col"
                  >
                    Quantidade
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Horas/Mês
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "15%" }}
                    scope="col"
                  >
                    Valor Unitário
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Margem
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "15%" }}
                    scope="col"
                  >
                    Total
                  </th>
                </tr>
              </thead>
            ) : null}

            <tbody>
              {openSections?.sMais
                ? filteredSMais.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.atividade}</td>
                      <td className="text-center">{value.horas_contrato}</td>
                      <td>
                        <input
                          min={0}
                          placeholder={0}
                          type="number"
                          className="form-control"
                          value={quantities[`smais-${index}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              e.target.value,
                              "smais",
                              value.atividade,
                              value.atividade,
                              value.total
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(value.valor_unitario)}
                      </td>
                      <td>
                        <input
                          min={0}
                          placeholder={0}
                          type="number"
                          className="form-control"
                          value={quantities[`smais-markup-${index}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              e.target.value,
                              "smais-markup",
                              value.atividade,
                              value.atividade,
                              value.total
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(
                          handleTotal(
                            value.valor_unitario *
                              value.horas_contrato *
                              quantities[`smais-${index}`] || 0,
                            0,
                            "smais-markup"
                          )
                        )}
                      </td>
                    </tr>
                  ))
                : null}

              {openSections?.sMais ? (
                <tr>
                  <td>Ativação de Vida</td>
                  <td className="text-center">0</td>
                  <td>
                    <input
                      min={0}
                      placeholder={0}
                      type="number"
                      disabled
                      className="form-control"
                      value={quantities[`ativacao-0`] ?? ""}
                      onChange={(e) =>
                        handleQuantityChange(
                          0,
                          e.target.value,
                          "ativacao",
                          "Ativação de Vida",
                          "Ativação de Vida",
                          0
                        )
                      }
                    />
                  </td>
                  <td className="text-center">{maskCurrency(0)}</td>
                  <td>
                    <input
                      min={0}
                      placeholder={0}
                      type="number"
                      disabled
                      className="form-control"
                      value={quantities[`ativacao-markup`] ?? ""}
                      onChange={(e) =>
                        handleQuantityChange(
                          0,
                          e.target.value,
                          "ativacao-markup",
                          "Ativação de Vida",
                          "Ativação de Vida",
                          0
                        )
                      }
                    />
                  </td>
                  <td className="text-center">
                    {maskCurrency(0 * quantities[`ativacao-0`] * 0 || 0)}
                  </td>
                </tr>
              ) : null}

              <TotalRow>
                <td colSpan={5} className="">
                  TOTAL SISTEMA S+
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalValorSMais)}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <DeslocamentoTable
            setDeslocamento={setDeslocamento}
            toggleSection={toggleSection}
            openSections={openSections}
            toggle
            sps={1}
            cartType="consultorias"
          />
        </div>
      ) : null}
    </>
  );
};

export default Consultoria;
