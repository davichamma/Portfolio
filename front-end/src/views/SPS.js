import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getAllSPS } from "../resources/calculadora";
import { maskCurrency } from "../utils/masks";
import DeslocamentoTable from "../components/DeslocamentoTable";
import DeslocamentoProprio from "../components/DeslocamentoProprio";
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

const SPS = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const localStoragePrecos = localStorage.getItem("sps")
    ? JSON.parse(localStorage.getItem("sps"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [refresh, setRefresh] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [deslocamento, setDeslocamento] = useState(0);
  const [deslocamentoProprio, setDeslocamentoProprio] = useState(0);

  const [openSections, setOpenSections] = useState({
    presencial: true,
    online: true,
    proprio: true,
    deslocamento: true,
  });

  const filteredSPSPresencial = precos.filter(
    (value) => value.modalidade === "p"
  );

  const filteredTextPresencial = search?.trim().toLowerCase()
    ? filteredSPSPresencial.filter(({ servico }) =>
        [servico].some((text) =>
          text?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : filteredSPSPresencial;

  const filteredSPSOnline = precos.filter((value) => value.modalidade === "o");

  const filteredTextOnline = search?.trim().toLowerCase()
    ? filteredSPSOnline.filter(({ servico }) =>
        [servico].some((text) =>
          text?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : filteredSPSOnline;

  useEffect(() => {
    if ((token && precos.length === 0) || refresh) {
      setIsLoading(true);
      getAllSPS(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("sps", JSON.stringify(response.data.results));
          toast.success(
            `SPS ${refresh ? "atualizado" : "carregado"} com sucesso.`
          );
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Erro ao carregar SPS.");
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
    if (localStorageCart?.sps?.length) {
      const newQuantities = {};
      localStorageCart.sps.forEach((item) => {
        newQuantities[`${item.category}-${item.id}`] = item.markup;
        if (item.dia) {
          newQuantities[`dia-${item.id}`] = item.dia;
        }
        if (item.semana) {
          newQuantities[`semana-${item.id}`] = item.semana;
        }
        if (item.horas) {
          newQuantities[`semanaOnline-${item.id}`] = item.horas;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.sps?.length]);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, sps: cart };
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
      let cartSps = cart.sps || [];

      const total = calculateTotal(price, value);

      const existingItem = cartSps.find((item) => item.name === productName);

      if (existingItem) {
        if (value === "") {
          cartSps = cartSps.filter((item) => !(item.name === productName));
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      } else {
        cartSps.push({
          id: index,
          category: category,
          description: description,
          dia: quantities[`dia-${index}`],
          semana: quantities[`semana-${index}`],
          horas: quantities[`semanaOnline-${index}`],
          name: productName,
          markup: value,
          value: Math.round(price * 100) / 100,
          total: total,
        });
      }

      setCart(cartSps);
    }
    setQuantities((prev) => ({
      ...prev,
      [`${category}-${index}`]: value,
    }));
  };

  const totalWeeks = (selectedMonths) => {
    return (parseInt(selectedMonths) * 52) / 12;
  };

  const totalRow = (custoHora, totalHoras, selectedMonths, markup) => {
    const margem = (100 - (markup || 0)) / 100;
    return maskCurrency(
      (((parseInt(selectedMonths) * 52) / 12) * custoHora * totalHoras) / margem
    );
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateMarkup = (custoHora, quantidade, markup) => {
    const margem = (100 - (markup || 0)) / 100;
    return (custoHora * quantidade) / margem;
  };

  const custoTotalPresencialM = filteredTextPresencial.reduce(
    (acc, value, index) => {
      const markup = (100 - (quantities[`markupP-${index}`] || 0)) / 100;
      const horasSemana =
        (quantities[`dia-${index}`] || 0) *
        (quantities[`semana-${index}`] || 0);
      const custoHora = parseFloat(value.custo_hora) || 0;
      const selectedMonths = quantities[`selectedMonths-${index}`] || 12;
      const totalCost =
        (((selectedMonths * 52) / 12) * custoHora * horasSemana) / markup;
      return acc + totalCost;
    },
    0
  );

  const custoTotalPresencial = filteredTextPresencial.reduce(
    (acc, value, index) => {
      const horasSemana =
        (quantities[`dia-${index}`] || 0) *
        (quantities[`semana-${index}`] || 0);
      const custoHora = parseFloat(value.custo_hora) || 0;
      const selectedMonths = quantities[`selectedMonths-${index}`] || 12;
      const totalCost = ((selectedMonths * 52) / 12) * custoHora * horasSemana;
      return acc + totalCost;
    },
    0
  );

  const custoTotalOnlineM = filteredTextOnline.reduce((acc, value, index) => {
    const markup = (100 - (quantities[`markupO-${index}`] || 0)) / 100;
    const horasSemana = quantities[`semanaOnline-${index}`] || 0;
    const custoHora = parseFloat(value.custo_hora) || 0;
    const totalCost = (custoHora * horasSemana) / markup;
    return acc + totalCost;
  }, 0);

  const custoTotalOnline = filteredTextOnline.reduce((acc, value, index) => {
    const horasSemana = quantities[`semanaOnline-${index}`] || 0;
    const custoHora = parseFloat(value.custo_hora) || 0;
    const totalCost = custoHora * horasSemana;
    return acc + totalCost;
  }, 0);

  const totalSESIM = custoTotalOnlineM + custoTotalPresencialM;
  const totalSESI = custoTotalOnline + custoTotalPresencial;

  const calculatePrice = (value, category, index) => {
    let result;
    if (category === "p") {
      result =
        (value.custo_hora *
          (quantities[`dia-${index}`] || 0) *
          (quantities[`semana-${index}`] || 0) *
          ((quantities[`selectedMonths-${index}`] || 12) * 52)) /
        12;
    } else {
      result = value.custo_hora * quantities[`semanaOnline-${index}`];
    }
    return Math.round(result * 100) / 100;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div className="" style={{ paddingBottom: "160px" }}>
          <ValuesContainer>
            <ValuesRow $row={0}>
              <div>
                <ValuesText>Custos Diretos: </ValuesText>
                <ValuesAmount>
                  {maskCurrency(totalSESI + deslocamento + deslocamentoProprio)}
                </ValuesAmount>
              </div>
              <div>
                <ValuesText>Deslocamento:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(deslocamento + deslocamentoProprio)}
                </ValuesAmount>
              </div>

              <div>
                <ValuesText>Valor Venda:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(
                    totalSESIM + deslocamento + deslocamentoProprio
                  )}
                </ValuesAmount>
              </div>
            </ValuesRow>
          </ValuesContainer>

          <TableTitle
            onClick={() => toggleSection("presencial")}
            $active={openSections?.presencial}
          >
            SERVIÇOS EM PROMOÇÃO DA SAÚDE (PRESENCIAL)
            <ExpandedIcon size="24px" />
          </TableTitle>

          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            <table
              className="table table-striped table-hover"
              style={{
                width: "100%",
                tableLayout: "fixed",
                margin: "0 auto",
              }}
            >
              {openSections.presencial ? (
                <thead className="thead-light" style={{ fontSize: "13px" }}>
                  <tr
                    style={{ wordBreak: "break-word", verticalAlign: "middle" }}
                  >
                    <th scope="col">Serviços</th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "12%" }}
                    >
                      Modalidade
                    </th>
                    <th scope="col" style={{ width: "9%" }}>
                      Visitas/Dia
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "8%" }}
                    >
                      Qtd/Smn
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "6%" }}
                    >
                      H/Smn
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "10%" }}
                    >
                      Custo Hora
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "13%" }}
                    >
                      Qtd Meses
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "6%" }}
                    >
                      H/M
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "9%" }}
                    >
                      Margem
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "12%" }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {openSections.presencial
                  ? filteredTextPresencial.map((value, index) => (
                      <tr
                        key={index}
                        style={{
                          wordBreak: "break-word",
                          fontSize: "13px",
                          verticalAlign: "middle",
                        }}
                      >
                        <td>{value.servico}</td>
                        <td>Presencial</td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            type="number"
                            className="form-control"
                            value={quantities[`dia-${index}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "dia",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "p", index)
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            disabled={
                              !quantities[`dia-${index}`] ||
                              quantities[`dia-${index}`] === "0"
                            }
                            type="number"
                            className="form-control"
                            value={quantities[`semana-${index}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "semana",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "p", index)
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {(quantities[`dia-${index}`] || 0) *
                            (quantities[`semana-${index}`] || 0)}
                        </td>
                        <td className="text-center">
                          {maskCurrency(value.custo_hora)}
                        </td>
                        <td className="text-center">
                          <select
                            className="form-select"
                            value={
                              quantities[`selectedMonths-${index}`] || "12"
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "selectedMonths",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "p", index)
                              )
                            }
                          >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="36">36</option>
                          </select>
                        </td>
                        <td className="text-center">
                          {totalWeeks(
                            quantities[`selectedMonths-${index}`] || 12
                          )}
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            disabled={
                              !quantities[`semana-${index}`] ||
                              quantities[`semana-${index}`] === "0"
                            }
                            type="number"
                            className="form-control"
                            value={quantities[`markupP-${index}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "markupP",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "p", index)
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {totalRow(
                            value.custo_hora,
                            (quantities[`dia-${index}`] || 0) *
                              (quantities[`semana-${index}`] || 0),
                            quantities[`selectedMonths-${index}`] || 12,
                            quantities[`markupP-${index}`] || 0
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
                <TotalRow>
                  <td colSpan={8} className="">
                    TOTAL CONSULTORIA SST PRESENCIAL
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(custoTotalPresencialM)}
                  </td>
                </TotalRow>
              </tbody>
            </table>
          </div>
          <div>
            <TableTitle
              onClick={() => toggleSection("online")}
              $active={openSections?.online}
            >
              SERVIÇOS EM PROMOÇÃO DA SAÚDE (ONLINE)
              <ExpandedIcon size="24px" />
            </TableTitle>

            <table
              className="table table-striped table-hover"
              style={{ tableLayout: "fixed" }}
            >
              {openSections.online ? (
                <thead className="thead-light" style={{ fontSize: "13px" }}>
                  <tr
                    style={{ wordBreak: "break-word", verticalAlign: "middle" }}
                  >
                    <th scope="col">Serviços</th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "12%" }}
                    >
                      Modalidade
                    </th>
                    <th scope="col" style={{ width: "9%" }}>
                      Visitas/Dia
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "8%" }}
                    >
                      Qtd/Smn
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "6%" }}
                    >
                      H/Smn
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "10%" }}
                    >
                      Custo Hora
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "12%" }}
                    >
                      Qtd Meses
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "8%" }}
                    >
                      H/M
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "9%" }}
                    >
                      Margem
                    </th>
                    <th
                      className="text-center"
                      scope="col"
                      style={{ width: "12%" }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {openSections.online
                  ? filteredTextOnline.map((value, index) => (
                      <tr
                        key={index}
                        style={{
                          wordBreak: "break-word",
                          fontSize: "13px",
                          verticalAlign: "middle",
                        }}
                      >
                        <td>{value.servico}</td>
                        <td className="text-center">Online</td>
                        <td className="text-center">-</td>
                        <td className="text-center">-</td>
                        <td className="text-center">-</td>
                        <td className="text-center">
                          {maskCurrency(value.custo_hora)}
                        </td>
                        <td className="text-center">
                          <select
                            className="form-select"
                            value={
                              quantities[`selectedMonthsOnline-${index}`] ||
                              "12"
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "selectedMonthsOnline",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "o", index)
                              )
                            }
                          >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="36">36</option>
                          </select>
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            type="number"
                            className="form-control"
                            value={quantities[`semanaOnline-${index}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "semanaOnline",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "o", index)
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            placeholder={0}
                            disabled={
                              !quantities[`semanaOnline-${index}`] ||
                              quantities[`semanaOnline-${index}`] === "0"
                            }
                            type="number"
                            className="form-control"
                            value={quantities[`markupO-${index}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                e.target.value,
                                "markupO",
                                value.descricao,
                                value.servico,
                                calculatePrice(value, "o", index)
                              )
                            }
                          />
                        </td>

                        <td className="text-center">
                          {maskCurrency(
                            calculateMarkup(
                              value.custo_hora,
                              quantities[`semanaOnline-${index}`] || 0,
                              quantities[`markupO-${index}`] || 0
                            )
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
                <TotalRow>
                  <td colSpan={8} className="">
                    TOTAL CONSULTORIA SST ONLINE
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(custoTotalOnlineM)}
                  </td>
                </TotalRow>
              </tbody>
            </table>
          </div>

          <DeslocamentoTable
            setDeslocamento={setDeslocamento}
            sps={1}
            refresh={refresh}
            openSections={openSections}
            toggleSection={toggleSection}
            toggle
            cartType="sps"
          />

          <DeslocamentoProprio
            setDeslocamento={setDeslocamentoProprio}
            refresh={refresh}
            openSections={openSections}
            toggleSection={toggleSection}
            toggle
          />
        </div>
      ) : null}
    </>
  );
};

export default SPS;
