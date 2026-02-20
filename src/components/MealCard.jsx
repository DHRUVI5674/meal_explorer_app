import React from 'react';
import { useNavigate } from 'react-router-dom';

function MealCard({ meal, isLiked, onLikeToggle }) {
  const navigate = useNavigate();
  const handleLikeClick = (e) => {
    e.stopPropagation(); 
    onLikeToggle(meal.idMeal);
  };

  const handleViewDetails = () => {
    navigate(`/meal/${meal.idMeal}`);
  };

  return (
    <div className="meal-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
      <div className="meal-info">
        <h3>{meal.strMeal}</h3>
        <p className="meal-category">{meal.strCategory || 'Category not available'}</p>
        
        <div className="card-actions">
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
          >
            {isLiked ? '❤️ Liked' : '🤍 Like'}
          </button>
          
          <button 
            className="details-btn"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealCard;