import { useState } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Donate } from './pages/Donate';
import { Redeem } from './pages/Redeem';
import { History } from './pages/History';
import { Admin } from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'donate':
        return <Donate />;
      case 'redeem':
        return <Redeem />;
      case 'history':
        return <History />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </WalletProvider>
  );
}

export default App;
