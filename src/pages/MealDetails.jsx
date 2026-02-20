import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MealDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals')) || [];
    setIsLiked(likedMeals.includes(id));
  }, [id]);

  useEffect(() => {
    fetchMealDetails();
  }, [id]);

  const fetchMealDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setMeal(data.meals[0]);
      } else {
        setError('Meal not found');
      }
    } catch (err) {
      setError('Failed to load meal details');
      console.error('Error fetching meal details:', err);
    } finally {
      setLoading(false);
    }
  };

const handleLikeToggle = () => {
  const likedMeals = JSON.parse(localStorage.getItem('likedMeals')) || [];
  let updatedLikes;
  
  if (isLiked) {
    updatedLikes = likedMeals.filter(mealId => mealId !== id);
  } else {
    updatedLikes = [...likedMeals, id];
  }
  
  localStorage.setItem('likedMeals', JSON.stringify(updatedLikes));
  setIsLiked(!isLiked);

  window.dispatchEvent(new Event('likedUpdated'));
};

  const getIngredients = () => {
    if (!meal) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 5; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure || ''
        });
      }
    }
    return ingredients;
  };

  if (loading) return <div className="loading">Loading meal details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!meal) return <div className="error">Meal not found</div>;

  const ingredients = getIngredients();

  return (
    <div className="meal-details">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="details-content">
        <div className="details-header">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="details-image" />
          
          <div className="details-info">
            <h1>{meal.strMeal}</h1>
            
            <div className="details-meta">
              <p><strong>Category:</strong> {meal.strCategory || 'N/A'}</p>
              <p><strong>Area:</strong> {meal.strArea || 'N/A'}</p>
            </div>

            <button 
              className={`like-btn-large ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeToggle}
            >
              {isLiked ? '❤️ Liked' : '🤍 Like this meal'}
            </button>
          </div>
        </div>

        <div className="details-body">
          <div className="ingredients-section">
            <h2>Ingredients (First 5)</h2>
            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index}>
                  <span className="ingredient-name">{item.name}</span>
                  <span className="ingredient-measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <p className="instructions">
              {meal.strInstructions 
                ? meal.strInstructions.length > 300 
                  ? meal.strInstructions.substring(0, 300) + '...' 
                  : meal.strInstructions
                : 'No instructions available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealDetails;