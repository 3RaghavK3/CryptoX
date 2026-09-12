// @ts-ignore
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
export function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center bg-[#0d1421] text-white py-2 text-sm md:text-md lg:text-lg px-4 md:px-5 lg:px-6">
      <div className="flex items-center lg:h-10  lg:gap-2">
        <img src={logo} className="w-8 h-8" alt="Logo" />
        <span
          className="font-bold cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
        >
          CRYPTO.
        </span>
      </div>

      <div className="flex justify-between items-center gap-4 lg:gap-10 md:gap-7 cursor-pointer">
        <span
          onClick={() => {
            navigate('/');
          }}
        >
          Market
        </span>
        <span
          onClick={() => {
            navigate('/trending');
          }}
        >
          Trending
        </span>
        <span
          onClick={() => {
            navigate('/wishlist');
          }}
        >
          Wishlist
        </span>
      </div>
    </header>
  );
}
