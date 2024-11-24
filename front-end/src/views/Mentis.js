import Cookies from "js-cookie";
import Loading from "../components/Loading";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { getAllMentis } from "../resources/calculadora";
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

const Mentis = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const localStoragePrecos = useMemo(
    () => JSON.parse(localStorage.getItem("mentis")) || [],
    []
  );
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [precos, setPrecos] = useState(localStoragePrecos);
  const [deslocamento, setDeslocamento] = useState(0);
  const [quantities, setQuantities] = useState({});

  const [openSections, setOpenSections] = useState({
    mentis: true,
    deslocamento: true,
  });

  useEffect(() => {
    if (token && precos.length === 0) {
      setIsLoading(true);
      getAllMentis(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("mentis", JSON.stringify(response.data.results));
          toast.success(`Mentis carregado com sucesso.`);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar Mentis."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, precos.length]);

  useEffect(() => {
    if (localStorageCart?.mentis?.length) {
      const newQuantities = {};
      localStorageCart.mentis.forEach((item) => {
        if (item.markup) {
          newQuantities[`markup-${item.name}`] = item.markup;
        }
        if (item.quantity) {
          newQuantities[`${item.name}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.mentis?.length]);

  const filteredText = search?.trim().toLowerCase()
    ? precos.filter(({ servico }) =>
        [servico].some((text) =>
          text?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : precos;

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, mentis: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (name, description, value, price, category) => {
    const calculateTotal = (value, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((value / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartMentis = cart.mentis || [];

    const total = calculateTotal(price, value);

    const existingItem = cartMentis.find((item) => item.name === name);

    if (existingItem) {
      if (value === "") {
        cartMentis = cartMentis.filter((item) => !(item.name === name));
      } else {
        if (category === "") {
          existingItem.quantity = value;
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      }
    } else {
      cartMentis.push({
        name: name,
        description: description,
        quantity: value,
        value: Math.round(price * 100) / 100,
        total: total,
      });
    }

    setCart(cartMentis);
    setQuantities((prev) => ({
      ...prev,
      [`${category}${name}`]: value,
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const total = filteredText.reduce(
    (sum, value) => sum + value.valorUnitario * quantities[value.servico] || 0,
    0
  );

  const totalM = filteredText.reduce((sum, value) => {
    const margem = (100 - (quantities[value.servico] || 0)) / 100;
    return (
      sum + (value.valorUnitario * quantities[value.servico] || 0) / margem
    );
  }, 0);

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
          <TableTitle
            onClick={() => toggleSection("mentis")}
            $active={openSections?.mentis}
          >
            MENTIS 360º
            <ExpandedIcon size="24px" />
          </TableTitle>

          <table className="table table-striped table-hover">
            {openSections.mentis ? (
              <thead className="thead-light">
                <tr>
                  <th scope="col" style={{ width: "30%" }}>
                    Atendimento
                  </th>
                  <th
                    className="text-center"
                    scope="col"
                    style={{ width: "10%" }}
                  >
                    Quantidade
                  </th>
                  <th
                    className="text-center"
                    scope="col"
                    style={{ width: "30%" }}
                  >
                    Valor Unitário
                  </th>
                  <th>Margem</th>
                  <th
                    className="text-center"
                    scope="col"
                    style={{ width: "30%" }}
                  >
                    Valor Total
                  </th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {openSections.mentis
                ? filteredText.map((value, index) => (
                    <tr key={index} style={{ verticalAlign: "middle" }}>
                      <td>{value.servico}</td>
                      <td>
                        <input
                          min={0}
                          placeholder={0}
                          step={1}
                          type="number"
                          className="form-control"
                          value={quantities[value.servico] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.servico,
                              value.descricao,
                              e.target.value,
                              value.valorUnitario,
                              ""
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {maskCurrency(value.valorUnitario)}
                      </td>
                      <td>
                        <input
                          min={0}
                          placeholder={0}
                          disabled={
                            !quantities[value.servico] ||
                            quantities[value.servico] === "0"
                          }
                          type="number"
                          className="form-control"
                          value={quantities[`markup-${value.servico}`] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              value.servico,
                              value.descricao,
                              e.target.value,
                              value.valorUnitario,
                              "markup-"
                            )
                          }
                        />
                      </td>
                      <td className="text-center">{maskCurrency(totalM)}</td>
                    </tr>
                  ))
                : null}
              <TotalRow>
                <td colSpan={3} className="">
                  TOTAL MENTIS 360º
                </td>
                <td colSpan={2} className="text-end">
                  {maskCurrency(totalM)}
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
            sps={1}
            cartType="mentis"
          />
        </div>
      ) : null}
    </>
  );
};

export default Mentis;
