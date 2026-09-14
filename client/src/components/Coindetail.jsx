import { ArrowDown, ArrowUp, ThumbsDown, ThumbsUp } from 'lucide-react';
import { use, useContext, useEffect, useState } from 'react';
import { useFetcher, useParams } from 'react-router-dom';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/currency';

import { Loading } from './Loading';
export function CoinDetail() {
  const { id } = useParams();
  const [CoinDetailArray, setCoinDetailArray] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const prefCurrency = user?.preferredCurrency || "USD";
  const multiplier = user?.currencyMultiplier || 1;
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/coins/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const mappedData = {
          ...data,
          market_data: {
            current_price: { usd: data.current_price, inr: data.current_price },
            high_24h: { usd: data.high_24h, inr: data.high_24h },
            low_24h: { usd: data.low_24h, inr: data.low_24h },
            ath: { usd: data.ath, inr: data.ath },
            ath_date: { usd: data.ath_date, inr: data.ath_date },
            ath_change_percentage: { usd: data.ath_change_percentage, inr: data.ath_change_percentage },
            atl: { usd: data.atl, inr: data.atl },
            atl_date: { usd: data.atl_date, inr: data.atl_date },
            atl_change_percentage: { usd: data.atl_change_percentage, inr: data.atl_change_percentage },
            market_cap: { usd: data.market_cap, inr: data.market_cap },
            fully_diluted_valuation: { usd: data.fully_diluted_valuation, inr: data.fully_diluted_valuation },
            total_volume: { usd: data.total_volume, inr: data.total_volume },
            circulating_supply: data.circulating_supply,
            total_supply: data.total_supply,
            max_supply: data.max_supply,
            price_change_percentage_1h_in_currency: { usd: data.price_change_percentage_1h, inr: data.price_change_percentage_1h },
            price_change_percentage_24h_in_currency: { usd: data.price_change_percentage_24h, inr: data.price_change_percentage_24h },
            price_change_percentage_7d_in_currency: { usd: data.price_change_percentage_7d, inr: data.price_change_percentage_7d },
            price_change_percentage_14d_in_currency: { usd: data.price_change_percentage_14d, inr: data.price_change_percentage_14d },
            price_change_percentage_30d_in_currency: { usd: data.price_change_percentage_30d, inr: data.price_change_percentage_30d },
            price_change_percentage_1y_in_currency: { usd: data.price_change_percentage_1y, inr: data.price_change_percentage_1y },
            market_cap_change_percentage_24h_in_currency: { usd: data.market_cap_change_percentage_24h, inr: data.market_cap_change_percentage_24h }
          },
          image: { large: data.image_url },
          description: { en: data.description },
          links: {
            homepage: [data.homepage],
            whitepaper: data.whitepaper,
            subreddit_url: data.subreddit_url,
            repos_url: { github: [data.github_repositories] }
          }
        };
        setCoinDetailArray(mappedData);
        setLoading(false)
      })
      .catch((e) => console.error(e + ' Error in fetching coindetail'))
  }, [id]);






  const market_price_change_perc = {
    '1h': CoinDetailArray?.market_data?.price_change_percentage_1h_in_currency?.['usd'],
    '24h': CoinDetailArray?.market_data?.price_change_percentage_24h_in_currency?.['usd'],
    '7d': CoinDetailArray?.market_data?.price_change_percentage_7d_in_currency?.['usd'],
    '14d': CoinDetailArray?.market_data?.price_change_percentage_14d_in_currency?.['usd'],
    '30d': CoinDetailArray?.market_data?.price_change_percentage_30d_in_currency?.['usd'],
  };



  return (
    <>

      <div className="p-4 bg-[#0d1421] min-h-screen text-white text-sm lg:text-base">
        {
          loading ? <div className="flex items-center justify-center h-screen text-xl md:text-3xl lg:text-5xl">
            <Loading />
          </div>
            : <>

              <div className="bg-[#0d1421] text-white  p-4 py-2 items-center text- rounded-xl md:flex justify-between">
                <div className="flex justify-between md:gap-3 lg:gap-8">
                  <div>
                    <span>{CoinDetailArray?.name} </span>
                    <span className='hidden md:inline'>({CoinDetailArray?.symbol})</span>
                  </div>
                  <div>|</div>
                  <div>
                    {formatCurrency(CoinDetailArray?.market_data?.current_price['usd'], prefCurrency, multiplier)}
                  </div>
                  <div>|</div>
                  <div className="flex gap-2">
                    {market_price_change_perc['24h'] > 0 ? (
                      <ArrowUp className="text-green-500" />
                    ) : (
                      <ArrowDown className="text-red-500" />
                    )}

                    <span
                      className={`${market_price_change_perc['24h'] > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {Number(market_price_change_perc['24h']).toFixed(2)}%{' '}
                    </span>
                    <span> 24h</span>
                  </div>
                  <div>|</div>
                  <div>Rank #{CoinDetailArray?.market_cap_rank}</div>
                </div>

                <div className="flex items-center justify-between md:gap-2 lg:gap-4">
                  <span className="">
                    {' '}
                    Last Updated at {new Date(CoinDetailArray?.last_updated).toLocaleTimeString()}{' '}
                  </span>
                  
                </div>
              </div>

              <div className="grid lg:grid-cols-3  gap-4 my-4">
                <div className="bg-[#0d1421] grid grid-cols-2 gap-2 p-4">
                  <div className="border border-2 border-white p-2 flex flex-col justify-around">
                    <div className="flex flex-col items-center ">
                      <div>Current Price</div>
                      <div className="font-bold text-2xl">
                        {formatCurrency(CoinDetailArray?.market_data?.current_price['usd'], prefCurrency, multiplier)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span>24 High:</span>
                      <span>
                        {formatCurrency(CoinDetailArray?.market_data?.high_24h['usd'], prefCurrency, multiplier)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span>24 Low:</span>
                      <span>
                        {formatCurrency(CoinDetailArray?.market_data?.low_24h['usd'], prefCurrency, multiplier)}
                      </span>
                    </div>
                  </div>

                  <div className="border border-2 border-white">
                    <div className="flex justify-center border-2">Performance</div>

                    <div className="flex flex-col">
                      {Object.entries(market_price_change_perc).map(([key, value]) => {
                        return (
                          <>
                            <div className="flex justify-around">
                              <div>{key}</div>
                              {value > 0 ? (
                                <div className="text-green-500 flex">
                                  <span>
                                    <ArrowUp />
                                  </span>
                                  <span>+{Number(value).toFixed(2)}%</span>
                                </div>
                              ) : (
                                <div className="text-red-500 flex">
                                  <span>
                                    <ArrowDown />
                                  </span>
                                  <span>{Number(value).toFixed(2)}%</span>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-2 border-white col-span-2  flex flex-col justify-between">
                    <div className="flex justify-center border-2 ">Historical Prices</div>
                    <div className="flex p-4 gap-2">
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <span>ATH:</span>
                          <span>
                            {formatCurrency(CoinDetailArray?.market_data?.ath['usd'], prefCurrency, multiplier)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span>On:</span>
                          <span>
                            {new Date(
                              CoinDetailArray?.market_data?.ath_date['usd']
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span>At:</span>
                          <span>
                            {new Date(
                              CoinDetailArray?.market_data?.ath_date['usd']
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex">
                          <span>ATH%:</span>
                          <span>
                            {CoinDetailArray?.market_data?.ath_change_percentage['usd'] > 0 ? (
                              <ArrowUp className="text-green-500" />
                            ) : (
                              <ArrowDown className="text-red-500" />
                            )}
                          </span>

                          <span
                            className={`${CoinDetailArray?.market_data?.ath_change_percentage['usd'] > 0
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {Number(
                              CoinDetailArray?.market_data?.ath_change_percentage['usd']
                            ).toFixed(2)}
                            %{' '}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex gap-2">
                          <span>ATL:</span>
                          <span>
                            {formatCurrency(CoinDetailArray?.market_data?.atl['usd'], prefCurrency, multiplier)}
                          </span>
                        </div>

                        <div className="flex gap-2 ">
                          <span>On:</span>
                          <span>
                            {new Date(
                              CoinDetailArray?.market_data?.atl_date['usd']
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span>At:</span>
                          <span>
                            {new Date(
                              CoinDetailArray?.market_data?.atl_date['usd']
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex">
                          <span>ATL%:</span>
                          <span>
                            {CoinDetailArray?.market_data?.atl_change_percentage['usd'] > 0 ? (
                              <ArrowUp className="text-green-500" />
                            ) : (
                              <ArrowDown className="text-red-500" />
                            )}
                          </span>

                          <span
                            className={`${CoinDetailArray?.market_data?.atl_change_percentage['usd'] > 0
                              ? 'text-green-500'
                              : 'text-red-500'
                              }`}
                          >
                            {Number(
                              CoinDetailArray?.market_data?.atl_change_percentage['usd']
                            ).toFixed(2)}
                            %{' '}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1421] p-4">
                  <div className='w-full h-full  flex flex-col items-center justify-center border-1'>
                    <div className="flex gap-2 text-2xl font-bold md:text-4xl ">
                      <span>{CoinDetailArray?.name}</span>
                      <span>({CoinDetailArray?.symbol?.toUpperCase()})</span>
                    </div>

                    <img src={CoinDetailArray?.image?.large} className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64" />
                  </div>

                </div>

                <div className="bg-[#0d1421] grid grid-cols-2 grid-rows-2 p-4 gap-2">
                  <div className="flex flex-col items-center justify-center border-2">
                    <div className="text-3xl">Rank</div>
                    <div className="text-5xl font-bold">#{CoinDetailArray?.market_cap_rank}</div>
                  </div>

                  <div className="border-2 flex flex-col justify-between">
                    <div className="flex justify-center border-2">Market Sentiment</div>

                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp className="text-green-500" />
                      <span>{CoinDetailArray?.sentiment_votes_up_percentage}% Bearish</span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <ThumbsDown className="text-red-500" />
                      <span>{CoinDetailArray?.sentiment_votes_down_percentage}% Burrish</span>
                    </div>

                    <div className="flex justify-center border-2">Wishlist</div>

                    <div className="flex justify-center text-2xl gap-2">
                      <span className="text-xl font-bold ">
                        {CoinDetailArray?.watchlist_portfolio_users?.toLocaleString()}
                      </span>
                      <span className="text-lg">Users</span>
                    </div>
                  </div>

                  <div className="flex flex-col border-2 p-2 justify-around items-center">
                    <div className="border-2 w-full text-center">Market Statistics</div>

                    <div className="flex">Market Cap</div>

                    <div className="text-2xl font-bold text-center">
                      {formatCurrency(CoinDetailArray?.market_data?.market_cap['usd'], prefCurrency, multiplier)}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {CoinDetailArray?.market_data?.market_cap_change_percentage_24h_in_currency['usd'] > 0 ? (
                        <ArrowUp className="text-green-500" />
                      ) : (
                        <ArrowDown className="text-red-500" />
                      )}
                      <span
                        className={
                          CoinDetailArray?.market_data?.market_cap_change_percentage_24h_in_currency['usd'] > 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {Number(
                          CoinDetailArray?.market_data?.market_cap_change_percentage_24h_in_currency['usd']
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center border-2 p-2 justify-around">
                    <div className="border-2 w-full text-center ">Supply Info</div>
                    <div>Circulating Supply</div>
                    <div className="font-bold text-center">
                      {CoinDetailArray?.market_data?.circulating_supply?.toLocaleString()}{' '}
                      {CoinDetailArray?.symbol?.toUpperCase()}
                    </div>
                    <div>Max Supply</div>
                    <div className="font-bold text-center gap-2 flex">
                      {CoinDetailArray?.market_data?.max_supply
                        ? CoinDetailArray?.market_data?.max_supply?.toLocaleString()
                        : 'No limit '}
                      {CoinDetailArray?.symbol?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d1421] p-4 border-2 w-full">{CoinDetailArray?.description?.en}</div>
            </>
        }

      </div>
    </>
  );
}
