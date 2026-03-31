function SkeletonCard() {
  return (
    <div className="group animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-3 bg-gray-200 rounded w-3/5"></div>
        
        {/* Vendor */}
        <div className="h-3 bg-gray-200 rounded w-2/5"></div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;

