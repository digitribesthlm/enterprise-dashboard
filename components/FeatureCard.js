// File: components/FeatureCard.js
import { useSelection } from '../context/SelectionContext';

export default function FeatureCard({ feature = {} }) {
  const { selections, toggleSelection } = useSelection();
  const { id = '', name = '', variations = [] } = feature;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
      <div className="card-body p-6">
        <div className="flex justify-between items-center border-b border-base-300 pb-2">
          <h3 className="text-lg font-bold text-primary">
            {id}. {name}
          </h3>
          <input 
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={!!selections.coreFeatures[name]}
            onChange={() => toggleSelection('coreFeatures', name)}
          />
        </div>
        <ul className="mt-4 space-y-1">
          {variations.map((variation, index) => (
            <li 
              key={index}
              className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-base-200 transition-all"
            >
              <span className="text-base-content/80">{variation}</span>
              <input 
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={!!selections.coreFeatures[variation]}
                onChange={() => toggleSelection('coreFeatures', variation)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}