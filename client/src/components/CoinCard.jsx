import { useNavigate } from 'react-router-dom';
import { SparkLine } from './SparkLine';
import { useContext } from 'react';
import { WishlistContext } from '../context/wishlistcontext';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { TableCell, TableRow } from "@/components/ui/table";

export function CoinCard({
  id,
  rank,
  image,
  name,
  symbol,
  price,
  change7d,
  change1hr,
  change24hr,
  marketcap,
  volume,
  circulatingsupply,
  sparkline,
}) {
  const coinData = {
    id,
    rank,
    image,
    name,
    symbol,
    price,
    change7d,
    change1hr,
    change24hr,
    marketcap,
    volume,
    circulatingsupply,
    sparkline,
  };

  const navigate = useNavigate();

  const { LikedCoins, setLikedCoins } = useContext(WishlistContext);

  const isLiked = LikedCoins.some((coin) => coin.id === id);

  const toggleStar = () => {
    if (isLiked) {
      setLikedCoins(LikedCoins.filter((coin) => coin.id !== id));
    } else {
      setLikedCoins([coinData, ...LikedCoins]);
    }
  };

  const formatNumber = (num) => {
    const parsed = Number(num);
    return !isNaN(parsed) && num !== null && num !== undefined
      ? parsed.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : '--';
  };

  const checkTrend = (percentage) => {
    const parsed = Number(percentage);
    if (isNaN(parsed) || percentage === null || percentage === undefined) return ['gray', ''];
    return parsed > 0 ? 'up' :'down' ;
  };

  return (
     <TableRow className='text-sm lg:text-lg md:text-base border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors' onClick={() => navigate(`/coindetail/${id}`)}>
      <TableCell className="w-[50px] p-2"
        onClick={(e) => {
          e.stopPropagation();
          toggleStar();
        }}
      >
        <div className='flex items-center justify-center'>
          <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
            <polygon
              fill={isLiked ? 'yellow' : 'none'}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="12 2 15.09 8.26 22 9.27 
                    17 14.14 18.18 21.02 
                    12 17.77 5.82 21.02 
                    7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        </div>
      </TableCell>

      <TableCell className="w-[40px] text-slate-400 p-2">{rank !== undefined ? rank : ''}</TableCell>

      <TableCell className="p-2 font-medium max-w-[150px] md:max-w-[250px] whitespace-normal break-words">
        {image && name && symbol && (
          <div className="flex items-center gap-2">
            <img src={image} className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" alt="logo" />
            <div className="flex flex-wrap items-center">
              <span>{name}</span>
              <span className="text-gray-400 ml-1 hidden md:inline-block">
                ({symbol.toUpperCase()})
              </span>
            </div>
          </div>
        )}
      </TableCell>

      <TableCell className='p-2 font-semibold'>
        {price !== undefined ? `$${formatNumber(price)}` : ''}
      </TableCell>

      <TableCell className='p-2 hidden lg:table-cell'>
        {change1hr !== undefined && (
          <div className='flex items-center gap-1 font-medium'>
            {`${formatNumber(change1hr)}%`}
            {checkTrend(change1hr) === 'up' ? (
              <ArrowUp className='text-[#17D082] w-4 h-4' />
            ) : (
              <ArrowDown className='text-[#F43D46] w-4 h-4' />
            )}
          </div>
        )}
      </TableCell>

      <TableCell className='p-2'>
        {change24hr !== undefined && (
          <div className='flex items-center gap-1 font-medium'>
            {`${formatNumber(change24hr)}%`}
            {checkTrend(change24hr) === 'up' ? (
              <ArrowUp className='text-[#17D082] w-4 h-4' />
            ) : (
              <ArrowDown className='text-[#F43D46] w-4 h-4' />
            )}
          </div>
        )}
      </TableCell>

      <TableCell className='p-2 hidden lg:table-cell'>
        {change7d !== undefined && (
          <div className='flex items-center gap-1 font-medium'>
            {`${formatNumber(change7d)}%`}
            {checkTrend(change7d) === 'up' ? (
              <ArrowUp className='text-[#17D082] w-4 h-4' />
            ) : (
              <ArrowDown className='text-[#F43D46] w-4 h-4' />
            )}
          </div>
        )}
      </TableCell>


      <TableCell className='p-2 hidden md:table-cell text-slate-300'>
        {marketcap !== undefined ? `$${formatNumber(marketcap)}` : ''}
      </TableCell>

      <TableCell className='p-2 hidden lg:table-cell text-slate-300'>
        {volume !== undefined ? `$${formatNumber(volume)}` : ''}
      </TableCell>

      <TableCell className='p-2 hidden lg:table-cell text-slate-300'>
        {circulatingsupply !== undefined ? 
          `${formatNumber(circulatingsupply)}` : ''
        }
      </TableCell>

      <TableCell className='p-2 hidden md:table-cell text-right'>
        {sparkline !== undefined && sparkline.length > 0 && (
          <div className='w-full max-w-[180px] ml-auto h-20 flex items-center'>
            <SparkLine color={checkTrend(change7d)==='up'?['#17D082']:['#F43D46']} prices={sparkline} />
          </div>
        )}
      </TableCell>
    </TableRow>
    
   
  );
}
