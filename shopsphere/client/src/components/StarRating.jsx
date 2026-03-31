import { Star, StarHalf, StarOff } from 'lucide-react';

function StarRating({ rating = 0, count = 0, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const stars = [];

  // Full stars
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(
      <Star key={`full-${i}`} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
    );
  }

  // Half star
  if (rating % 1 >= 0.5) {
    stars.push(
      <StarHalf key="half" className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
    );
  }

  // Empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarOff key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {stars}
      </div>
      {count > 0 && (
        <span className={`ml-1 text-xs font-medium ${
          size === 'sm' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          ({count})
        </span>
      )}
    </div>
  );
}

export default StarRating;

