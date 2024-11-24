import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import VideoModal from "../components/VideoModal";
import { formatDateBr } from "../utils/date";
import ButtonArrow from "../components/ButtonArrow";

const Container = styled.div`
  position: relative;
`;

const IconContainer = styled.div`
  display: flex;
  padding: 0.5rem 0;
`;

const ProductImage = styled.img`
  position: absolute;
  top: -30px;
  right: 100px;
  width: 65px;
  background-color: transparent !important;
`;

const TabContent = styled.div`
  position: absolute;
  top: 35px;
  left: 80px;
  right: 80px;
  border-radius: 16px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  background-color: white;
`;

const CardDiv = styled.div`
  background-color: white;
  border-radius: 16px;

  & * {
    background-color: white;
  }

  & > div:nth-child(1) {
    border-radius: 16px;
    & > div:nth-child(1) {
      border-radius: 16px;
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  font-size: 13px;
  font-weight: 700;
  top: -15px;
  left: 22px;
  background-color: #53ae32;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  color: white;
`;

const Category = styled.div`
  background-color: #f5f9ff;

  h5 {
    color: #202244;
    font-weight: 700;
  }
`;

const ProductInfo = styled.div`
  margin: ${(props) =>
    props.$categoria ? "20px 1.5rem 0 1.5rem" : "0 1.5rem 0 1.5rem"};
  padding: 0 1.5rem;
  font-size: ${(props) => (props.$categoria ? "18px" : "14px")};
  font-weight: 700;
  color: ${(props) => (props.$categoria ? "#53ae32" : "#202244")};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem 0 0.5rem;
  font-size: 11px;
  font-weight: 800;
  color: #202244;
`;

const TabButton = styled.div`
  flex: ${(props) => (props.$full ? 8 : 4)};
  text-align: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0;
  background-color: ${(props) =>
    props.$selected ? "rgba(232, 241, 255, 1)" : "rgba(245, 249, 255, 1)"};
`;

const AboutText = styled.div`
  font-size: 13px;
  padding: ${(props) => (props.$bold ? "0.5rem 0" : "0")};
  font-weight: ${(props) => (props.$bold ? 800 : 500)};
  color: rgba(32, 34, 68, 1);
`;

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;

  & div {
    font-size: 11px;
    font-weight: 700;
    color: rgba(160, 164, 171, 1);
  }
  & span {
    font-size: 10px;
    font-weight: 600;
    color: rgba(160, 164, 171, 1);
  }
  & a {
    font-size: 10px;
    font-weight: 600;
    color: rgba(22, 65, 148, 1);
    text-decoration: none;
  }
`;

const OdsSection = styled.div`
  display: flex;
  align-items: center;
`;

const BenefitsSection = styled.div`
  position: absolute;
  width: 100%;
  background-color: #f5f9ff;
  border-radius: 0;
  margin: 1rem 0;
`;

const BenefitsText = styled.p`
  color: rgba(32, 34, 68, 1);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Icon = styled.img`
  width: 16px;
`;

const OdsIcon = styled.img`
  margin: 2px;
  width: 67px;
  transition: transform 0.3s ease;
  max-width: 100%;
  max-height: 100%;

  &:hover {
    transform: scale(3.5);
  }
`;

const About = styled.div`
  padding: 0 3rem 0.5rem 3rem;
  border-radius: 16px;
`;

const ProductApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {};
  const [selected, setSelected] = useState("Sobre");
  const handleGoBack = () => {
    navigate(-1);
  };

  const calculatorRoute = () => {
    switch (product.categoria) {
      case "Treinamentos":
        return ["Cursos", product.produto];
      case "Segurança do Trabalho":
        return ["Precificação SST", ""];
      case "Serviços de Promoção a Saúde":
        return ["SPS", ""];
      case "Consultoria em SST":
        return product.id === 81 ? ["ASSTI", ""] : ["Precificação SST", ""];
      case "Saúde Ocupacional":
        return product.id === 96 || product.id === 97
          ? ["Precificação SST", ""]
          : ["Telemedicina", ""];
      case "Softwares de gestão em SST":
        return product.id === 79 ? ["Mentis", ""] : ["Consultorias", ""];
      case "Consultas e Exames":
        return ["Exames", ""];
      default:
        return ["Precificação SST", ""];
    }
  };

  const importOdsIcon = (odsNumber) => {
    const icons = {
      "01": "/assets/ods01.svg",
      "02": "/assets/ods02.svg",
      "03": "/assets/ods03.svg",
      "04": "/assets/ods04.svg",
      "05": "/assets/ods05.svg",
      "06": "/assets/ods06.svg",
      "07": "/assets/ods07.svg",
      "08": "/assets/ods08.svg",
      "09": "/assets/ods09.svg",
      10: "/assets/ods10.svg",
      11: "/assets/ods11.svg",
      12: "/assets/ods12.svg",
      13: "/assets/ods13.svg",
      14: "/assets/ods14.svg",
      15: "/assets/ods15.svg",
      16: "/assets/ods16.svg",
      17: "/assets/ods17.svg",
      18: "/assets/ods18.svg",
    };
    return icons[odsNumber.ods];
  };

  const verifyType = (ods) => {
    if (typeof ods === "string") {
      return JSON.parse(ods);
    } else {
      return ods;
    }
  };

  return (
    <div>
      <Container>
        <div className="bg-dark" style={{ height: "250px" }}>
          <Button
            variant="link"
            className="text-left mt-5"
            onClick={handleGoBack}
          >
            <img
              src="/assets/leftArrowWhite.svg"
              alt="Voltar"
              className="bg-dark ms-3"
            />
          </Button>
        </div>
        <TabContent>
          <CardDiv>
            <div>
              <div className="p-0 m-0">
                <div className="d-flex justify-content-between">
                  {product.subsidio ? (
                    <ProductImage src="/assets/selo.svg" alt="Selo" />
                  ) : null}
                  <Badge>{product?.linhaNegocio}</Badge>
                  <VideoModal
                    url={product?.link?.url}
                    productName={product?.produto}
                  />
                </div>
                <div>
                  <ProductInfo $categoria={1}>{product?.categoria}</ProductInfo>
                  {product.familia ? (
                    <ProductInfo>{product.familia}</ProductInfo>
                  ) : null}
                  <ProductInfo>{product?.produto}</ProductInfo>
                </div>
                {product?.modalidade ? (
                  <div className="d-flex px-4 mx-4">
                    {product?.horas ? (
                      <>
                        <IconContainer>
                          <Icon src="/assets/clockIcon.svg" alt="Horas" />

                          <Details>{product.horas} Horas</Details>
                        </IconContainer>
                        <div className="mx-2">|</div>
                      </>
                    ) : null}
                    <IconContainer>
                      <Icon src="/assets/hatIcon.svg" alt="Tipo" />
                      <Details>{product?.modalidade}</Details>
                    </IconContainer>
                  </div>
                ) : null}

                <div className="d-flex align-items-center mt-2">
                  <TabButton
                    $selected={selected === "Sobre" ? 1 : 0}
                    onClick={() => setSelected("Sobre")}
                  >
                    Sobre
                  </TabButton>
                  <TabButton
                    $full={1}
                    $selected={selected === "Conteúdo" ? 1 : 0}
                    onClick={() => setSelected("Conteúdo")}
                  >
                    Conteúdo programático
                  </TabButton>
                </div>
                <About>
                  {selected === "Sobre" ? (
                    <div>
                      <AboutText $bold={1}>O QUE É:</AboutText>
                      <AboutText>{product?.descricao}</AboutText>
                      <AboutText $bold={1}>COMO FUNCIONA:</AboutText>
                      <AboutText>{product?.funcionamento}</AboutText>
                      <AboutText $bold={1}>PÚBLICO-ALVO:</AboutText>
                      <AboutText>{product?.publicoAlvo}</AboutText>
                      {product?.lei ? (
                        <>
                          <AboutText $bold={1}>
                            ATENDIMENTO À LEGISLAÇÃO:
                          </AboutText>
                          <AboutText>{product?.lei}</AboutText>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <div className="py-3">
                        <img
                          className="pdfIcon"
                          src="/assets/pdfIcon.svg"
                          alt="Pdf"
                        />
                      </div>
                      <ContentText>
                        <div>{product.produto}</div>
                        <span>{formatDateBr(product.createdAt)}</span>
                        <a href="/.">Download</a>
                      </ContentText>
                    </div>
                  )}
                </About>
              </div>
            </div>
          </CardDiv>
          <BenefitsSection>
            <div className="position-relative">
              {product?.entregaveis ? (
                <Category>
                  <h5>Entregáveis</h5>
                  <BenefitsText>{product?.entregaveis}</BenefitsText>
                </Category>
              ) : null}
              {product?.prazoEntrega ? (
                <Category>
                  <h5>Prazo de Entrega</h5>
                  <BenefitsText>{product?.prazoEntrega}</BenefitsText>
                </Category>
              ) : null}
              {product?.beneficios ? (
                <Category>
                  <h5>Benefícios e Impactos</h5>
                  <BenefitsText>{product?.beneficios}</BenefitsText>
                </Category>
              ) : null}
              <OdsSection>
                <Category>
                  <h5>ODSs vinculadas</h5>
                  <div className="mb-2">
                    {verifyType(product?.ods)?.map((value) => (
                      <OdsIcon
                        key={value.ods}
                        src={importOdsIcon(value)}
                        alt={`ODS${value}`}
                      />
                    ))}
                  </div>
                </Category>
              </OdsSection>

              <ButtonArrow
                width="w-50"
                text="Calcular serviço"
                onClick={() =>
                  navigate("/calculadoras", {
                    state: {
                      product: calculatorRoute(),
                    },
                  })
                }
              />
            </div>
          </BenefitsSection>
        </TabContent>
      </Container>
    </div>
  );
};

export default ProductApp;
