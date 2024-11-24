import Cookies from "js-cookie";
import Loading from "./Loading";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { getAllDeslocamentosProprios } from "../resources/calculadora";
import { toast } from "react-toastify";
import { maskCurrency } from "../utils/masks";
import { ExpandedIcon } from "../icons/icons";
import { validateToken } from "../utils/validateToken";

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

const DeslocamentoTable = ({
  setDeslocamento,
  refresh = false,
  openSections,
  toggleSection,
}) => {
  const token = Cookies.get("token");
  const [quantities, setQuantities] = useState({});
  const localStoragePrecos = localStorage.getItem("deslocamentoProprio")
    ? JSON.parse(localStorage.getItem("deslocamentoProprio"))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [isLoading, setIsLoading] = useState(false);
  const [custosDeslocamento, setCustosDeslocamento] =
    useState(localStoragePrecos);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, sps: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productName, value, price, category) => {
    const calculateTotal = () => {
      const markup =
        category === "markup"
          ? value
          : quantities[`markup-${productName}`] || 0;
      const quantity =
        category === "quantity"
          ? value
          : quantities[`quantity-${productName}`] || 0;
      const base = markup * quantity * price;
      return Math.round(base * 100) / 100;
    };

    const cart = getCart();
    let cartSps = cart.sps || [];

    const total = calculateTotal();

    const existingItem = cartSps.find((item) => item.name === productName);

    if (existingItem) {
      if (category === "markup") {
        existingItem.markup = value;
      } else {
        existingItem.quantity = value;
      }
      existingItem.total = total;
    } else {
      cartSps.push({
        category: "deslocamento",
        name: productName,
        quantity: value,
        value: price,
        total: total,
      });
    }

    setCart(cartSps);

    setQuantities((prev) => ({
      ...prev,
      [`${category}-${productName}`]: value,
    }));
  };

  const filteredVeiculos = custosDeslocamento.filter(
    (value) => value.veiculo !== "Horas de deslocamento TST"
  );

  const totalVeiculoCost = filteredVeiculos.reduce((total, item) => {
    const quantity = quantities[`quantity-${item.veiculo}`] || 0;
    const markupValue = quantities[`markup-${item.veiculo}`] || 0;
    return total + quantity * markupValue * item.indice;
  }, 0);

  useEffect(() => {
    setDeslocamento(totalVeiculoCost);
  }, [totalVeiculoCost, setDeslocamento]);

  useEffect(() => {
    if ((token && custosDeslocamento.length === 0) || refresh) {
      setIsLoading(true);
      getAllDeslocamentosProprios(token)
        .then((response) => {
          setCustosDeslocamento(response.data.results);
          localStorage.setItem(
            "deslocamentoProprio",
            JSON.stringify(response.data.results)
          );
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar deslocamentos."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, custosDeslocamento.length, refresh]);

  useEffect(() => {
    if (localStorageCart?.sps?.length) {
      const newQuantities = {};
      localStorageCart.sps.forEach((item) => {
        newQuantities[`quantity-${item.name}`] = item.quantity;
        newQuantities[`markup-${item.name}`] = item.markup;
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.sps?.length]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5">
          <>
            <TableTitle
              onClick={() => toggleSection("proprio")}
              $active={openSections?.proprio}
            >
              DESLOCAMENTO VEÍCULO PRÓPRIO
              <ExpandedIcon size="24px" />
            </TableTitle>
            <table className="table table-striped table-hover">
              {openSections.proprio ? (
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Veículo</th>
                    <th className="text-center">Índice</th>
                    <th className="text-center" style={{ width: "20%" }}>
                      KM
                    </th>
                    <th className="text-center" style={{ width: "20%" }}>
                      Combustível
                    </th>
                    <th className="text-center" style={{ width: "15%" }}>
                      Total
                    </th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {openSections.proprio
                  ? filteredVeiculos.map((value, index) => (
                      <tr key={index} style={{ verticalAlign: "middle" }}>
                        <td>{value.veiculo}</td>
                        <td className="text-center">{value.indice}</td>
                        <td className="text-center">
                          <input
                            min={0}
                            step={0.1}
                            placeholder={0}
                            type="number"
                            className="form-control"
                            value={
                              quantities[`quantity-${value.veiculo}`] ?? ""
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                value.veiculo,
                                e.target.value,
                                value.indice,
                                "quantity"
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            min={0}
                            step={0.1}
                            disabled={
                              !quantities[`quantity-${value.veiculo}`] ||
                              quantities[`quantity-${value.veiculo}`] === "0"
                            }
                            placeholder={0}
                            type="number"
                            className="form-control"
                            value={quantities[`markup-${value.veiculo}`] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                value.veiculo,
                                e.target.value,
                                value.indice,
                                "markup"
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {maskCurrency(
                            (quantities[`quantity-${value.veiculo}`] || 0) *
                              (quantities[`markup-${value.veiculo}`] || 0) *
                              value.indice
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
                <TotalRow>
                  <td className="" colSpan={4}>
                    TOTAL VEÍCULO
                  </td>
                  <td className="text-end">{maskCurrency(totalVeiculoCost)}</td>
                </TotalRow>
              </tbody>
            </table>
          </>
        </div>
      )}
    </>
  );
};

export default DeslocamentoTable;
