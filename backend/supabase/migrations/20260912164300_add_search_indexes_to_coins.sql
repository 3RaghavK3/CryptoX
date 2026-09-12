CREATE INDEX IF NOT EXISTS idx_coins_name_lower_prefix ON coins (lower(name) varchar_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_coins_symbol_lower_prefix ON coins (lower(symbol) varchar_pattern_ops);
