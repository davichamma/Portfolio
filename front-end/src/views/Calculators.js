import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNav from "../components/SideNav";
import InputWithIcon from "../components/InputWithIcon";
import styled from "styled-components";
import Footer from "../components/Footer";
import Calculadora from "../views/Calculadora";
import Consultoria from "../views/Consultoria";
import Cursos from "../views/Cursos";
import SPS from "../views/SPS";
import Exames from "../views/Exames";
import ASSTI from "../views/ASSTI";
import Mentis from "../views/Mentis";
import Telemedicina from "../views/Telemedicina";
import Odontologia from "../views/Odontologia";
import { CartIcon } from "../icons/icons";
import CartNav from "../components/CartNav";

const Header = styled.div`
  margin: 3rem 2rem 3rem 0;
  display: flex;
  align-items: center;
  padding-left: 5rem;
`;

const BackIcon = styled.img`
  width: 30px;
  cursor: pointer;
`;

const CartContainer = styled.div`
  position: absolute;
  right: 50px;

  & * {
    border-radius: 16px;
    padding: 0.5rem 0.7rem 0.5rem 0.5rem;
    background-color: red;
  }
`;

const CategoryText = styled.span`
  margin-left: 0.5rem;
  font-size: 21px;
  font-weight: 700;
`;

const Title = styled.p`
  margin: 1rem 0;
  font-size: 21px;
  font-weight: 700;
  color: rgba(32, 34, 68, 1);
  text-align: center;
  background-color: white;
`;

const CalculatorContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem 1.5rem;
  background-color: white;
  border-radius: 16px;
`;

const Calculators = () => {
  const location = useLocation();
  const cartRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const product = location?.state?.product;
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState(product ? product[1] : "");
  const [active, setActive] = useState(
    product ? product[0] : "Precificação SST"
  );

  const toggleNavbar = () => {
    setNavOpen(!navOpen);
  };
  const toggleCart = () => {
    setCartOpen(!navOpen);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    if (navOpen || cartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navOpen, cartOpen]);

  const componentMap = {
    "Precificação SST": Calculadora,
    Consultorias: Consultoria,
    Cursos: Cursos,
    SPS: SPS,
    Exames: Exames,
    ASSTI: ASSTI,
    Mentis: Mentis,
    Telemedicina: Telemedicina,
    Odontologia: Odontologia,
  };

  return (
    <div>
      <Header>
        <BackIcon
          src="/assets/leftArrow.svg"
          alt="Voltar"
          onClick={handleGoBack}
        />
        <CategoryText>Calculadoras</CategoryText>
        <CartContainer
          onClick={() => {
            toggleCart();
          }}
        >
          <CartIcon />
        </CartContainer>
      </Header>

      <div className="d-flex flex-column mt-5 w-100">
        <div className="mx-5">
          <InputWithIcon
            search={search}
            setSearch={setSearch}
            toggleNavbar={toggleNavbar}
            page="calculators"
          />
        </div>
      </div>
      <CartNav cartRef={cartRef} cartOpen={cartOpen} />
      <SideNav
        navOpen={navOpen}
        navRef={navRef}
        active={active}
        setActive={setActive}
      />
      <CalculatorContent>
        <Title>{active}</Title>
        {componentMap[active] &&
          React.createElement(componentMap[active], { search })}
      </CalculatorContent>
      <Footer activeTab={"calculators"} />
    </div>
  );
};

export default Calculators;
