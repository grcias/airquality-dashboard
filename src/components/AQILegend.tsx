const AQILegend = () => {
  const categories = [
    { label: "Good", color: "#cbf0d1" },
    { label: "Moderate", color: "#fbf875" },
    { label: "Unhealthy", color: "#fecb63" },
    { label: "Very Unhealthy", color: "#fc6e74" },
    { label: "Hazardous", color: "#d39df6" },
  ];

  return (
    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
      {categories.map((category, index) => (
        <div 
          key={index} 
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs font-medium text-gray-700">{category.label}</span>
        </div>
      ))}
    </div>
  );
};

export default AQILegend;