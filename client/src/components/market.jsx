import { createElement, useEffect, useState, useContext, useRef } from 'react';
import { CoinCard } from './CoinCard';
import { WishlistContext } from '../context/wishlistcontext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CoinSearch } from './CoinSearch';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Loading } from './Loading';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Market({ onLoad }) {
  const [marketArray, setmarketarray] = useState([]);
  const [originalArray, setoriginalarray] = useState([]);
  const [lastsortedkey, setlastsortedkey] = useState('rank');
  const [sortstate, setsortstate] = useState(0);
  const { LikedCoins, setLikedCoins } = useContext(WishlistContext);
  const window_size = 50;
  const [windowstart, setwindow] = useState(0);

  const windowsentinel = useRef(null);
  const backendsentinel = useRef(null);
  const counter = Math.floor(70 / window_size);
  const unit_coutner = useRef(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const displayNext = () => {
    setwindow((prev) => {
      unit_coutner.current++;
      if (unit_coutner.current == counter) {
        setPage((p) => p + 1);
        unit_coutner.current = 0;
      }
      return prev + window_size;
    });
  };

  useEffect(() => {
    let sortBy = 'market_cap';
    let dir = 'desc';

    if (lastsortedkey) {
      sortBy = lastsortedkey;
      dir = sortstate === 0 ? 'asc' : 'desc';
    }

    if (page === 1) {
      setIsLoading(true);
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/coins/markets?page=${page}&sort_by=${sortBy}&dir=${dir}`)
      .then((res) => res.json())
      .then((data) => {
        if (page === 1) {
          setmarketarray(data);
          setoriginalarray(data);
        } else {
          setmarketarray((prev) => [...(prev || []), ...data]);
          setoriginalarray((prev) => [...(prev || []), ...data]);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setIsLoading(false);
        if (!initialLoaded) {
          setInitialLoaded(true);
          if (onLoad) onLoad();
        }
      });
  }, [page, lastsortedkey, sortstate]);

  useEffect(() => {
    if (marketArray.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            displayNext();
          }
        });
      },
      { rootMargin: '0px 0px 800px 0px', threshold: 0 }
    );

    if (windowsentinel.current) {
      observer.observe(windowsentinel.current);
    }

    return () => {
      if (windowsentinel.current) {
        observer.unobserve(windowsentinel.current);
      }
    };

  }, [marketArray]);

  const handleSort = (parameter) => {
    let newSortState;

    if (lastsortedkey !== parameter) {
      newSortState = 0;
    } else {
      newSortState = sortstate === 0 ? 1 : 0;
    }

    setlastsortedkey(parameter);
    setsortstate(newSortState);
    setPage(1);
    setwindow(0);
    unit_coutner.current = 0;
  };

  const getsortsymbol = (parameter) => {
    if (lastsortedkey !== parameter) return '';
    if (sortstate == 0) return <ArrowUp />;
    if (sortstate == 1) return <ArrowDown />;
  };

  return (
    <>
      <div>
        {marketArray && marketArray.length > 0 ? (
          <div className="bg-[#0d1421] text-white overflow-x-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4 gap-4">
              <CoinSearch className="w-full md:w-72" placeholder="Search coins..." />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 whitespace-nowrap">Sort By</span>
                  <Select
                    value={lastsortedkey || "market_cap"}
                    onValueChange={(val) => {
                      setlastsortedkey(val);
                      setPage(1);
                      setwindow(0);
                      unit_coutner.current = 0;
                    }}
                  >
                    <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 text-white focus:ring-slate-500">
                      <SelectValue placeholder="Select column">
                        {
                          {
                            rank: 'Rank',
                            market_cap: 'Market Cap',
                            price: 'Price',
                            change_1h: '1h Change',
                            change_24h: '24h Change',
                            change_7d: '7d Change',
                            volume: 'Volume',
                            name: 'Name'
                          }[lastsortedkey] || 'Select column'
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="rank">Rank</SelectItem>
                      <SelectItem value="market_cap">Market Cap</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="change_1h">1h Change</SelectItem>
                      <SelectItem value="change_24h">24h Change</SelectItem>
                      <SelectItem value="change_7d">7d Change</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <RadioGroup
                    value={sortstate === 0 ? "asc" : "desc"}
                    onValueChange={(val) => {
                      const isAsc = val === "asc";
                      setsortstate(isAsc ? 0 : 1);
                      if (!lastsortedkey) setlastsortedkey("market_cap");
                      setPage(1);
                      setwindow(0);
                      unit_coutner.current = 0;
                    }}
                    className="flex  gap-2"
                  >

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asc" id="r-asc" className="border-slate-500" />
                      <label htmlFor="r-asc" className="text-sm cursor-pointer text-slate-300">Ascending</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="desc" id="r-desc" className="border-slate-500" />
                      <label htmlFor="r-desc" className="text-sm cursor-pointer text-slate-300">Descending</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <Table className={`w-full text-sm md:text-base lg:text-lg border-b border-slate-700 transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-700">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead
                    className="w-[40px] font-bold text-slate-300 cursor-pointer"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-1">
                      <span>#</span>
                      <span>{getsortsymbol('rank')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 cursor-pointer w-[150px] md:w-[250px]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <span>{getsortsymbol('name')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 cursor-pointer min-w-[80px]"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Price</span>
                      <span>{getsortsymbol('price')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 hidden lg:table-cell cursor-pointer min-w-[80px]"
                    onClick={() => handleSort('change_1h')}
                  >
                    <div className="flex items-center gap-1">
                      <span>1h %</span>
                      <span>{getsortsymbol('change_1h')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 cursor-pointer min-w-[80px]"
                    onClick={() => handleSort('change_24h')}
                  >
                    <div className="flex items-center gap-1">
                      <span>24h %</span>
                      <span>{getsortsymbol('change_24h')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 hidden lg:table-cell cursor-pointer min-w-[80px]"
                    onClick={() => handleSort('change_7d')}
                  >
                    <div className="flex items-center gap-1">
                      <span>7d %</span>
                      <span>{getsortsymbol('change_7d')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 hidden md:table-cell cursor-pointer min-w-[120px]"
                    onClick={() => handleSort('market_cap')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Market Cap</span>
                      <span>{getsortsymbol('market_cap')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 hidden lg:table-cell cursor-pointer min-w-[120px]"
                    onClick={() => handleSort('volume')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Volume</span>
                      <span>{getsortsymbol('volume')}</span>
                    </div>
                  </TableHead>

                  <TableHead
                    className="font-bold text-slate-300 hidden lg:table-cell cursor-pointer min-w-[150px]"
                    onClick={() => handleSort('circulating_supply')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Circulating Supply</span>
                      <span>{getsortsymbol('circulating_supply')}</span>
                    </div>
                  </TableHead>

                  <TableHead className="font-bold text-slate-300 hidden md:table-cell text-right min-w-[120px]">
                    <span>Last 7 days</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {marketArray.slice(0, window_size + windowstart)?.map((coin) => (
                  <CoinCard
                    key={coin.coin_id || coin.id}
                    id={coin.coin_id || coin.id}
                    rank={coin.market_cap_rank}
                    image={coin.image_url || coin.image}
                    name={coin.name}
                    symbol={coin.symbol}
                    price={coin.current_price}
                    change7d={coin.price_change_percentage_7d || coin.price_change_percentage_7d_in_currency}
                    change1hr={coin.price_change_percentage_1h || coin.price_change_percentage_1h_in_currency}
                    change24hr={coin.price_change_percentage_24h || coin.price_change_percentage_24h_in_currency}
                    marketcap={coin.market_cap}
                    volume={coin.total_volume}
                    circulatingsupply={coin.circulating_supply}
                    sparkline={coin?.sparkline_7d?.price || coin?.sparkline_in_7d?.price || []}
                  />
                ))}
              </TableBody>
            </Table>
            <div ref={windowsentinel} className="h-1 opacity-0"></div>
          </div>
        ) : (
          <div className='flex items-center justify-center text-white min-h-[40vh] text-2xl md:text-3xl lg:text-5xl'>
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
