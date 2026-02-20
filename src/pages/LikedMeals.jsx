import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LikedMeals() {
  const [likedMeals, setLikedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikedMeals();
  }, []);

  const fetchLikedMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const likedIds = JSON.parse(localStorage.getItem('likedMeals')) || [];
      
      if (likedIds.length === 0) {
        setLikedMeals([]);
        setLoading(false);
        return;
      }

      const mealPromises = likedIds.map(async (id) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
      });

      const meals = await Promise.all(mealPromises);

      const validMeals = meals.filter(meal => meal !== null);
      setLikedMeals(validMeals);
      
    } catch (err) {
      setError('Failed to load liked meals');
      console.error('Error fetching liked meals:', err);
    } finally {
      setLoading(false);
    }
  };

 const handleRemove = (mealId) => {
  const likedIds = JSON.parse(localStorage.getItem('likedMeals')) || [];
  const updatedIds = likedIds.filter(id => id !== mealId);
  
  localStorage.setItem('likedMeals', JSON.stringify(updatedIds));
  setLikedMeals(likedMeals.filter(meal => meal.idMeal !== mealId));
  
  // ADD THIS LINE - triggers navbar update
  window.dispatchEvent(new Event('likedUpdated'));
};

  if (loading) return <div className="loading">Loading your liked meals...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="liked-page">
      <h1>Your Liked Meals ❤️</h1>
      
      {likedMeals.length === 0 ? (
        <div className="no-liked">
          <p>No liked meals yet.</p>
          <p>Go to the Search page and like some meals!</p>
          <button onClick={() => navigate('/')} className="browse-btn">
            Browse Meals
          </button>
        </div>
      ) : (
        <div className="liked-grid">
          {likedMeals.map(meal => (
            <div key={meal.idMeal} className="liked-card">
              <img 
                src={meal.strMealThumb} 
                alt={meal.strMeal} 
                className="liked-image"
                onClick={() => navigate(`/meal/${meal.idMeal}`)}
              />
              <div className="liked-info">
                <h3 onClick={() => navigate(`/meal/${meal.idMeal}`)}>
                  {meal.strMeal}
                </h3>
                <p>{meal.strCategory}</p>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemove(meal.idMeal)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedMeals;