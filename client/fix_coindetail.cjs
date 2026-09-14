const fs = require('fs');

let content = fs.readFileSync('d:/CryptoX/client/src/components/Coindetail.jsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { Header } from './Header';",
  "import { Header } from './Header';\nimport { useAuth } from '../context/AuthContext';\nimport { formatCurrency } from '../lib/currency';"
);

// 2. Add prefCurrency and multiplier
content = content.replace(
  "  const [loading, setLoading] = useState(true);",
  "  const [loading, setLoading] = useState(true);\n  const { user } = useAuth();\n  const prefCurrency = user?.preferredCurrency || \"USD\";\n  const multiplier = user?.currencyMultiplier || 1;"
);

// 3. Remove currency state
content = content.replace(
  "  const [currency, setcurrency] = useState({ name: 'usd', symbol: '$' });",
  ""
);

// 4. Replace currency.name with 'usd' everywhere
content = content.replace(/\[currency\.name\]/g, "['usd']");

// 5. Replace format blocks
// Current price top header
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.current_price\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.current_price['usd'], prefCurrency, multiplier)}"
);

// High 24h
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.high_24h\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.high_24h['usd'], prefCurrency, multiplier)}"
);

// Low 24h
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.low_24h\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.low_24h['usd'], prefCurrency, multiplier)}"
);

// ATH
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.ath\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.ath['usd'], prefCurrency, multiplier)}"
);

// ATL
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.atl\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.atl['usd'], prefCurrency, multiplier)}"
);

// Market cap
content = content.replace(
  /\{currency\.symbol\}\s*\{CoinDetailArray\?\.market_data\?\.market_cap\['usd'\]\?\.toLocaleString\(\)\}/g,
  "{formatCurrency(CoinDetailArray?.market_data?.market_cap['usd'], prefCurrency, multiplier)}"
);

// 6. Remove the USD/INR toggle
const toggleRegex = /<div className="flex">\s*<div\s*className=\{`p-2 rounded-sm cursor-pointer \$\{currency\.name == 'usd' \? 'bg-green-500' : 'bg-black'\}`\}\s*onClick=\{\(\) => setcurrency\(\{ name: 'usd', symbol: '\$' \}\)\}\s*>\s*USD \$\s*<\/div>\s*<div\s*className=\{`p-2 rounded-sm cursor-pointer \$\{currency\.name == 'inr' \? 'bg-green-500' : 'bg-black'\}`\}\s*onClick=\{\(\) => setcurrency\(\{ name: 'inr', symbol: '₹' \}\)\}\s*>\s*INR ₹\s*<\/div>\s*<\/div>/g;

content = content.replace(toggleRegex, "");

fs.writeFileSync('d:/CryptoX/client/src/components/Coindetail.jsx', content, 'utf8');
console.log('Fixed Coindetail.jsx');
