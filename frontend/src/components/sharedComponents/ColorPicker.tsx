import React, { useState } from 'react';
// @ts-ignore
import { SketchPicker } from 'react-color';

function CustomColorPicker() {
  const [color, setColor] = useState('#000000');

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  return (
    <div>
      <SketchPicker color={color} onChange={handleColorChange} />
    </div>
  );
}

export default CustomColorPicker;