import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { getAllASSTI } from "../resources/calculadora";
import { maskCurrency } from "../utils/masks";
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

const employeeOptions = [
  { label: "De 20 a 99 Funcionários", value: "20 a 99 Funcionários" },
  { label: "De 100 a 499 Funcionários", value: "100 a 499 Funcionários" },
  { label: "Acima de 500 Funcionários", value: "Acima de 500" },
];

const ASSTI = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const localStoragePrecos = useMemo(
    () => JSON.parse(localStorage.getItem("assti")) || [],
    []
  );
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [funcionarios, setFuncionarios] = useState(employeeOptions[0].value);
  const [deslocamento, setDeslocamento] = useState(0);
  const [quantities, setQuantities] = useState({});

  const precosASSTI = useMemo(() => {
    return precos.find((value) => value.porte === funcionarios);
  }, [precos, funcionarios]);

  const [openSections, setOpenSections] = useState({
    assti: true,
    deslocamento: true,
  });

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllASSTI(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("assti", JSON.stringify(response.data.results));
          toast.success(`ASSTI carregado com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar ASSTI."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (localStorageCart?.assti?.length) {
      const newQuantities = {};
      localStorageCart.assti.forEach((item) => {
        newQuantities[item.name] = item.markup;
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.assti?.length]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, assti: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (name, description, value, price) => {
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartAssti = cart.assti || [];

    const total = calculateTotal(price, value);

    const existingItem = cartAssti.find((item) => item.name === name);

    if (existingItem) {
      if (value === "") {
        cartAssti = cartAssti.filter((item) => !(item.name === name));
      } else {
        existingItem.markup = value;
        existingItem.total = total;
      }
    } else {
      cartAssti.push({
        name: name,
        description: description,
        markup: value,
        value: Math.round(price * 100) / 100,
        total: total,
      });
    }

    setCart(cartAssti);

    setQuantities((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalAplicacao = (markup) => {
    if (precosASSTI) {
      const {
        custoAplicacaoQuestionario,
        aplicacaoQuestionario,
        horaSemanaAplicacaoQuestionario,
        custoAnaliseQuestionario,
        analiseQuestionario,
        horaSemanaAnaliseQuestionario,
        custoDevolutivaQuestionario,
        devolutivaQuestionario,
        horaSemanaDevolutivaQuestionario,
      } = precosASSTI;
      const margemAplicacao = markup
        ? (100 - (quantities["Aplicação Questionário ASSTI"] || 0)) / 100
        : 1;
      const margemAnalise = markup
        ? (100 - (quantities["Análise Questionário ASSTI"] || 0)) / 100
        : 1;
      const margemDevolutiva = markup
        ? (100 - (quantities["Devolutiva Relatório ASSTI"] || 0)) / 100
        : 1;
      return (
        (custoAplicacaoQuestionario *
          aplicacaoQuestionario *
          horaSemanaAplicacaoQuestionario) /
          margemAplicacao +
        (custoAnaliseQuestionario *
          analiseQuestionario *
          horaSemanaAnaliseQuestionario) /
          margemAnalise +
        (custoDevolutivaQuestionario *
          devolutivaQuestionario *
          horaSemanaDevolutivaQuestionario) /
          margemDevolutiva
      );
    }
  };

  const renderRow = (activity, description, cost, qty, hours, total) =>
    activity.toLowerCase().includes(search?.trim().toLowerCase()) ? (
      <tr>
        <td>Analista Técnico</td>
        <td className="text-center">{activity}</td>
        <td className="text-center">{maskCurrency(cost)}</td>
        <td className="text-center">{qty}</td>
        <td className="text-center">{hours}</td>

        <td className="text-center">{maskCurrency(total)}</td>
        <td className="text-center">
          <input
            min={0}
            placeholder={0}
            type="number"
            className="form-control"
            value={quantities[activity] ?? ""}
            onChange={(e) =>
              handleQuantityChange(activity, description, e.target.value, total)
            }
          />
        </td>
      </tr>
    ) : null;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div className="" style={{ paddingBottom: "160px" }}>
          <div className="d-flex justify-content-between flex-column">
            <ValuesContainer>
              <ValuesRow $row={0}>
                <div>
                  <ValuesText>Custos Diretos: </ValuesText>
                  <ValuesAmount>{maskCurrency(totalAplicacao())}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Valor Venda: </ValuesText>
                  <ValuesAmount>{maskCurrency(totalAplicacao(1))}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Deslocamento: </ValuesText>
                  <ValuesAmount>{maskCurrency(deslocamento)}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Valor Total: </ValuesText>
                  <ValuesAmount>
                    {maskCurrency(totalAplicacao(1) + deslocamento)}
                  </ValuesAmount>
                </div>
              </ValuesRow>
            </ValuesContainer>
            <FilterContainer>
              <div className="d-flex">
                <div className="d-flex align-items-center p-3">
                  <strong>Funcionários: </strong>
                  <select
                    className="form-select ms-2"
                    value={funcionarios}
                    onChange={(e) => setFuncionarios(e.target.value)}
                  >
                    {employeeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FilterContainer>
          </div>
          <TableTitle
            onClick={() => toggleSection("assti")}
            $active={openSections?.assti}
          >
            ASSTI
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table className="table table-striped table-hover">
            {openSections.assti ? (
              <thead className="thead-light">
                <tr>
                  <th scope="col">Cargo</th>
                  <th className="text-center" scope="col">
                    Atividade
                  </th>
                  <th scope="col">Custo Hora</th>
                  <th className="text-center" scope="col">
                    Quantidade
                  </th>
                  <th className="text-center" scope="col">
                    Hora Semana
                  </th>

                  <th className="text-center" scope="col">
                    Custo Total
                  </th>
                  <th style={{ width: "10%" }}>Margem</th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {openSections.assti
                ? precosASSTI &&
                  renderRow(
                    "Aplicação Questionário ASSTI",
                    precosASSTI.descricao,
                    precosASSTI.custoAplicacaoQuestionario,
                    precosASSTI.aplicacaoQuestionario,
                    precosASSTI.horaSemanaAplicacaoQuestionario,
                    precosASSTI.custoAplicacaoQuestionario *
                      precosASSTI.aplicacaoQuestionario *
                      precosASSTI.horaSemanaAplicacaoQuestionario
                  )
                : null}
              {openSections.assti
                ? precosASSTI &&
                  renderRow(
                    "Análise Questionário ASSTI",
                    precosASSTI.descricao,
                    precosASSTI.custoAnaliseQuestionario,
                    precosASSTI.analiseQuestionario,
                    precosASSTI.horaSemanaAnaliseQuestionario,
                    precosASSTI.custoAnaliseQuestionario *
                      precosASSTI.analiseQuestionario *
                      precosASSTI.horaSemanaAnaliseQuestionario
                  )
                : null}
              {openSections.assti
                ? precosASSTI &&
                  renderRow(
                    "Devolutiva Relatório ASSTI",
                    precosASSTI.descricao,
                    precosASSTI.custoDevolutivaQuestionario,
                    precosASSTI.devolutivaQuestionario,
                    precosASSTI.horaSemanaDevolutivaQuestionario,
                    precosASSTI.custoDevolutivaQuestionario *
                      precosASSTI.devolutivaQuestionario *
                      precosASSTI.horaSemanaDevolutivaQuestionario
                  )
                : null}
              <TotalRow>
                <td colSpan={5} className="">
                  TOTAL ASSTI
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalAplicacao(1))}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <DeslocamentoTable
            deslocamento={deslocamento}
            setDeslocamento={setDeslocamento}
            assti={1}
            openSections={openSections}
            toggleSection={toggleSection}
            toggle
            cartType="assti"
          />
        </div>
      ) : null}
    </>
  );
};

export default ASSTI;
