import { Global } from './Global';
import { Market } from './market';
import { Header } from './Header';
import { useState } from 'react';
import { Loading } from './Loading';

export function Homepage() {
  const [globalLoaded, setGlobalLoaded] = useState(false);
  const [marketLoaded, setMarketLoaded] = useState(false);

  const isLoaded = globalLoaded && marketLoaded;

  return (
    <>
      {!isLoaded && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loading />
        </div>
      )}
      <div className={isLoaded ? "block" : "hidden"}>
        <Global onLoad={() => setGlobalLoaded(true)} />
        <Market onLoad={() => setMarketLoaded(true)} />
      </div>
    </>
  );
}
