export function formatCurrency(
  value: number,
  currencyCode = "USD",
  multiplier = 1
) {
  if (value === undefined || value === null || isNaN(value)) {
    return "-";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value * multiplier);
}
