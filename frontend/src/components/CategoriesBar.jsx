import React from 'react';
import { 
  Flame, 
  Palmtree, 
  TreePine, 
  Castle, 
  Building2, 
  Waves, 
  Sparkles, 
  Compass,
  LayoutGrid
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Listings', icon: LayoutGrid },
  { id: 'Trending', label: 'Trending', icon: Flame },
  { id: 'Beachfront', label: 'Beachfront', icon: Waves },
  { id: 'Cabins', label: 'Cabins', icon: TreePine },
  { id: 'Mansions', label: 'Mansions', icon: Castle },
  { id: 'Iconic cities', label: 'Iconic cities', icon: Building2 },
  { id: 'Lake', label: 'Lakefront', icon: Palmtree },
  { id: 'Countryside', label: 'Countryside', icon: Compass },
];

export default function CategoriesBar({ activeCategory, onSelectCategory }) {
  return (
    <div className="categories-container">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <div
            key={cat.id}
            className={`category-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
