import React, { useState } from "react";
import styled from "styled-components";
import { maskCurrency } from "../utils/masks";

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

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.5s ease-in-out;
  z-index: 1050;
  overflow-y: auto; /* or use overflow-y: scroll; */
  max-height: 100vh; /* Adjust this to control the visible height */

  &.open {
    transform: translateX(0);
  }
`;

const Title = styled.h3`
  padding: 1rem;
  font-weight: 700;
  font-size: 21px;
  background-color: white;
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

const cartOptions = [
  "sst",
  "consultorias",
  "cursos",
  "sps",
  "exames",
  "assti",
  "mentis",
  "telemedicina",
  "odontologia",
];

const CartNav = ({ cartOpen, cartRef }) => {
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [openSections, setOpenSections] = useState({
    sst: true,
    consultorias: true,
    cursos: true,
    sps: true,
    exames: true,
    assti: true,
    mentis: true,
    telemedicina: true,
    odontologia: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotalRow = (arr) => {
    return arr.reduce(
      (sum, value) => sum + value.total,

      0
    );
  };

  const calculateTotal = (type) => {
    return cartOptions.reduce((total, item) => {
      const cartItems = localStorageCart[item] || [];
      return (
        total +
        cartItems.reduce(
          (sum, value) =>
            sum +
            (type === "deslocamento" && value.category !== "deslocamento"
              ? 0
              : value.total),
          0
        )
      );
    }, 0);
  };

  return (
    <Container
      className={`right-navbar ${cartOpen ? "open" : ""}`}
      ref={cartRef}
    >
      <Title>Produtos</Title>

      <div className="d-flex justify-content-between sticky-top flex-column">
        <ValuesContainer>
          <ValuesRow>
            <div>
              <ValuesText>Deslocamento:</ValuesText>
              <ValuesAmount>
                {maskCurrency(calculateTotal("deslocamento"))}
              </ValuesAmount>
            </div>
            <div>
              <ValuesText>Valor Total:</ValuesText>
              <ValuesAmount>{maskCurrency(calculateTotal())}</ValuesAmount>
            </div>
          </ValuesRow>
        </ValuesContainer>
      </div>

      {cartOptions.map((item) => {
        return (
          <div key={item}>
            {localStorageCart[item] ? (
              <div className="m-3">
                <TableTitle
                  onClick={() => toggleSection(item)}
                  $active={openSections[item]}
                >
                  {item.toLocaleUpperCase()}
                </TableTitle>
                <div>
                  <table className="table table-striped table-hover">
                    {openSections[item] ? (
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th className="text-center">Qtd</th>
                          <th className="text-center">Valor</th>
                          <th className="text-center">Margem</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                    ) : null}

                    <tbody>
                      {openSections[item]
                        ? localStorageCart[item]?.map((produto) => (
                            <tr className="align-middle" key={produto.name}>
                              <td>
                                {["Moto", "Carro"].includes(produto.name)
                                  ? `Deslocamento - ${produto.name}`
                                  : produto.name}
                              </td>
                              <td className="text-center">
                                {produto.quantity ? produto.quantity : 1}
                              </td>
                              <td className="text-center">
                                {["Moto", "Carro"].includes(produto.name)
                                  ? maskCurrency(produto.markup)
                                  : maskCurrency(produto.value)}
                              </td>
                              <td className="text-center">
                                {["Moto", "Carro"].includes(produto.name)
                                  ? produto.value
                                  : produto.markup
                                  ? `${produto.markup}%`
                                  : "0"}
                              </td>
                              <td className="text-center">
                                {maskCurrency(produto.total)}
                              </td>
                            </tr>
                          ))
                        : null}
                      <TotalRow>
                        <td colSpan={3} className="">
                          TOTAL
                        </td>
                        <td colSpan={2} className="text-end">
                          {maskCurrency(
                            calculateTotalRow(localStorageCart[item])
                          )}
                        </td>
                      </TotalRow>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </Container>
  );
};

export default CartNav;
