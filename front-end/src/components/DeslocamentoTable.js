import Cookies from "js-cookie";
import Loading from "../components/Loading";
import { useState, useEffect, useMemo } from "react";
import { getAllDeslocamentos } from "../resources/calculadora";
import { toast } from "react-toastify";
import { maskCurrency } from "../utils/masks";
import styled from "styled-components";
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
  margin-top: 3rem;
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
  openSections,
  toggleSection,
  sps = 0,
  assti = 0,
  refresh = false,
  toggle,
  cartType,
}) => {
  const token = Cookies.get("token");
  const [quantities, setQuantities] = useState({});
  const cacheText = sps
    ? "deslocamentosSPS"
    : assti
    ? "deslocamentosASSTI"
    : "deslocamentos";
  const localStoragePrecos = localStorage.getItem(cacheText)
    ? JSON.parse(localStorage.getItem(cacheText))
    : [];
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [isLoading, setIsLoading] = useState(false);
  const [custosDeslocamento, setCustosDeslocamento] =
    useState(localStoragePrecos);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cartType, cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, [cartType]: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productName, value, price) => {
    const calculateTotal = (quantity, price) => {
      return Math.round(price * quantity * 100) / 100;
    };
    const total = calculateTotal(value, price);
    const cart = getCart();
    let cartDeslocamento = cart[cartType] || [];
    const existingItem = cartDeslocamento.find(
      (item) => item.name === productName
    );
    if (existingItem) {
      if (value === "") {
        cartDeslocamento = cartDeslocamento.filter(
          (item) => !(item.name === productName)
        );
      } else {
        existingItem.quantity = value;
        existingItem.total = total;
      }
    } else {
      cartDeslocamento.push({
        category: "deslocamento",
        name: productName,
        quantity: value,
        value: price,
        total: total,
      });
    }
    setCart(cartType, cartDeslocamento);
    setQuantities((prev) => ({
      ...prev,
      [productName]: value,
    }));
  };

  const calculateTotalCost = useMemo(() => {
    return custosDeslocamento.reduce((total, item) => {
      const quantity = quantities[item.tipo] || 0;
      return total + quantity * item.valor;
    }, 0);
  }, [quantities, custosDeslocamento]);

  useEffect(() => {
    setDeslocamento(calculateTotalCost);
  }, [calculateTotalCost, setDeslocamento]);

  useEffect(() => {
    if ((token && custosDeslocamento.length === 0) || refresh) {
      setIsLoading(true);
      getAllDeslocamentos(token, sps, assti)
        .then((response) => {
          setCustosDeslocamento(response.data.results);
          localStorage.setItem(
            cacheText,
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
  }, [token, sps, assti, cacheText, custosDeslocamento.length, refresh]);

  useEffect(() => {
    if (localStorageCart[cartType]?.length) {
      const newQuantities = {};
      localStorageCart[cartType].forEach((item) => {
        if (item.category === "deslocamento") {
          newQuantities[item.name] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart[cartType]?.length]);

  const handleClick = () => {
    if (toggle) {
      toggleSection("deslocamento");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <TableTitle
            onClick={() => handleClick()}
            $active={openSections?.deslocamento}
          >
            DESLOCAMENTO
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table className="table table-striped table-hover">
            {openSections?.deslocamento || !toggle ? (
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Despesas</th>
                  <th className="text-center" style={{ width: "30%" }}>
                    Custo Unitário
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Quantidade
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Total
                  </th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {openSections?.deslocamento || !toggle
                ? custosDeslocamento.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.tipo}</td>
                      <td className="text-center">
                        {maskCurrency(value.valor)}
                      </td>
                      <td className="text-center">
                        <input
                          min={0}
                          placeholder={0}
                          step={
                            ["Horas de deslocamento TST", "KM"].includes(
                              value.tipo
                            )
                              ? 0.1
                              : 1
                          }
                          type="number"
                          className="form-control"
                          value={quantities[value.tipo] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.tipo,
                              e.target.value,
                              value.valor
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(
                          (quantities[value.tipo] || 0) * value.valor
                        )}
                      </td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td className="" colSpan={3}>
                  TOTAL DESLOCAMENTO
                </td>
                <td className="d-flex justify-content-end">
                  {maskCurrency(calculateTotalCost)}
                </td>
              </TotalRow>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default DeslocamentoTable;
