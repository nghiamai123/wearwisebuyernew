const ColorFilter = ({ colors, selectedColors, handleCheckboxChange }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-2">Colors</h4>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleCheckboxChange("colors", color.name)}
            className={`w-6 h-6 rounded-full border border-gray-300 transition-all ${
              selectedColors.includes(color.name)
                ? "ring-2 ring-black scale-110"
                : "hover:scale-105"
            }`}
            style={{ backgroundColor: color.code }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
