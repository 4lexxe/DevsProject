import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  onChange: (color: string) => void;
}

export function ColorPicker({ onChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [previewColor, setPreviewColor] = useState('#ff0000');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 300, height: 300 });

  useEffect(() => {
    // Detectar si es dispositivo táctil
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Ajustar tamaño del canvas para móviles
    const handleResize = () => {
      const size = window.innerWidth < 768 ? 200 : 300;
      setCanvasDimensions({ width: size, height: size });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamaño real del canvas
    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = (angle + 2) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      const hue = angle;
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [canvasDimensions]);

  const getColorAtPosition = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return '#000000';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '#000000';

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `#${[imageData[0], imageData[1], imageData[2]]
      .map(n => n.toString(16).padStart(2, '0'))
      .join('')}`;
  };

  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const newColor = getColorAtPosition(x, y);
    setPreviewColor(newColor);
    return newColor;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const newColor = handleCanvasInteraction(touch.clientX, touch.clientY);
    if (newColor) {
      setSelectedColor(newColor);
      onChange(newColor);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const newColor = handleCanvasInteraction(touch.clientX, touch.clientY);
    if (newColor) {
      setSelectedColor(newColor);
      onChange(newColor);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const newColor = handleCanvasInteraction(e.clientX, e.clientY);
    setPreviewColor(newColor || selectedColor);
  };

  const handleMouseClick = (e: React.MouseEvent) => {
    const newColor = handleCanvasInteraction(e.clientX, e.clientY);
    if (newColor) {
      setSelectedColor(newColor);
      onChange(newColor);
    }
  };

  const handleColorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
    setPreviewColor(color);
    onChange(color);
  };

  return (
    <div className="relative inline-block w-full">
      <div className="relative touch-pan-y">
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onClick={handleMouseClick}
          onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="rounded-full touch-none w-full max-w-[300px] mx-auto"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Visualización del color */}
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-2 text-sm text-gray-600">
          {isTouchDevice ? "Color seleccionado" : "Color de vista previa"}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-lg"
            style={{ backgroundColor: isTouchDevice ? selectedColor : previewColor }}
          />
          <div className="text-sm font-mono font-semibold">
            {isTouchDevice ? selectedColor : previewColor}
          </div>
        </div>
      </div>

      {/* Controles de color */}
      <div className="mt-4 flex flex-col gap-3 px-4">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorInput}
          className="w-full h-12 cursor-pointer"
        />
        <input
          type="text"
          value={selectedColor}
          onChange={handleColorInput}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-mono"
          pattern="^#[0-9A-Fa-f]{6}$"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}