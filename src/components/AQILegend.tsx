const AQILegend = () => {
  const categories = [
    { label: "Good", color: "bg-status-good" },
    { label: "Moderate", color: "bg-status-moderate" },
    { label: "Unhealthy for Sensitive Groups", color: "bg-status-unhealthy" },
    { label: "Very Unhealthy", color: "bg-status-very-unhealthy" },
    { label: "Hazardous", color: "bg-status-hazardous" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {categories.map((category, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-4 h-3 rounded-sm ${category.color}`} />
          <span className="text-xs text-muted-foreground">{category.label}</span>
        </div>
      ))}
    </div>
  );
};

export default AQILegend;