import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { getAllTelemedicina } from "../resources/calculadora";
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

const Telemedicina = ({ search }) => {
  const token = Cookies.get("token");
  const localStoragePrecos = localStorage.getItem("telemedicina")
    ? JSON.parse(localStorage.getItem("telemedicina"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [selected, setSelected] = useState("custoDR");
  const [isLoading, setIsLoading] = useState(false);
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [quantities, setQuantities] = useState({});

  const [openSections, setOpenSections] = useState({
    telemedicina: true,
  });

  const filteredText = search?.trim().toLowerCase()
    ? precos.filter(({ produto, tipo }) =>
        [produto, tipo].some((text) =>
          text?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : precos;

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllTelemedicina(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem(
            "telemedicina",
            JSON.stringify(response.data.results)
          );
          toast.success(`Telemedicina carregada com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar Telemedicina."
          );
          validateToken(error.response?.status);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (localStorageCart?.telemedicina?.length) {
      const newQuantities = {};
      localStorageCart.telemedicina.forEach((item) => {
        if (item.markup) {
          newQuantities[`markup-${item.name}`] = item.markup;
        }
        if (item.quantity) {
          newQuantities[`qtd-${item.name}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.telemedicina?.length]);

  const total = filteredText.reduce((sum, value) => {
    if (quantities[`markup-${value.produto}`]) {
      return sum + (value[selected] || 0);
    }
    return sum;
  }, 0);

  const totalM = filteredText.reduce((sum, value) => {
    if (quantities[`markup-${value.produto}`]) {
      const margem = (100 - (quantities[`markup-${value.produto}`] || 0)) / 100;
      return sum + (value[selected] || 0) / margem;
    }
    return sum;
  }, 0);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, telemedicina: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    productName,
    description,
    value,
    category,
    price
  ) => {
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartTelemedicina = cart.telemedicina || [];

    const total = calculateTotal(price, value);

    const existingItem = cartTelemedicina.find(
      (item) => item.name === productName
    );

    if (existingItem) {
      if (value === "") {
        cartTelemedicina = cartTelemedicina.filter(
          (item) => !(item.name === productName)
        );
      } else {
        if (category === "qtd") {
          existingItem.quantity = value;
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      }
    } else {
      cartTelemedicina.push({
        name: productName,
        description: description,
        category: category,
        quantity: value,
        value: price,
        total: total,
      });
    }

    setCart(cartTelemedicina);
    setQuantities((prev) => ({
      ...prev,
      [`${category}-${productName}`]: value,
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotalRow = (value) => {
    const quantity = quantities[`qtd-${value.produto}`] || 0;
    const custoBase = value[selected] * quantity;
    const margem = (100 - (quantities[`markup-${value.produto}`] || 0)) / 100;
    return custoBase / margem;
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
                <ValuesAmount>{maskCurrency(total)}</ValuesAmount>
              </div>
              <div>
                <ValuesText>Total Venda: </ValuesText>
                <ValuesAmount>{maskCurrency(totalM)}</ValuesAmount>
              </div>
            </ValuesRow>
          </ValuesContainer>
          <div className="d-flex justify-content-center bg-white">
            <div className="d-flex align-items-center m-3 bg-white">
              <label
                className="mx-2 bg-white"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "rgba(80, 80, 80, 1)",
                }}
              >
                Categoria:
              </label>
              <select
                className="form-select"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="custoDR">Custo DRs</option>
                <option value="industria">
                  Indústria (Trab. e Dependentes)
                </option>
                <option value="naoIndustria">
                  Não Indústria (Trab. e Dependentes)
                </option>
                <option value="vivaMais">
                  Cliente SESI Viva+ (Trab. e Dependentes)
                </option>
              </select>
            </div>
          </div>
          <TableTitle
            onClick={() => toggleSection("telemedicina")}
            $active={openSections?.telemedicina}
          >
            TELEMEDICINA
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table
            className="table table-striped table-hover"
            style={{ tableLayout: "fixed" }}
          >
            {openSections?.telemedicina ? (
              <thead>
                <tr
                  style={{
                    wordBreak: "break-word",
                    fontSize: "13px",
                    verticalAlign: "middle",
                  }}
                >
                  <th>Produto</th>
                  <th>Forma de precificação</th>
                  <th style={{ width: "12%" }}>Quantidade</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Custo
                  </th>
                  <th className="text-center" style={{ width: "11%" }}>
                    Margem
                  </th>
                  <th className="text-center" style={{ width: "12%" }}>
                    Total
                  </th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {openSections?.telemedicina
                ? filteredText.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.produto}</td>
                      <td>{value.tipo}</td>
                      <td>
                        <input
                          min={0}
                          type="number"
                          className="form-control"
                          placeholder={0}
                          value={quantities[`qtd-${value.produto}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.produto,
                              value.descricao,
                              e.target.value,
                              "qtd",
                              value[selected]
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(value[selected])}
                      </td>

                      <td>
                        <input
                          min={0}
                          type="number"
                          disabled={
                            !quantities[`qtd-${value.produto}`] ||
                            quantities[`qtd-${value.produto}`] === "0"
                          }
                          className="form-control"
                          placeholder={0}
                          value={quantities[`markup-${value.produto}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.produto,
                              value.descricao,
                              e.target.value,
                              "markup",
                              value[selected]
                            )
                          }
                        />
                      </td>
                      <td>{maskCurrency(calculateTotalRow(value))}</td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td colSpan={4} className="">
                  TOTAL TELEMEDICINA
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalM)}
                </td>
              </TotalRow>
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
};

export default Telemedicina;
