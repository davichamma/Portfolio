export const maskCurrency = (valor, locale = "pt-BR", currency = "BRL") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(valor);
};

export const formatCnpj = (cnpj) => {
  cnpj = cnpj.replace(/[.\-/]/g, "");

  const patterns = [
    { length: 4, format: "$1.$2" },
    { length: 7, format: "$1.$2.$3" },
    { length: 11, format: "$1.$2.$3/$4" },
    { length: 14, format: "$1.$2.$3/$4-$5" },
  ];

  const match =
    patterns.find((p) => cnpj.length <= p.length) ||
    patterns[patterns.length - 1];

  return cnpj.replace(
    /^(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/,
    match.format
  );
};
