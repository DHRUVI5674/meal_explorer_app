import React, { useState, useEffect } from 'react';
import MealCard from '../components/MealCard';

function SearchMeals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedMeals, setLikedMeals] = useState([]);

  useEffect(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('likedMeals')) || [];
      setLikedMeals(savedLikes);
    } catch (error) {
      console.error('Error loading likes:', error);
      setLikedMeals([]);
    }
  }, []);

  useEffect(() => {
    fetchMealsByFirstLetter('a');
  }, []);

  const fetchMealsByFirstLetter = async (letter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
    } catch (err) {
      setError('Failed to fetch meals. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchMeals = async () => {
    if (!searchTerm.trim()) {
      fetchMealsByFirstLetter('a');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
    } catch (err) {
      setError('Failed to search meals. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = (mealId) => {
    try {
      let updatedLikes;
      
      if (likedMeals.includes(mealId)) {
        updatedLikes = likedMeals.filter(id => id !== mealId);
      } else {
        updatedLikes = [...likedMeals, mealId];
      }
      
      setLikedMeals(updatedLikes);
      localStorage.setItem('likedMeals', JSON.stringify(updatedLikes));
      
      window.dispatchEvent(new Event('likedUpdated'));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMeals();
    }
  };

  if (loading && meals.length === 0) {
    return <div className="loading">Loading meals...</div>;
  }

  return (
    <div className="search-page">
      <h1>Search Meals</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a meal (e.g., chicken, pizza)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}  // Now this works because function is defined
          className="search-input"
        />
        <button onClick={searchMeals} className="search-btn">
          Search
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      
      {!loading && !error && meals.length === 0 && (
        <div className="no-results">
          No meals found. Try searching for something else!
        </div>
      )}

      <div className="meals-grid">
        {meals.map(meal => (
          <MealCard
            key={meal.idMeal}
            meal={meal}
            isLiked={likedMeals.includes(meal.idMeal)}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchMeals;