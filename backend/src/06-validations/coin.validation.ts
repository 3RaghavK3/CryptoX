import { z } from "zod";

export const getMarketsSchema = z.object({
    vs_currency: z.string().default("usd"),

    sort_by: z.enum([
        "rank",
        "market_cap",
        "price",
        "change_1h",
        "change_24h",
        "change_7d",
        "volume",
        "name",
        "id"
    ]).default("market_cap"),

    dir: z.enum(["asc", "desc"]).default("desc"),

    per_page: z.coerce
        .number()
        .int()
        .min(1)
        .max(250)
        .default(100),

    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    sparkline: z.coerce
        .boolean()
        .default(true),

    price_change_percentage: z
        .string()
        .default("1h,24h,7d"),
});

export const getCoinDetailSchema = z.object({
    coinId: z.string().min(1),
});

export const searchSchema = z.object({
    query: z.string().min(1),
});

export type GetMarketsInput = z.infer<typeof getMarketsSchema>;
export type GetCoinDetailInput = z.infer<typeof getCoinDetailSchema>;
export type SearchInput = z.infer<typeof searchSchema>;