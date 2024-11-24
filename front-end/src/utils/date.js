export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const formatDateBr = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} de ${month} de ${year}`;
};

export const isWithinDays = (data, days = 90) => {
  const givenDate = new Date(data);
  const today = new Date();

  const diffInMs = Math.abs(today - givenDate);

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= days;
};
