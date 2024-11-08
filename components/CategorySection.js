// Update CategorySection component:
// File: components/CategorySection.js
import { useSelection } from '../context/SelectionContext';

export default function CategorySection({ title, items = [], category }) {
  const { selections, toggleSelection } = useSelection();
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
      <div className="card-body p-6">
        <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li 
              key={index}
              className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-base-200 transition-all"
            >
              <span className="text-base-content/80">{item}</span>
              <input 
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={!!selections[category]?.[item]}
                onChange={() => toggleSelection(category, item)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
