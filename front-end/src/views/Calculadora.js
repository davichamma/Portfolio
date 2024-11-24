import Cookies from "js-cookie";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  getAllPrecos,
  getAllAvaliacoesAmbientais,
} from "../resources/calculadora";
import styled from "styled-components";
import { maskCurrency } from "../utils/masks";
import DeslocamentoTable from "../components/DeslocamentoTable";
import { ExpandedIcon } from "../icons/icons";
import { validateToken } from "../utils/validateToken";

const ValuesContainer = styled.div`
  background-color: white;
  padding: 1rem;
  & * {
    background-color: rgba(246, 246, 246, 1);
  }
`;

const ValuesRow = styled.div`
  display: flex;
  justify-content: space-between;
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

const TitleTr = styled.tr`
  background-color: rgba(22, 65, 148, 1);
  border: 1px solid rgba(91, 109, 169, 1);

  & td {
    padding: 1rem;
    background-color: rgba(22, 65, 148, 1);
    font-weight: 700;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);

    &.icon {
      display: flex;
      justify-content: end;
      & svg {
        transform: ${(props) =>
          props.$active ? "rotate(180deg)" : "rotate(0deg)"};
        transition: transform 0.3s ease-in-out;
      }
    }
  }
`;

const Calculadora = ({ search }) => {
  const qtdArray = [
    "Revisões (PGR, PCMSO, AE ou Laudos)",
    "Visita de Monitoramento",
    "Consultoria em NR 10 - Elaboração de Análises de Risco",
    "Consultoria em NR 10 - Elaboração de POP (Procedimento Operacional Padrão)",
    "Consultoria em NR 12 - Apreciação de Risco",
    "Consultoria em NR 12 - Elaboração de Análises de Risco",
    "Consultoria em NR 12 - Elaboração de Procedimentos Operacionais Padrões",
    "Consultoria em NR 12 - Inventário de máquinas",
    "Consultoria em NR 35 - Elaboração de Análise de Risco",
    "Consultoria em NR 35 - Elaboração de Procedimento Operacional Padrão",
    "Consultoria de Gestão Integrada em SST (envio eSocial em SST)",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const [refresh, setRefresh] = useState(false);
  const localStoragePrecos = localStorage.getItem("precos")
    ? JSON.parse(localStorage.getItem("precos"))
    : [];
  const [precos, setPrecos] = useState(localStoragePrecos);
  const localStorageAvaliacoesAmbientais = localStorage.getItem(
    "avaliacoesAmbientais"
  )
    ? JSON.parse(localStorage.getItem("avaliacoesAmbientais"))
    : [];
  const [avaliacoesAmbientais, setAvaliacoesAmbientais] = useState(
    localStorageAvaliacoesAmbientais
  );
  const localStorageCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {};
  const [deslocamento, setDeslocamento] = useState(0);
  const [selected, setSelected] = useState("n");
  const [funcionarios, setFuncionarios] = useState("total11a25");
  const [selectedOptions, setSelectedOptions] = useState({
    documentos: Array(
      precos.filter((item) => item.categoria === "d").length
    ).fill("Não"),
    consultorias: Array(
      precos.filter((item) => item.categoria === "c").length
    ).fill("Não"),
    fisicas: Array(
      avaliacoesAmbientais.filter((item) => item.tipo === "f").length
    ).fill("Não"),
    quimicas: Array(
      avaliacoesAmbientais.filter((item) => item.tipo === "q").length
    ).fill("Não"),
  });
  const [quantities, setQuantities] = useState({});

  const [openSections, setOpenSections] = useState({
    documentacao: true,
    consultoria: true,
    fisicas: true,
    quimicas: true,
    deslocamento: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if ((token && precos.length === 0) || refresh) {
      setIsLoading(true);
      getAllPrecos(token)
        .then((response) => {
          setPrecos(response.data.results);
          localStorage.setItem("precos", JSON.stringify(response.data.results));
          if (!refresh) {
            setSelectedOptions({
              documentos: Array(
                response.data.results.filter((item) => item.categoria === "d")
                  .length
              ).fill("Não"),
              consultorias: Array(
                response.data.results.filter((item) => item.categoria === "c")
                  .length
              ).fill("Não"),
              fisicas: Array(
                avaliacoesAmbientais.filter((item) => item.tipo === "f").length
              ).fill("Não"),
              quimicas: Array(
                avaliacoesAmbientais.filter((item) => item.tipo === "q").length
              ).fill("Não"),
            });
          }
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Erro ao carregar preços."
          );
          validateToken(error.response?.status);
        })
        .finally(() => {
          getAllAvaliacoesAmbientais(token)
            .then((response) => {
              setAvaliacoesAmbientais(response.data.results);
              localStorage.setItem(
                "avaliacoesAmbientais",
                JSON.stringify(response.data.results)
              );
              toast.success(
                `Preços ${refresh ? "atualizados" : "carregados"} com sucesso.`
              );
              if (!refresh) {
                setSelectedOptions((prev) => ({
                  ...prev,
                  fisicas: Array(
                    response.data.results.filter((item) => item.tipo === "f")
                      .length
                  ).fill("Não"),
                  quimicas: Array(
                    response.data.results.filter((item) => item.tipo === "q")
                      .length
                  ).fill("Não"),
                }));
              }
            })
            .catch((error) => {
              toast.error(
                error.response?.data?.message || "Erro ao carregar Avaliações."
              );
              validateToken(error.response?.status);
            })
            .finally(() => {
              setIsLoading(false);
              if (refresh) {
                setRefresh(false);
              }
            });
        });
    }
  }, [token, precos.length, refresh, avaliacoesAmbientais]);

  useEffect(() => {
    if (localStorageCart?.sst?.length) {
      const newQuantities = {};
      localStorageCart.sst.forEach((item) => {
        if (item.markup) {
          newQuantities[
            `${item.category}${
              item.category.includes("markup") ? "" : "-markup"
            }-${item.id}`
          ] = item.markup;
        }
        if (item.quantity && item.id) {
          newQuantities[`${item.category}-${item.id}`] = item.quantity;
        }
      });
      setQuantities((prev) => ({
        ...prev,
        ...newQuantities,
      }));
    }
    // eslint-disable-next-line
  }, [localStorageCart?.sst?.length]);

  const handleSelectChange = (index, value, category) => {
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [category]: prev[category].map((opt, i) => (i === index ? value : opt)),
      };
      return updatedOptions;
    });
  };

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
  const setCart = (cart) => {
    const existingCart = getCart();
    const updatedCart = { ...existingCart, sst: cart };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    index,
    value,
    category,
    description,
    produto,
    price
  ) => {
    const calculateTotal = (price, markup) => {
      const margem = (100 - markup) / 100;
      return Math.round((price / margem) * 100) / 100;
    };

    const cart = getCart();
    let cartSST = cart.sst || [];
    const total = calculateTotal(price, value);
    const existingItem = cartSST.find((item) => item.name === produto);
    if (existingItem) {
      if (value === "") {
        cartSST = cartSST.filter((item) => !(item.name === produto));
      } else {
        if (!category.includes("markup")) {
          existingItem.quantity = value;
        } else {
          existingItem.markup = value;
          existingItem.total = total;
        }
      }
    } else {
      if (category.includes("markup")) {
        cartSST.push({
          id: index,
          category: category,
          name: produto,
          description: description,
          markup: value,
          value: price,
          total: total,
        });
      } else {
        cartSST.push({
          id: index,
          category: category,
          name: produto,
          description: description,
          quantity: value,
          value: price,
          total: price,
        });
      }
    }
    setCart(cartSST);

    setQuantities((prev) => ({
      ...prev,
      [`${category}-${index}`]: value,
    }));
  };

  const getValue = (id) => {
    return localStorageCart.sst.find((item) => item.id === id);
  };

  const filteredPrecos = precos.filter(
    (value) => value.tipo === selected || value.tipo === "b"
  );

  const precosDocumentacao = filteredPrecos.filter(
    (value) => value.categoria === "d"
  );
  const precosConsultoria = filteredPrecos.filter(
    (value) => value.categoria === "c"
  );

  const avaliacoesFisicas = avaliacoesAmbientais.filter(
    (value) => value.tipo === "f"
  );

  const avaliacoesQuimicas = avaliacoesAmbientais.filter(
    (value) => value.tipo === "q"
  );

  const verifyCart = (index, category) => {
    const cart = getCart();
    let cartSST = cart.sst;
    return cartSST?.some(
      (item) => item.id === index && item.category.includes(category)
    );
  };

  const renderRows = (produtos, category) => {
    let totalPrecoMinimo = 0;
    let totalValorInicial = 0;
    let totalHoras = 0;
    const filteredText = search?.trim().toLowerCase()
      ? produtos.filter(({ produto, observacao, avaliacao }) =>
          [produto, observacao, avaliacao].some((text) =>
            text?.toLowerCase().includes(search.toLowerCase())
          )
        )
      : produtos;

    const rows = filteredText?.map((produto, index) => {
      const isSelected = selectedOptions[category][index] === "Sim";

      let total = 0;
      let precoMinimo = 0;
      const margem =
        (100 - (quantities[`${category}-markup-${index}`] || 0)) / 100;

      if (
        isSelected ||
        verifyCart(index, category) ||
        qtdArray.includes(produto.produto) ||
        ["f", "q"].includes(produto.tipo)
      ) {
        if (qtdArray.includes(produto.produto)) {
          const quantity = parseFloat(quantities[`${category}-${index}`]) || 0;
          total = quantity * produto[funcionarios];
          precoMinimo = total;
        } else if (["f", "q"].includes(produto.tipo)) {
          const quantity = parseFloat(quantities[`${category}-${index}`]) || 0;
          total = quantity * produto.valor;
          precoMinimo = total;
        } else {
          total = produto[funcionarios];
          precoMinimo = total;
        }

        totalPrecoMinimo += precoMinimo;
        totalValorInicial += Math.round((total / margem) * 100) / 100;
        totalHoras += Math.round(total / (margem * 120));
      }

      return (
        <tr
          key={index}
          className="align-middle"
          style={{ wordBreak: "break-word" }}
        >
          <td>
            {["f", "q"].includes(produto.tipo)
              ? produto.avaliacao
              : produto.produto}
          </td>
          <td className="text-center">
            {qtdArray.includes(produto.produto) ||
            ["f", "q"].includes(produto.tipo) ? (
              <input
                min={0}
                placeholder={0}
                type="number"
                className="form-control"
                value={quantities[`${category}-${index}`] ?? ""}
                onChange={(e) =>
                  handleQuantityChange(
                    index,
                    e.target.value,
                    category,
                    produto.descricao,
                    ["f", "q"].includes(produto.tipo)
                      ? produto.avaliacao
                      : produto.produto,
                    qtdArray.includes(produto.produto)
                      ? produto[funcionarios]
                      : produto.value
                  )
                }
              />
            ) : (
              <select
                className="form-select"
                value={
                  quantities[`${category}-markup-${index}`]
                    ? "Sim"
                    : selectedOptions[category][index] || "Não"
                }
                onChange={(e) => {
                  handleSelectChange(index, e.target.value, category);
                }}
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            )}
          </td>
          <td className="text-center">{produto.observacao}</td>
          <td className="text-center">
            {isSelected ||
            ["f", "q"].includes(produto.tipo) ||
            verifyCart(index, category)
              ? Math.round(total / (margem * 120))
              : 0}
          </td>
          <td className="text-center">
            {qtdArray.includes(produto.produto) ||
            ["f", "q"].includes(produto.tipo)
              ? maskCurrency(precoMinimo)
              : isSelected
              ? maskCurrency(produto[funcionarios])
              : quantities[`${category}-markup-${index}`]
              ? maskCurrency(getValue(index).value)
              : "R$ 0,00"}
          </td>
          <td className="text-center">
            <input
              min={0}
              placeholder={0}
              disabled={
                quantities[`${category}-markup-${index}`] ? 0 : !precoMinimo
              }
              type="number"
              className="form-control"
              value={quantities[`${category}-markup-${index}`] ?? ""}
              onChange={(e) =>
                handleQuantityChange(
                  index,
                  e.target.value,
                  `${category}-markup`,
                  produto.descricao,
                  ["f", "q"].includes(produto.tipo)
                    ? produto.avaliacao
                    : produto.produto,
                  precoMinimo
                )
              }
            />
          </td>
          <td className="text-center">
            {isSelected || ["f", "q"].includes(produto.tipo)
              ? maskCurrency(Math.round(((total ?? 0) / margem) * 100) / 100)
              : quantities[`${category}-markup-${index}`]
              ? maskCurrency(getValue(index)?.total)
              : "R$ 0,00"}
          </td>
        </tr>
      );
    });

    return { rows, totalPrecoMinimo, totalValorInicial, totalHoras };
  };

  let globalTotalValorInicial = 0;
  let globalTotalHoras = 0;
  let globalTotalPrecoMinimo = 0;

  const {
    rows: docRows,
    totalPrecoMinimo: docTotalPrecoMinimo,
    totalValorInicial: docTotalValorInicial,
    totalHoras: docTotalHoras,
  } = renderRows(precosDocumentacao, "documentos");

  const {
    rows: consultRows,
    totalPrecoMinimo: consultTotalPrecoMinimo,
    totalValorInicial: consultTotalValorInicial,
    totalHoras: consultTotalHoras,
  } = renderRows(precosConsultoria, "consultorias");

  const {
    rows: fisicasRows,
    totalPrecoMinimo: fisicasTotalPrecoMinimo,
    totalValorInicial: fisicasTotalValorInicial,
    totalHoras: fisicasTotalHoras,
  } = renderRows(avaliacoesFisicas, "fisicas");

  const {
    rows: quimicasRows,
    totalPrecoMinimo: quimicasTotalPrecoMinimo,
    totalValorInicial: quimicasTotalValorInicial,
    totalHoras: quimicasTotalHoras,
  } = renderRows(avaliacoesQuimicas, "quimicas");

  globalTotalValorInicial +=
    docTotalValorInicial +
    consultTotalValorInicial +
    fisicasTotalValorInicial +
    quimicasTotalValorInicial;
  globalTotalHoras +=
    docTotalHoras + consultTotalHoras + fisicasTotalHoras + quimicasTotalHoras;
  globalTotalPrecoMinimo +=
    docTotalPrecoMinimo +
    consultTotalPrecoMinimo +
    fisicasTotalPrecoMinimo +
    quimicasTotalPrecoMinimo;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : token ? (
        <div className="" style={{ paddingBottom: "130px" }}>
          <ValuesContainer>
            <ValuesRow $row={0}>
              <div>
                <ValuesText>Custos Diretos:</ValuesText>

                <ValuesAmount>
                  {maskCurrency(globalTotalPrecoMinimo)}
                </ValuesAmount>
              </div>

              <div>
                <ValuesText>Total de Horas: </ValuesText>

                <ValuesAmount>{globalTotalHoras} horas</ValuesAmount>
              </div>
              <div>
                <ValuesText>Deslocamento: </ValuesText>
                <ValuesAmount>{maskCurrency(deslocamento)}</ValuesAmount>
              </div>
              <div>
                <ValuesText>Valor Venda:</ValuesText>
                <ValuesAmount>
                  {maskCurrency(globalTotalValorInicial + deslocamento)}
                </ValuesAmount>
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
                <option value="n">Nova Adesão</option>
                <option value="r">Renovação</option>
              </select>
            </div>

            <div className="d-flex align-items-center m-3 bg-white">
              <label
                className="mx-2 bg-white"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "rgba(80, 80, 80, 1)",
                }}
              >
                Funcionários
              </label>
              <select
                className="form-select"
                value={funcionarios}
                onChange={(e) => setFuncionarios(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="total11a25">De 11 a 25</option>
                <option value="total26a50">De 26 a 50</option>
                <option value="total51a75">De 51 a 75</option>
                <option value="total76a100">De 76 a 100</option>
                <option value="total101a250">De 101 a 250</option>
                <option value="total251a500">De 251 a 500</option>
                <option value="total501a1000">De 501 a 1000</option>
                <option value="total1001">Acima de 1000</option>
              </select>
            </div>
          </div>

          <div>
            <table
              className="table table-striped table-hover table-responsive"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky-top">
                <tr style={{ verticalAlign: "middle" }}>
                  <th className="">Produto</th>
                  <th className="text-center">Incluir na Proposta</th>
                  <th className="text-center">Observação</th>
                  <th className="text-center" style={{ width: "9%" }}>
                    Horas
                  </th>
                  <th className="text-center">Preço Mínimo</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Margem
                  </th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <TitleTr
                  onClick={() => toggleSection("documentacao")}
                  $active={openSections.documentacao}
                >
                  <td colSpan={6}>DOCUMENTAÇÃO</td>
                  <td className="icon">
                    <ExpandedIcon size="24px" />
                  </td>
                </TitleTr>
                {openSections.documentacao ? docRows : null}
                <TotalRow>
                  <td colSpan={5} className="">
                    TOTAL DOCUMENTAÇÃO
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(docTotalValorInicial)}
                  </td>
                </TotalRow>
                <TitleTr
                  onClick={() => toggleSection("consultoria")}
                  $active={openSections.consultoria}
                >
                  <td colSpan={6}>CONSULTORIA</td>
                  <td className="icon">
                    <ExpandedIcon size="24px" />
                  </td>
                </TitleTr>

                {openSections.consultoria ? consultRows : null}

                <TotalRow>
                  <td colSpan={5} className="">
                    TOTAL CONSULTORIA
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(consultTotalValorInicial)}
                  </td>
                </TotalRow>
                <TitleTr
                  onClick={() => toggleSection("fisicas")}
                  $active={openSections.fisicas}
                >
                  <td colSpan={6}>AVALIAÇÕES AMBIENTAIS FÍSICAS</td>
                  <td className="icon">
                    <ExpandedIcon size="24px" />
                  </td>
                </TitleTr>
                {openSections.fisicas ? fisicasRows : null}
                <TotalRow>
                  <td colSpan={5} className="">
                    TOTAL AVALIAÇÕES AMBIENTAIS FÍSICAS
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(fisicasTotalValorInicial)}
                  </td>
                </TotalRow>
                <TitleTr
                  onClick={() => toggleSection("quimicas")}
                  $active={openSections.quimicas}
                >
                  <td colSpan={6}>AVALIAÇÕES AMBIENTAIS QUÍMICAS</td>
                  <td className="icon">
                    <ExpandedIcon size="24px" />
                  </td>
                </TitleTr>
                {openSections.quimicas ? quimicasRows : null}
                <TotalRow>
                  <td colSpan={5} className="">
                    TOTAL AVALIAÇÕES AMBIENTAIS QUÍMICAS
                  </td>
                  <td colSpan={2} className="text-end">
                    {maskCurrency(quimicasTotalValorInicial)}
                  </td>
                </TotalRow>
              </tbody>
            </table>
          </div>
          <DeslocamentoTable
            toggleSection={toggleSection}
            openSections={openSections}
            setDeslocamento={setDeslocamento}
            refresh={refresh}
            cartType="sst"
            toggle
          />
        </div>
      ) : null}
    </>
  );
};

export default Calculadora;
