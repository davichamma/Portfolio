import React from "react";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import Calculadora from "../views/Calculadora";
import Consultoria from "../views/Consultoria";
import SPS from "../views/SPS";
import Exames from "../views/Exames";
import ASSTI from "../views/ASSTI";
import Mentis from "../views/Mentis";
import Cursos from "../views/Cursos";
import Telemedicina from "../views/Telemedicina";
import Odontologia from "../views/Odontologia";
import BusinessInteligence from "../views/BusinessInteligence";
import HomeApp from "../views/HomeApp";
import SearchApp from "../views/Search";
import NewServicesApp from "../views/NewServices";
import ServicesCatalog from "../views/ServicesCatalog";
import ProductApp from "../views/ProductApp";
import Suggest from "../views/Suggest";
import Calculators from "../views/Calculators";
import PdfDocument from "../components/PdfDocument";

const AppRoutes = () => {
  const verifyToken = () => {
    return Cookies.get("token");
  };
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/homeapp" element={verifyToken() ? <HomeApp /> : <Home />} />

      <Route
        path="/searchapp"
        element={verifyToken() ? <SearchApp /> : <Home />}
      />
      <Route
        path="/newservicesapp"
        element={verifyToken() ? <NewServicesApp /> : <Home />}
      />
      <Route
        path="/servicescatalog"
        element={verifyToken() ? <ServicesCatalog /> : <Home />}
      />
      <Route
        path="/productapp"
        element={verifyToken() ? <ProductApp /> : <Home />}
      />
      <Route path="/suggest" element={verifyToken() ? <Suggest /> : <Home />} />
      <Route
        path="/calculadora"
        element={verifyToken() ? <Calculadora /> : <Home />}
      />
      <Route
        path="/calculadoras"
        element={verifyToken() ? <Calculators /> : <Home />}
      />
      <Route
        path="/consultorias"
        element={verifyToken() ? <Consultoria /> : <Home />}
      />
      <Route path="/sps" element={verifyToken() ? <SPS /> : <Home />} />
      <Route path="/exames" element={verifyToken() ? <Exames /> : <Home />} />
      <Route path="/assti" element={verifyToken() ? <ASSTI /> : <Home />} />
      <Route path="/mentis" element={verifyToken() ? <Mentis /> : <Home />} />
      <Route path="/cursos" element={verifyToken() ? <Cursos /> : <Home />} />
      <Route
        path="/telemedicina"
        element={verifyToken() ? <Telemedicina /> : <Home />}
      />
      <Route
        path="/odontologia"
        element={verifyToken() ? <Odontologia /> : <Home />}
      />
      <Route path="/pdf" element={verifyToken() ? <PdfDocument /> : <Home />} />
      <Route
        path="/bi"
        element={verifyToken() ? <BusinessInteligence /> : <Home />}
      />
    </Routes>
  );
};

export default AppRoutes;
