import React from "react";
import { Fiems, Cube, Folder } from "../icons/icons";
import styled from "styled-components";

const SideNavContainer = styled.div`
  background-color: #f5f9ff;
`;

const SideNavBar = styled.div`
  position: fixed;
  top: 0;
  left: -300px;
  width: 25%;
  height: 100%;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.5);
  transform: translateX(-50%);
  transition: transform 0.5s ease-in-out;
  z-index: 1050;
  overflow-y: auto; /* or use overflow-y: scroll; */
  max-height: 100vh; /* Adjust this to control the visible height */

  &.open {
    transform: translateX(300px);
  }
`;

const Logotipo = styled.div`
  display: flex;
  justify-content: center;
  & svg {
    width: 160px;
    height: 150px;
  }
`;

const Calculadoras = styled.div`
  &.active,
  &.active * {
    margin: 0 0.5rem;
    border-radius: 16px;
    background-color: #f5f9ff !important;
  }
  &.active {
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
    margin: 0.5rem 0.5rem;
  }
  & span {
    font-weight: 600;
    font-size: 13px;
  }
`;

function SideNav({ navRef, navOpen, active, setActive }) {
  return (
    <SideNavContainer ref={navRef}>
      <SideNavBar className={`${navOpen ? "open" : ""}`}>
        <Logotipo>
          <Fiems />
        </Logotipo>

        <Calculadoras
          onClick={() => setActive("Precificação SST")}
          className={active === "Precificação SST" ? "active" : ""}
        >
          {active === "Precificação SST" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Precificação SST</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Consultorias")}
          className={active === "Consultorias" ? "active" : ""}
        >
          {active === "Consultorias" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Consultorias</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Cursos")}
          className={active === "Cursos" ? "active" : ""}
        >
          {active === "Cursos" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Cursos</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("SPS")}
          className={active === "SPS" ? "active" : ""}
        >
          {active === "SPS" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">SPS</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Exames")}
          className={active === "Exames" ? "active" : ""}
        >
          {active === "Exames" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Exames</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("ASSTI")}
          className={active === "ASSTI" ? "active" : ""}
        >
          {active === "ASSTI" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">ASSTI</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Mentis")}
          className={active === "Mentis" ? "active" : ""}
        >
          {active === "Mentis" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Mentis</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Telemedicina")}
          className={active === "Telemedicina" ? "active" : ""}
        >
          {active === "Telemedicina" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Telemedicina</span>
        </Calculadoras>
        <Calculadoras
          onClick={() => setActive("Odontologia")}
          className={active === "Odontologia" ? "active" : ""}
        >
          {active === "Odontologia" ? (
            <Folder className="m-3" />
          ) : (
            <Cube className="m-3" />
          )}
          <span className="py-3">Odontologia</span>
        </Calculadoras>
      </SideNavBar>
    </SideNavContainer>
  );
}

export default SideNav;
