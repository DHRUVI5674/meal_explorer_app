import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchMeals from './pages/SearchMeals';
import MealDetails from './pages/MealDetails';
import LikedMeals from './pages/LikedMeals';
import Categories from './pages/Categories';
import SearchById from './pages/SearchById'; // New import
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<SearchMeals />} />
            <Route path="/search/id" element={<SearchById />} /> {/* New route for ID search */}
            <Route path="/meal/:id" element={<MealDetails />} />
            <Route path="/liked" element={<LikedMeals />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;