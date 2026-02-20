import React, { useState, useEffect } from 'react';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      
      if (data.categories) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const trimDescription = (description) => {
    if (!description) return '';

    const firstSentence = description.split('.')[0];
    if (firstSentence.length <= 100) {
      return firstSentence + (description.includes('.') ? '.' : '');
    }
    return firstSentence.substring(0, 100) + '...';
  };

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="categories-page">
      <h1>Meal Categories</h1>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.idCategory} className="category-card">
            <img 
              src={category.strCategoryThumb} 
              alt={category.strCategory}
              className="category-image"
            />
            <div className="category-info">
              <h3>{category.strCategory}</h3>
              <p className="category-description">
                {trimDescription(category.strCategoryDescription)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;