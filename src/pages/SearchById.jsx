import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchById() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meal, setMeal] = useState(null);
  const navigate = useNavigate();

  const searchMealById = async () => {
    if (!id.trim()) {
      setError('Please enter a meal ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMeal(null);
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setMeal(data.meals[0]);
      } else {
        setError('No meal found with this ID');
      }
    } catch (err) {
      setError('Failed to search meal. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMealById();
    }
  };

  const viewMealDetails = () => {
    if (meal) {
      navigate(`/meal/${meal.idMeal}`);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Meal by ID</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter meal ID (e.g., 52772)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button onClick={searchMealById} className="search-btn">
          Search by ID
        </button>
      </div>

      {loading && <div className="loading">Searching for meal...</div>}
      
      {error && <div className="error">{error}</div>}

      {meal && !loading && (
        <div className="search-result">
          <h2>Meal Found:</h2>
          <div className="meal-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <img 
              src={meal.strMealThumb} 
              alt={meal.strMeal} 
              className="meal-image"
              onClick={viewMealDetails}
              style={{ cursor: 'pointer' }}
            />
            <div className="meal-info">
              <h3>{meal.strMeal}</h3>
              <p><strong>ID:</strong> {meal.idMeal}</p>
              <p><strong>Category:</strong> {meal.strCategory || 'N/A'}</p>
              <p><strong>Area:</strong> {meal.strArea || 'N/A'}</p>
              
              <button 
                className="details-btn"
                onClick={viewMealDetails}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchById;