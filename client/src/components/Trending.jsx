import { useEffect, useState } from 'react';
import { CoinCard } from './CoinCard';
import { Header } from './Header';
import { Loading } from './Loading';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Trending() {
  const [trendingArray, settrendingarray] = useState(null);

  useEffect(() => {
    // @ts-ignore
    fetch(`${import.meta.env.VITE_API_URL}/api/coins/trending`)
      .then((res) => res.json())
      .then((data) => {
        settrendingarray(data.coins || data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      {trendingArray && trendingArray.length > 0 ? (
          <div className="bg-[#0d1421] text-white overflow-x-auto w-full mt-4">
            <Table className="w-full text-sm md:text-base lg:text-lg border-b border-slate-700">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-700">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[40px] font-bold text-slate-300">#</TableHead>
                  <TableHead className="font-bold text-slate-300 w-[150px] md:w-[250px]">Name</TableHead>
                  <TableHead className="font-bold text-slate-300 min-w-[80px]">Current Price</TableHead>
                  <TableHead className="hidden lg:table-cell"></TableHead>
                  <TableHead className=""></TableHead>
                  <TableHead className="hidden lg:table-cell"></TableHead>
                  <TableHead className="hidden md:table-cell"></TableHead>
                  <TableHead className="hidden lg:table-cell"></TableHead>
                  <TableHead className="hidden lg:table-cell"></TableHead>
                  <TableHead className="hidden md:table-cell"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingArray.map((coin) => {
                  const isNested = coin.item !== undefined;
                  const c = isNested ? coin.item : coin;
                  return (
                    <CoinCard
                      rank={c.market_cap_rank}
                      key={c.id || c.coin_id}
                      id={c.id || c.coin_id}
                      image={c.thumb || c.image_url}
                      name={c.name}
                      symbol={c.symbol}
                      price={c.data?.price || c.current_price}
                      change7d={undefined}
                      change1hr={undefined}
                      change24hr={undefined}
                      marketcap={undefined}
                      volume={undefined}
                      circulatingsupply={undefined}
                      sparkline={undefined}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
      ) : (
        <div className='flex flex-1 items-center justify-center min-h-screen text-xl md:text-3xl lg:text-5xl text-white'>
          <Loading />
        </div>
      )}
    </>
  );
}
