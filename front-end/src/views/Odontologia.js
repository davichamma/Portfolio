import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getAllOdontologia } from "../resources/calculadora";
import { maskCurrency } from "../utils/masks";
import DeslocamentoTable from "../components/DeslocamentoTable";
import { ExpandedIcon } from "../icons/icons";
import { validateToken } from "../utils/validateToken";
import { capitalizeEachWord } from "../utils/conversions";

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

const Odontologia = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const localStoragePrecos = () =>
    localStorage.getItem("odontologia")
      ? JSON.parse(localStorage.getItem("odontologia"))
      : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [deslocamento, setDeslocamento] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [openSections, setOpenSections] = useState({
    avaliacao: true,
    atendimento: true,
    deslocamento: true,
  });

  const precosAvaliacao = precos.filter((value) => value.tipo === "av");

  const filteredAvaliacao = search?.trim().toLowerCase()
    ? precosAvaliacao.filter(({ atividade, descricao, unidade }) =>
        [atividade, descricao, unidade].some((text) =>
          text.toLowerCase().includes(search.toLowerCase())
        )
      )
    : precosAvaliacao;

  const precosAtendimento = precos.filter((value) => value.tipo === "ao");

  const filteredAtendimento = search?.trim().toLowerCase()
    ? precosAtendimento.filter(({ atividade, descricao, unidade }) =>
        [atividade, descricao, unidade].some((text) =>
          text.toLowerCase().includes(search.toLowerCase())
        )
      )
    : precosAtendimento;

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllOdontologia(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem(
            "odontologia",
            JSON.stringify(response.data.results)
          );
          toast.success(`Odontologia carregada com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar odontologia."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (localStorageCart?.odontologia?.length) {
      const newQuantities = {};
      localStorageCart.odontologia.forEach((item) => {
        if (item.markup) {
          newQuantities[
            `markup${capitalizeEachWord(item.category)}-${item.id}`
          ] = item.markup;
        }
        if (item.quantity) {
          newQuantities[`${item.category}-${item.id}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.odontologia?.length]);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, odontologia: cart };
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
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartOdontologia = cart.odontologia || [];

    const total = calculateTotal(price, value);

    const existingItem = cartOdontologia.find(
      (item) =>
        item.name === productName &&
        category.toLowerCase().includes(item.category)
    );

    if (existingItem) {
      if (value === "") {
        cartOdontologia = cartOdontologia.filter(
          (item) =>
            !(
              item.name === productName &&
              category.toLowerCase().includes(item.category)
            )
        );
      } else {
        if (!category.includes("markup")) {
          existingItem.quantity = value;
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      }
    } else {
      cartOdontologia.push({
        id: index,
        name: productName,
        description: description,
        category: category,
        quantity: value,
        value: price,
        total: total,
      });
    }

    setCart(cartOdontologia);
    setQuantities((prev) => ({
      ...prev,
      [`${category}-${index}`]: value,
    }));
  };

  const calculateTotal = (arr, markup, type) => {
    return arr.reduce((acc, value, index) => {
      const quantity = quantities[`${value.tipo}-${value.itemId}`] || 0;
      return (
        acc +
        handleTotal(
          quantity * value.custo,
          value.itemId,
          type ? `${markup}` : 0
        )
      );
    }, 0);
  };

  const handleTotal = (total, index, category) => {
    const markup = (100 - (quantities[`${category}-${index}`] || 0)) / 100;
    return total / markup;
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const totalAvaliacaoM = calculateTotal(filteredAvaliacao, "markupAv", 1);
  const totalAtendimentoM = calculateTotal(filteredAtendimento, "markupAo", 1);
  const totalAvaliacao = calculateTotal(filteredAvaliacao, "markupAv");
  const totalAtendimento = calculateTotal(filteredAtendimento, "markupAo");
  const total = totalAvaliacao + totalAtendimento;
  const totalM = totalAvaliacaoM + totalAtendimentoM;
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div className="" style={{ paddingBottom: "160px" }}>
          <div className="d-flex justify-content-between sticky-top flex-column">
            <ValuesContainer>
              <ValuesRow $row={0}>
                <div>
                  <ValuesText>Custos Diretos: </ValuesText>
                  <ValuesAmount>{maskCurrency(total)}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Valor Venda:</ValuesText>
                  <ValuesAmount>{maskCurrency(totalM)}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Deslocamento:</ValuesText>
                  <ValuesAmount>{maskCurrency(deslocamento)}</ValuesAmount>
                </div>
                <div>
                  <ValuesText>Valor Total:</ValuesText>
                  <ValuesAmount>
                    {maskCurrency(totalM + deslocamento)}
                  </ValuesAmount>
                </div>
              </ValuesRow>
            </ValuesContainer>
          </div>
          <TableTitle
            onClick={() => toggleSection("avaliacao")}
            $active={openSections?.avaliacao}
          >
            AVALIAÇÃO ODONTOLÓGICA
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table
            className="table table-striped table-hover"
            style={{ tableLayout: "fixed", margin: "0 auto" }}
          >
            {openSections.avaliacao ? (
              <thead className="thead-light">
                <tr>
                  <th scope="col">Descrição das Atividades</th>
                  <th className="text-center" scope="col">
                    Observação
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Qtd
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Unidade
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Preço Unitário
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "12%" }}
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
              {openSections.avaliacao
                ? filteredAvaliacao.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.atividade}</td>
                      <td className="text-center">{value.descricao}</td>
                      <td className="text-center">
                        {
                          <input
                            min={0}
                            type="number"
                            placeholder={0}
                            className="form-control"
                            value={
                              quantities[`${value.tipo}-${value.itemId}`] ?? ""
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                value.itemId,
                                e.target.value,
                                value.tipo,
                                value.descricao,
                                value.atividade,
                                value.custo
                              )
                            }
                          />
                        }
                      </td>
                      <td className="text-center">{value.unidade}</td>
                      <td className="text-center">
                        {maskCurrency(value.custo)}
                      </td>
                      <td className="text-center">
                        <input
                          min={0}
                          type="number"
                          disabled={
                            !quantities[`${value.tipo}-${value.itemId}`] ||
                            quantities[`${value.tipo}-${value.itemId}`] === "0"
                          }
                          placeholder={0}
                          className="form-control"
                          value={quantities[`markupAv-${value.itemId}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.itemId,
                              e.target.value,
                              `markupAv`,
                              value.descricao,
                              value.atividade,
                              value.custo
                            )
                          }
                        />
                      </td>

                      <td className="text-center">
                        {maskCurrency(
                          handleTotal(
                            (quantities[`${value.tipo}-${value.itemId}`] || 0) *
                              value.custo,
                            value.itemId,
                            `markupAv`
                          )
                        )}
                      </td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td colSpan={5} className="">
                  TOTAL AVALIAÇÃO ODONTOLÓGICA
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalAvaliacaoM)}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <TableTitle
            onClick={() => toggleSection("atendimento")}
            $active={openSections?.atendimento}
          >
            ATENDIMENTO ODONTOLÓGICO
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table
            className="table table-striped table-hover"
            style={{ tableLayout: "fixed" }}
          >
            {openSections.atendimento ? (
              <thead className="thead-light">
                <tr>
                  <th scope="col">Descrição das Atividades</th>
                  <th className="text-center" scope="col">
                    Observação
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Qtd
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Unidade
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%" }}
                    scope="col"
                  >
                    Preço Unitário
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "12%" }}
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
              {openSections.atendimento
                ? filteredAtendimento.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.atividade}</td>
                      <td className="text-center">{value.descricao}</td>
                      <td className="text-center">
                        {
                          <input
                            min={0}
                            type="number"
                            className="form-control"
                            placeholder={0}
                            value={
                              quantities[`${value.tipo}-${value.itemId}`] ?? ""
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                value.itemId,
                                e.target.value,
                                value.tipo,
                                value.descricao,
                                value.atividade,
                                value.custo
                              )
                            }
                          />
                        }
                      </td>
                      <td className="text-center">{value.unidade}</td>
                      <td className="text-center">
                        {maskCurrency(value.custo)}
                      </td>
                      <td className="text-center">
                        <input
                          min={0}
                          type="number"
                          disabled={
                            !quantities[`${value.tipo}-${value.itemId}`] ||
                            quantities[`${value.tipo}-${value.itemId}`] === "0"
                          }
                          className="form-control"
                          placeholder={0}
                          value={quantities[`markupAo-${value.itemId}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.itemId,
                              e.target.value,
                              `markupAo`,
                              value.descricao,
                              value.atividade,
                              value.custo
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(
                          handleTotal(
                            (quantities[`${value.tipo}-${value.itemId}`] || 0) *
                              value.custo,
                            value.itemId,
                            `markupAo`
                          )
                        )}
                      </td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td colSpan={5} className="">
                  TOTAL ATENDIMENTO ODONTOLÓGICO
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalAtendimentoM)}
                </td>
              </TotalRow>
            </tbody>
          </table>

          <DeslocamentoTable
            deslocamento={deslocamento}
            setDeslocamento={setDeslocamento}
            openSections={openSections}
            toggleSection={toggleSection}
            toggle
            cartType="odontologia"
          />
        </div>
      ) : null}
    </>
  );
};

export default Odontologia;
