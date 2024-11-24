import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import styled from "styled-components";
import { FiemsIcon } from "../icons/icons";
import { maskCurrency } from "../utils/masks";

const StyledContainer = styled.div`
  padding: 0 60px;
  margin: 0 auto;
  background-color: white;
  & * {
    font-family: "Carlito", sans-serif;
    font-size: 11px;
    text-align: justify;
    background-color: white;
  }
  & h2 {
    font-weight: 700;
  }
`;

const StyledTitle = styled.h1`
  color: #5b9bd5;
  font-size: 18px;
  text-align: center;
  margin: 1.5rem 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse !important;
  border-spacing: 0;
`;

const StyledCell = styled.td`
  width: ${(props) => (props.$bold ? "15%" : "85%")};
  font-weight: ${(props) => (props.$bold ? 700 : 400)};
  background-color: ${(props) =>
    props.$bold ? "#d9e2f3 !important" : "white"};
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  border-left: ${(props) => (props.$bold ? "1px solid #000" : "")};
  border-bottom: ${(props) => (props.$lastCell ? "1px solid #000" : "")};
  padding: 5px;
`;

const StyledServices = styled.td`
  text-align: center;
  width: ${(props) => (props.$service ? "25%" : "75%")};
  font-weight: ${(props) => (props.$bold ? 700 : 400)};
  background-color: ${(props) =>
    props.$bold ? "#d9e2f3 !important" : "white"};
  border-top: ${(props) => (props.$firstCell ? "1px solid #000" : "")};
  border-right: 1px solid #000;
  border-left: ${(props) => (props.$service ? "1px solid #000" : "")};
  border-bottom: 1px solid #000;
  padding: 5px;
`;

const StyledInvestiment = styled.td`
  text-align: center;
  font-weight: ${(props) => (props.$bold ? 700 : 400)};
  background-color: ${(props) =>
    props.$bold ? "#d9e2f3 !important" : "white"};
  border-top: ${(props) => (props.$firstCell ? "1px solid #000" : "")};
  border-right: 1px solid #000;
  border-left: ${(props) => (props.$service ? "1px solid #000" : "")};
  border-bottom: 1px solid #000;
  padding: 5px;
`;

const StyledTotal = styled.td`
  width: ${(props) => (props.$top ? "35%" : "")};
  background-color: ${(props) => (props.$bg ? "#d9e2f3 !important" : "white")};
  text-align: center;
  font-weight: ${(props) => (props.$bold ? 700 : 400)};
  border-right: 1px solid #000;
  border-top: ${(props) => (props.$top ? "1px solid #000" : "")};
  border-left: ${(props) => (props.$service ? "1px solid #000" : "")};
  border-bottom: 1px solid #000;
  padding: 5px;
`;

const PdfDocument = () => {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};

  const fornecedor = {
    unidade: "SESI - SERVIÇO SOCIAL DA INDÚSTRIA DE MS",
    cnpj: "03.769.599/0012-73",
    contato: "KEILA DA SILVA SANTOS",
    telefone: "",
    email: "KEILA.SANTOS@SESIMS.COM.BR",
  };

  const cliente = {
    razaoSocial: "",
    cnpj: "",
    endereco: ", ;",
    contato: "WILSON JOSE SARTORI",
    telefone: "(44) 9114-6021",
    email: "WILSONSARTORI@HOTMAIL.COM",
  };

  const total = Object.values(cart).reduce((grandTotal, values) => {
    const sum = values.reduce(
      (subTotal, item) => subTotal + item.total * (item.quantity ?? 1),
      0
    );
    return grandTotal + sum;
  }, 0);

  const pdfRef = useRef();
  const watermarkRef = useRef();

  const svgToBase64Image = async (svgElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = svgUrl;

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const base64Image = canvas.toDataURL("image/png");
        URL.revokeObjectURL(svgUrl);
        resolve(base64Image);
      };
    });
  };

  const generatePdf = async () => {
    const element = pdfRef.current;
    const watermarkElement = watermarkRef.current.querySelector("svg");
    const watermarkImgData = await svgToBase64Image(watermarkElement);

    const options = {
      margin: [25, 0, 46, 0],
      filename: "proposta.pdf",
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { avoid: "tr", mode: "css" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const pageCount = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();

        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.addImage(
            "/assets/building.png",
            "PNG",
            pageWidth - 70,
            pageHeight - 46,
            50,
            46
          );

          pdf.addImage(watermarkImgData, "PNG", 25, 10, 42, 10);

          pdf.setFillColor(161, 179, 212);
          pdf.rect(15, 0, 64, 7, "F");
          pdf.rect(15, pageHeight - 23, 1, 23, "F");
          pdf.setFontSize(10);
          pdf.setTextColor(147, 183, 215);
          pdf.setFont("helvetica", "bold");
          pdf.text("SISTEMA FIEMS", 21, pageHeight - 20);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(156, 156, 155);
          pdf.text(
            "Av. Afonso Pena, 1.206 | Bairro Amambaí",
            21,
            pageHeight - 16
          );
          pdf.text(
            "79.005-901 | Campo Grande/MS | Brasil",
            21,
            pageHeight - 12
          );
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(162, 193, 221);
          pdf.text("www.fiems.com.br", 21, pageHeight - 8);
        }
      })
      .save();
  };

  return (
    <div
      style={{ backgroundColor: "white", height: "100vh" }}
      ref={watermarkRef}
      onClick={generatePdf}
    >
      <StyledContainer ref={pdfRef}>
        <div ref={watermarkRef} style={{ display: "none" }}>
          <FiemsIcon />
        </div>
        <StyledTitle>Proposta</StyledTitle>
        <section>
          <h2>1. APRESENTAÇÃO</h2>
          <p>
            Para atender as indústrias e empresas com seus desafios, o portfólio
            do Sistema <strong>FIEMS</strong> está estruturado com as melhores
            soluções em educação, segurança do trabalho, promoção da saúde,
            gestão, tecnologia e inovação.
          </p>
          <p>
            Em caso de aceite dos termos propostos, será emitido contrato de
            prestação de serviço para assinatura e formalização do atendimento.
          </p>
        </section>

        <section className="mt-3">
          <h2>2. FORNECEDOR(ES)</h2>
          <StyledTable>
            <tbody>
              {Object.entries(fornecedor).map(([key, value]) => (
                <tr key={key}>
                  <StyledCell $bold $lastCell={key === "email"}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </StyledCell>
                  <StyledCell $lastCell={key === "email"}>{value}</StyledCell>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </section>

        <section className="mt-3">
          <h2>3. CLIENTE</h2>
          <StyledTable>
            <tbody>
              {Object.entries(cliente).map(([key, value]) => (
                <tr key={key}>
                  <StyledCell $bold $lastCell={key === "email"}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </StyledCell>
                  <StyledCell $lastCell={key === "email"}>{value}</StyledCell>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </section>

        <section className="mt-3">
          <h2>4. SERVIÇOS PROPOSTOS</h2>
          <StyledTable>
            <tbody>
              <tr>
                <StyledServices $bold $service $firstCell>
                  Serviço
                </StyledServices>
                <StyledServices $bold $firstCell>
                  Descrição do Serviço
                </StyledServices>
              </tr>
              {Object.entries(cart).map(([key, values]) => {
                return values.map((item, index) => {
                  return (
                    <tr key={`${key}-${index}`}>
                      <StyledServices $service>{item.name}</StyledServices>
                      <StyledServices>{item.description} </StyledServices>
                    </tr>
                  );
                });
              })}
            </tbody>
          </StyledTable>
        </section>

        <section className="mt-3">
          <h2>5. INVESTIMENTO</h2>

          <p>
            Em contraprestação à execução dos serviços, a CONTRATANTE pagará os
            valores conforme descrito abaixo: O valor total de{" "}
            {maskCurrency(total)} , será faturado conforme descrição abaixo,
            tendo o vencimento até 30 (trinta) dias após emissão da fatura.
          </p>

          <StyledTable>
            <tbody>
              <tr>
                <StyledInvestiment $bold $firstCell $service>
                  Entidade
                </StyledInvestiment>
                <StyledInvestiment $bold $firstCell>
                  Serviço
                </StyledInvestiment>
                <StyledInvestiment $bold $firstCell>
                  Qtd
                </StyledInvestiment>
                <StyledInvestiment $bold $firstCell>
                  Valor Unitário (R$)
                </StyledInvestiment>
                <StyledInvestiment $bold $firstCell>
                  Valor Total (R$)
                </StyledInvestiment>
              </tr>
              {Object.entries(cart).map(([key, values]) => {
                return values.map((item, index) => {
                  return (
                    <tr key={`${key}-${index}`}>
                      <StyledServices $service>SESI</StyledServices>
                      <StyledServices>{item.name} </StyledServices>
                      <StyledServices>{item.quantity ?? 1}</StyledServices>
                      <StyledServices>
                        {maskCurrency(item.total)}
                      </StyledServices>
                      <StyledServices>
                        {maskCurrency((item.quantity ?? 1) * item.total)}
                      </StyledServices>
                    </tr>
                  );
                });
              })}
              <tr>
                <StyledTotal colSpan={4} $bold $service>
                  Valor Total
                </StyledTotal>
                <StyledTotal>{maskCurrency(total)}</StyledTotal>
              </tr>
            </tbody>
          </StyledTable>

          <StyledTable className="mt-5">
            <tbody>
              <tr>
                <StyledTotal $bold $service $top $bg>
                  Valor total
                </StyledTotal>
                <StyledTotal $lastCell $top>
                  {maskCurrency(total)}
                </StyledTotal>
              </tr>
              <tr>
                <StyledTotal $bold $service $bg>
                  Forma de Pagamento
                </StyledTotal>
                <StyledTotal $lastCell>Depósito</StyledTotal>
              </tr>
              <tr>
                <StyledTotal $bold $service $bg>
                  Condição de Pagamento
                </StyledTotal>
                <StyledTotal $lastCell></StyledTotal>
              </tr>
            </tbody>
          </StyledTable>

          <StyledTable className="mt-5">
            <tbody>
              <tr>
                <StyledTotal $bold $service $top $bg>
                  Validade da Proposta
                </StyledTotal>
                <StyledTotal $lastCell $top>
                  30 dias
                </StyledTotal>
              </tr>
            </tbody>
          </StyledTable>

          <h3 className="mt-4 text-center">21 DE NOVEMBRO DE 2024</h3>

          <h3 className="mt-4">ACEITE</h3>

          <StyledTable className="mt-4">
            <tbody>
              <tr>
                <StyledTotal $bold $service $top $bg>
                  Data do Aceite
                </StyledTotal>
                <StyledTotal $lastCell $top></StyledTotal>
              </tr>
              <tr>
                <StyledTotal $bold $service $bg>
                  Nome completo do Responsável pelo Aceite
                </StyledTotal>
                <StyledTotal $lastCell></StyledTotal>
              </tr>
              <tr>
                <StyledTotal $bold $service $bg>
                  Cargo do Responsável pelo Aceite
                </StyledTotal>
                <StyledTotal $lastCell></StyledTotal>
              </tr>
              <tr>
                <StyledTotal $bold $service $bg>
                  Assinatura do Responsável pelo Aceite
                </StyledTotal>
                <StyledTotal $lastCell></StyledTotal>
              </tr>
            </tbody>
          </StyledTable>
        </section>
      </StyledContainer>
    </div>
  );
};

export default PdfDocument;
