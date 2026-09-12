export const fetchExchangeRates = async () => {
  const response = await fetch("https://api.frankfurter.app/latest?from=USD");

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    ...data.rates,
    USD: 1.0
  };
};
