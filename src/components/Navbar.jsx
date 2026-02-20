import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [likedCount, setLikedCount] = useState(0);

  const updateLikedCount = () => {
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals')) || [];
    setLikedCount(likedMeals.length);
  };

  useEffect(() => {
    updateLikedCount();
    window.addEventListener('storage', updateLikedCount);
    window.addEventListener('likedUpdated', updateLikedCount);
    
    return () => {
      window.removeEventListener('storage', updateLikedCount);
      window.removeEventListener('likedUpdated', updateLikedCount);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="nav-logo">🍽️ Meal Explorer</h2>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Search by Name
          </Link>
          
          <Link to="/search/id" className="nav-link"> {/* New link */}
            Search by ID
          </Link>
          
          <Link to="/categories" className="nav-link">
            Categories
          </Link>
          
          <Link to="/liked" className="nav-link">
            Liked Meals {likedCount > 0 && <span className="badge">{likedCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;