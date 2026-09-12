import { z } from "zod";

export const SUPPORTED_CURRENCIES = [
  "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP",
  "HKD", "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR",
  "NOK", "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR",
] as const;

export const updateCurrencySchema = z.object({
  currency: z.enum(SUPPORTED_CURRENCIES, {
    message: "Invalid currency. Must be a supported fiat currency (e.g. USD, EUR, INR).",
  }),
});