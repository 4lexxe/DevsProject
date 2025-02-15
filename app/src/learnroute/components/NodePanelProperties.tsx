import { Textarea } from '../components/Textarea';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

interface NodeInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export function NodeInfoPanel({ isOpen, onClose, node, onUpdateNode }: NodeInfoPanelProps) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [borderColor, setBorderColor] = useState(node?.data?.borderColor || '#e5e7eb'); 
  const [borderRadius, setBorderRadius] = useState(node?.data?.borderRadius || 1);
  const [content, setContent] = useState(node?.data?.content || '');
  const [colorText, setColorText] = useState(node?.data?.colorText || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(node?.data?.backgroundColor || '#ffffff');
  const [fontSize, setFontSize] = useState(node?.data?.fontSize || 16);
  const [layoutOrder, setLayoutOrder] = useState(node?.data?.layoutOrder || 0);
  const [posX, setPosX] = useState(node?.position?.x || 0);
  const [posY, setPosY] = useState(node?.position?.y || 0);

  useEffect(() => {
    if (node) {
      setLabel(node.data?.label || '');
      setContent(node.data?.content || '');
      setColorText(node.data?.colorText || '#000000');
      setBackgroundColor(node.data?.backgroundColor || '#ffffff');
      setFontSize(node.data?.fontSize || 16);
      setLayoutOrder(node.data?.layoutOrder || 0);
      setPosX(node.position?.x || 0);
      setPosY(node.position?.y || 0);
      // Agrega las nuevas propiedades
      setBorderColor(node.data?.borderColor || '');
      setBorderRadius(node.data?.borderRadius || 1);
    }
  }, [node]);

  const handleSave = () => {
    const updatedData = {
      ...node.data,
      label,
      content,
      colorText,
      backgroundColor,
      borderRadius,
      borderColor,
      fontSize,
      layoutOrder,
    };

    onUpdateNode(node.id, {
      ...node,
      data: updatedData,
      position: { x: Number(posX), y: Number(posY) },
      style: {
        ...node.style,
        color: colorText,
        backgroundColor,
        fontSize: `${fontSize}px`,
        zIndex: layoutOrder,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
      },
    });

    toast.success('¡Guardado con éxito!');
  };

  // Manejar cambios manuales en los inputs de X e Y
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (axis === 'x') {
      setPosX(value);
    } else {
      setPosY(value);
    }

    // Actualizar la posición del nodo en el gráfico
    onUpdateNode(node.id, {
      ...node,
      position: { x: axis === 'x' ? value : posX, y: axis === 'y' ? value : posY },
    });
  };

  if (!node || !isOpen) return null;

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-61px)] w-[400px] bg-white border-l shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Propiedades del nodo - {node?.data?.label}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Contenido adicional</Label>
          <Textarea
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Añade información adicional aquí..."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Color del texto</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={colorText}
                onChange={(e) => setColorText(e.target.value)}
                placeholder="#000000"
              />
              <Input
                type="color"
                value={colorText}
                onChange={(e) => setColorText(e.target.value)}
                className="w-12 p-1"
              />
          </div>

          <div className="space-y-2">
            <Label>Color de fondo</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
              />
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 p-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
            <Label>Border Radius</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                min="1"
                defaultValue={"8"}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tamaño de la letra (px)</Label>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="10"
          />
        </div>

        <div className="space-y-2">
          <Label>Orden del layout (z-index)</Label>
          <Input
            type="number"
            value={layoutOrder}
            onChange={(e) => setLayoutOrder(Number(e.target.value))}
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Posición X</Label>
            <Input
              type="number"
              value={posX}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Posición Y</Label>
            <Input
              type="number"
              value={posY}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}