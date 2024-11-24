export const calculatePercentage = (product) => {
  if (product.totalContrato === 0) {
    return "0";
  }
  let percentage = (product.totalFaturado / product.totalContrato) * 100;
  return percentage > 100 ? "100.00%" : `${percentage.toFixed(2)}%`;
};
