import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage';
import SimulationsPage from './pages/SimulationsPage';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game-details" element={<GameDetailsPage />} />
                <Route path="/simulations" element={<SimulationsPage />} />
            </Routes>
        </Router>
    );
};

export default App;