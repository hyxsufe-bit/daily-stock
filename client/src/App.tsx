import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StockDetail from './pages/StockDetail';
import GamePlay from './pages/GamePlay';
import Collection from './pages/Collection';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:stockCode" element={<StockDetail />} />
          <Route path="/game/:stockCode/:questionId" element={<GamePlay />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
