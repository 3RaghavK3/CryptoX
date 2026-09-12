import { useState } from 'react';
import { Homepage } from './components/Homepage';
import { Routes, Route } from 'react-router-dom';
import { CoinDetail } from './components/Coindetail';
import { WishlistProvider } from './context/wishlistcontext';
import { Wishlist } from './components/wishlist';
import { Trending } from './components/Trending';
import { AIEvaluator } from './components/AIEvaluator/AIEvaluator';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/login-form';
import { SignupForm } from './components/signup-form';
import { Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Loading } from './components/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1421]">
        <Loading />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <WishlistProvider>
          <Header />
          <Routes>
            <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-[#0d1421]"><LoginForm className="w-full max-w-sm" /></div>} />
            <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center bg-[#0d1421]"><SignupForm className="w-full max-w-sm" /></div>} />
            <Route path="/" element={<Homepage />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/coindetail/:id" element={<CoinDetail />} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/ai-evaluator" element={<ProtectedRoute><AIEvaluator /></ProtectedRoute>} />
          </Routes>
        </WishlistProvider>
      </AuthProvider>
    </>
  );
}

export default App;
