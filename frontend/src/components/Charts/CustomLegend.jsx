const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center mr-4 mb-2">
          <div
            className="w-2 h-2 mr-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;