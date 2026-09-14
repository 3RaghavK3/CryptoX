import { createContext, useEffect, useState } from 'react';

// @ts-ignore
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [LikedCoins, setLikedCoins] = useState(() => {
    const stored = localStorage.getItem('Wishlist');
    if (stored) return JSON.parse(stored);
    else return [];
  });
  useEffect(() => {
    localStorage.setItem('Wishlist', JSON.stringify(LikedCoins));
  }, [LikedCoins]);

  return (
    <WishlistContext.Provider value={{ LikedCoins, setLikedCoins }}>
      {children}
    </WishlistContext.Provider>
  );
};
