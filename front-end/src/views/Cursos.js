import Cookies from "js-cookie";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import {
  getAllCursos,
  getAllCursosCredenciado,
  getCredenciadoOptions,
} from "../resources/calculadora";
import { toast } from "react-toastify";
import { maskCurrency } from "../utils/masks";
import styled from "styled-components";
import DeslocamentoTable from "../components/DeslocamentoTable";
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
  padding: 1rem 1rem 2rem 1rem;
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
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  & * {
    background-color: white;
  }
`;

const Cursos = ({ search }) => {
  const token = Cookies.get("token");
  const localStoragePrecos = localStorage.getItem("cursos")
    ? JSON.parse(localStorage.getItem("cursos"))
    : [];
  const localStorageCredenciado = localStorage.getItem("cursosCredenciados")
    ? JSON.parse(localStorage.getItem("cursosCredenciados"))
    : [];
  const localStorageOptions = localStorage.getItem("credenciadoOptions")
    ? JSON.parse(localStorage.getItem("credenciadoOptions"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [isLoading, setIsLoading] = useState(false);
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [precosCredenciado, setPrecosCredenciado] = useState(
    localStorageCredenciado
  );
  const [credenciadoOptions, setCredenciadoOptions] =
    useState(localStorageOptions);
  const [selectedOption, setSelectedOption] = useState("");
  const [quantities, setQuantities] = useState({});
  const [credenciado, setCredenciado] = useState("");
  const [selected, setSelected] = useState("all");
  const [deslocamento, setDeslocamento] = useState(0);
  const [openSections, setOpenSections] = useState({
    cursos: true,
    deslocamento: true,
  });

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllCursos(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("cursos", JSON.stringify(response.data.results));
          toast.success(`Cursos carregados com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar cursos."
          );
          validateToken(error.response?.status);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (token && precosCredenciado.length === 0 && credenciado === "sim") {
      setIsLoading(true);
      getAllCursosCredenciado(token)
        .then((response) => {
          setPrecosCredenciado(response.data.results);
          localStorage.setItem(
            "cursosCredenciados",
            JSON.stringify(response.data.results)
          );
          toast.success(`Credenciados carregados com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar credenciados."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          if (credenciadoOptions.length === 0) {
            getCredenciadoOptions(token)
              .then((response) => {
                setCredenciadoOptions(response.data.results);
                localStorage.setItem(
                  "credenciadoOptions",
                  JSON.stringify(response.data.results)
                );
                toast.success(`Opções carregadas com sucesso.`);
              })
              .catch((error) => {
                toast.error(
                  error.response?.data?.message || "Erro ao carregar opções."
                );
                validateToken(error.response?.status);
              });
          }
          setIsLoading(false);
        });
    }
  }, [token, precosCredenciado.length, credenciado, credenciadoOptions.length]);

  useEffect(() => {
    if (localStorageCart?.cursos?.length) {
      const newQuantities = {};
      localStorageCart.cursos.forEach((item) => {
        if (item.markup) {
          newQuantities[`markup-${item.id}`] = item.markup;
        }
        if (item.quantity) {
          newQuantities[`qtd-${item.id}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.cursos?.length]);

  const filteredprecos = (
    credenciado === "sim" ? precosCredenciado : precos
  ).filter((value) => {
    const matchesType =
      selected === "all" ||
      value.nome.toLowerCase().includes(selected.toLowerCase());
    const matchesNome = value.nome.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesNome;
  });

  const getPrice = (product) => {
    return credenciado === "sim"
      ? selectedOption * product.custoTreinamentoPresencial ||
          selectedOption * product.custoTreinamento
      : product.custoGeracaoCertificado ||
          product.custoTotalSemipresencial ||
          product.custoTotalTreinamentoPresencial;
  };

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, cursos: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    id,
    value,
    category,
    description,
    productName,
    price
  ) => {
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartCursos = cart.cursos || [];

    const total = calculateTotal(price, value);

    const existingItem = cartCursos.find((item) => item.name === productName);

    if (existingItem) {
      if (value === "") {
        cartCursos = cartCursos.filter((item) => !(item.name === productName));
      } else {
        if (category === "qtd") {
          existingItem.quantity = value;
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      }
    } else {
      if (category === "qtd") {
        cartCursos.push({
          id: id,
          category: category,
          description: description,
          name: productName,
          quantity: value,
          value: price,
          total: total,
        });
      } else {
        cartCursos.push({
          id: id,
          category: category,
          description: description,
          name: productName,
          markup: value,
          value: price,
          total: total,
        });
      }
    }

    setCart(cartCursos);

    setQuantities((prev) => ({
      ...prev,
      [`${category}-${id}`]: value,
    }));
  };

  const renderTableCell = (
    value,
    isHighlighted = false,
    isEAD = false,
    courseName
  ) => (
    <td
      className={`${courseName ? "" : "text-center"} ${
        isHighlighted ? "bg-warning" : isEAD ? "bg-success" : ""
      }`}
      style={{ wordBreak: "break-word", fontSize: "13px" }}
    >
      {value}
    </td>
  );

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotalRow = (value) => {
    const quantity = quantities[`qtd-${value.id}`] || 0;
    const custoBase = value.custoSistema * quantity;
    const margem = (100 - (quantities[`markup-${value.id}`] || 0)) / 100;

    if (value.semiPresencial) {
      const semiPresencialCost =
        credenciado === "sim"
          ? custoBase + value.presencial * selectedOption
          : custoBase + value.custoTotalSemipresencial;
      return semiPresencialCost / margem;
    } else if (value.certificado) {
      return value.custoGeracaoCertificado / margem;
    } else {
      const treinamentoCost =
        credenciado === "sim"
          ? selectedOption * value.custoTreinamentoPresencial
          : value.custoTotalTreinamentoPresencial;

      return treinamentoCost / margem;
    }
  };

  const presencialSumM = filteredprecos.reduce((sum, value) => {
    if (quantities[`markup-${value.id}`]) {
      const margem = (100 - (quantities[`markup-${value.id}`] || 0)) / 100;
      return (
        sum +
        (credenciado === "sim"
          ? selectedOption * value.custoTreinamentoPresencial
          : value.custoTotalTreinamentoPresencial) /
          margem
      );
    }
    return sum;
  }, 0);

  const presencialSum = filteredprecos.reduce((sum, value) => {
    if (quantities[`markup-${value.id}`]) {
      return (
        sum +
        (credenciado === "sim"
          ? selectedOption * value.custoTreinamentoPresencial
          : value.custoTotalTreinamentoPresencial)
      );
    }
    return sum;
  }, 0);

  const semiPresencialSumM = filteredprecos.reduce((sum, value) => {
    if (quantities[`markup-${value.id}`]) {
      const margem = (100 - (quantities[`markup-${value.id}`] || 0)) / 100;

      return (
        sum +
        (value.custoSistema * (quantities[`qtd-${value.id}`] || 0) +
          (credenciado === "sim"
            ? value.presencial * selectedOption
            : value.custoTotalSemipresencial)) /
          margem
      );
    }
    return sum;
  }, 0);

  const semiPresencialSum = filteredprecos.reduce((sum, value) => {
    if (quantities[`markup-${value.id}`]) {
      return (
        sum +
        (value.custoSistema * (quantities[`qtd-${value.id}`] || 0) +
          (credenciado === "sim"
            ? value.presencial * selectedOption
            : value.custoTotalSemipresencial))
      );
    }
    return sum;
  }, 0);

  const eadSumM =
    credenciado === "sim"
      ? 0
      : filteredprecos.reduce((sum, value) => {
          if (quantities[`markup-${value.id}`]) {
            const margem =
              (100 - (quantities[`markup-${value.id}`] || 0)) / 100;
            return sum + value.custoGeracaoCertificado / margem;
          }
          return sum;
        }, 0);

  const eadSum =
    credenciado === "sim"
      ? 0
      : filteredprecos.reduce((sum, value) => {
          if (quantities[`markup-${value.id}`]) {
            return sum + value.custoGeracaoCertificado;
          }
          return sum;
        }, 0);

  const valorTotalM = presencialSumM + semiPresencialSumM + eadSumM;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div className="" style={{ paddingBottom: "160px" }}>
          <ValuesContainer>
            <ValuesRow $row={0}>
              <div>
                <ValuesText>Custos Diretos:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(presencialSum + semiPresencialSum + eadSum)}
                </ValuesAmount>
              </div>
              <div>
                <ValuesText>Deslocamento:</ValuesText>
                <ValuesAmount>{maskCurrency(deslocamento)}</ValuesAmount>
              </div>
              <div>
                <ValuesText>Valor Venda:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(valorTotalM + deslocamento)}
                </ValuesAmount>
              </div>
            </ValuesRow>
          </ValuesContainer>

          <FilterContainer>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex align-items-center mx-2"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "rgba(80, 80, 80, 1)",
                }}
              >
                Credenciado:
                <select
                  className="form-select mx-2"
                  value={credenciado}
                  onChange={(e) => setCredenciado(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div
                className="d-flex align-items-center mx-2"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "rgba(80, 80, 80, 1)",
                }}
              >
                Categoria:
                <select
                  className="form-select mx-2"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  <option value="all">Todos</option>
                  <option value="(presencial)">Presencial</option>
                  <option value="semipresencial">Semipresencial</option>
                  <option value="ead">EAD</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              {credenciado === "sim" ? (
                <div
                  className="d-flex align-items-center mx-2"
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "rgba(80, 80, 80, 1)",
                  }}
                >
                  Faixa:
                  <select
                    className="form-select mx-2"
                    value={selectedOption}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {credenciadoOptions.map((option) => (
                      <option key={option.id} value={option.treinamento}>
                        {option.faixa}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          </FilterContainer>
          <TableTitle
            onClick={() => toggleSection("cursos")}
            $active={openSections?.cursos}
          >
            CONSULTORIA SST
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table
            className="table table-striped table-hover"
            style={{ tableLayout: "fixed" }}
          >
            {openSections.cursos ? (
              <thead
                className="sticky-top bg-white"
                style={{ wordBreak: "break-word", fontSize: "12px" }}
              >
                <tr>
                  <th style={{ width: "19%" }}>Cursos e Treinamentos</th>
                  <th style={{ width: "5%" }}>CH</th>
                  <th className="text-center" style={{ width: "13%" }}>
                    Presencial
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    SpP
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    SpO
                  </th>
                  <th className="text-center" style={{ width: "13%" }}>
                    Treinamento
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Qtd Func
                  </th>
                  {credenciado !== "sim" ? (
                    <th className="text-center" style={{ width: "13%" }}>
                      EAD
                    </th>
                  ) : null}
                  <th className="text-center" style={{ width: "10%" }}>
                    Margem
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Total
                  </th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {openSections.cursos
                ? filteredprecos.map((value) => {
                    const isHighlighted = value.semiPresencial;
                    const isEAD = value.certificado;
                    return (
                      <tr key={value.id} style={{ verticalAlign: "middle" }}>
                        {renderTableCell(
                          value.nome,
                          isHighlighted,
                          isEAD,
                          true
                        )}
                        {renderTableCell(
                          value.cargaHoraria,
                          isHighlighted,
                          isEAD
                        )}
                        {renderTableCell(
                          maskCurrency(
                            credenciado === "sim"
                              ? selectedOption *
                                  value.custoTreinamentoPresencial
                              : value.custoTotalTreinamentoPresencial
                          ),

                          isHighlighted,
                          isEAD
                        )}
                        {renderTableCell(
                          value.presencial,

                          isHighlighted,
                          isEAD
                        )}
                        {renderTableCell(
                          value.online,

                          isHighlighted,
                          isEAD
                        )}
                        {renderTableCell(
                          maskCurrency(
                            credenciado === "sim"
                              ? value.custoSistema *
                                  (quantities[`qtd-${value.id}`] || 0) +
                                  selectedOption * value.custoTreinamento
                              : value.custoSistema *
                                  (quantities[`qtd-${value.id}`] || 0) +
                                  value.custoTotalSemipresencial
                          ),

                          isHighlighted,
                          isEAD
                        )}
                        <td
                          className={
                            isHighlighted
                              ? "bg-warning"
                              : isEAD
                              ? "bg-success"
                              : ""
                          }
                        >
                          <input
                            min={0}
                            placeholder={0}
                            step={1}
                            type="number"
                            className="form-control"
                            value={quantities[`qtd-${value.id}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                value.id,
                                e.target.value,
                                "qtd",
                                value.descricao,
                                value.nome,
                                getPrice(value)
                              )
                            }
                            disabled={!isHighlighted}
                          />
                        </td>

                        {credenciado !== "sim"
                          ? renderTableCell(
                              maskCurrency(value.custoGeracaoCertificado),
                              isHighlighted,
                              isEAD
                            )
                          : null}

                        <td
                          className={
                            isHighlighted
                              ? "bg-warning"
                              : isEAD
                              ? "bg-success"
                              : ""
                          }
                        >
                          <input
                            min={0}
                            placeholder={0}
                            disabled={
                              (!quantities[`qtd-${value.id}`] ||
                                quantities[`qtd-${value.id}`] === "0") &&
                              value.semiPresencial
                            }
                            type="number"
                            className="form-control"
                            value={quantities[`markup-${value.id}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                value.id,
                                e.target.value,
                                "markup",
                                value.descricao,
                                value.nome,
                                getPrice(value)
                              )
                            }
                          />
                        </td>
                        {renderTableCell(
                          maskCurrency(calculateTotalRow(value)),

                          isHighlighted,
                          isEAD
                        )}
                      </tr>
                    );
                  })
                : null}
              <TotalRow>
                <td colSpan={credenciado ? 7 : 8} className="">
                  TOTAL CURSOS
                </td>

                <td colSpan={2} className="text-end">
                  {maskCurrency(valorTotalM)}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <DeslocamentoTable
            setDeslocamento={setDeslocamento}
            openSections={openSections}
            toggleSection={toggleSection}
            toggle
            cartType="cursos"
          />
        </div>
      ) : null}
    </>
  );
};

export default Cursos;
