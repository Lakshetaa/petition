import { useState } from 'react';

interface CategoryFilterProps {
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  'All',
  'Environment',
  'Human Rights',
  'Education',
  'Health',
  'Animal Rights',
  'Politics',
  'Other',
];

const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (category: string) => {
    const newCategory = category === 'All' ? null : category;
    setActiveCategory(category);
    onCategoryChange(newCategory);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;