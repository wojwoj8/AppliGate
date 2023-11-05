import React, { useState } from 'react';


const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  return (
    <div>
      <h2>Color Picker</h2>
      {/* <SketchPicker color={selectedColor} onChange={handleColorChange} /> */}
      <p>Selected Color: {selectedColor}</p>
    </div>
  );
}

export default ColorPicker;