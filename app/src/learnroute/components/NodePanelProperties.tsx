import { Textarea } from '../components/Textarea';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { CustomComponentType, componentPropertiesConfig } from '../types/CustomComponentType';


interface NodeInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export function NodeInfoPanel({ isOpen, onClose, node, onUpdateNode }: NodeInfoPanelProps) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [borderColor, setBorderColor] = useState(node?.data?.borderColor || '#cccccc');
  const [borderRadius, setBorderRadius] = useState(node?.data?.borderRadius || 1);
  const [content, setContent] = useState(node?.data?.content || '');
  const [colorText, setColorText] = useState(node?.data?.colorText || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(node?.data?.backgroundColor || '#ffffff');
  const [fontSize, setFontSize] = useState(node?.data?.fontSize || 16);
  const [layoutOrder, setLayoutOrder] = useState(node?.data?.layoutOrder || 0);
  const [posX, setPosX] = useState(node?.position?.x || 0);
  const [posY, setPosY] = useState(node?.position?.y || 0);
  const [width, setWidth] = useState(node?.measured?.width || 200);
  const [height, setHeight] = useState(node?.measured?.height || 100);
  const [fontFamily, setFontFamily] = useState(node?.data?.fontFamily || 'Arial');

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
      setBorderColor(node.data?.borderColor || '#cccccc');
      setBorderRadius(node.data?.borderRadius || 1);

      setWidth(node?.data?.measured?.width || 200);
      setHeight(node?.data?.measured?.height || 100);

      setFontFamily(node.data?.fontFamily || 'Arial');
    }
  }, [node]);

  // Obtiene el tipo de componente para mostrar sus propiedades unicas
  const nodeType = node?.type as CustomComponentType;
  const config = componentPropertiesConfig[nodeType] || {};

  const handleSave = () => {
    const baseData = {
      label: config.showLabel ? label : undefined,
      content: config.showContent ? content : undefined,
      colorText: config.showColorText ? colorText : undefined,
      backgroundColor: config.showBackgroundColor ? backgroundColor : undefined,
      borderColor: config.showBorderColor ? borderColor : undefined,
      borderRadius: config.showBorderRadius ? borderRadius : undefined,
      fontSize: config.showFontSize ? fontSize : undefined,
      layoutOrder: config.showLayoutOrder ? layoutOrder : undefined,
      measured : config.showMeasured ? { width, height} : undefined, 
      fontFamily: config.showFontFamily ? fontFamily : undefined,
    };

    const updatedData = {
      ...node.data,
      ...baseData,
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
        width: `${width}px`,
        height: `${height}px`,
        fontFamily,
      },
    });

    toast.success('¡Guardado con éxito!');
  };

  // Nueva función para manejar cambios de tamaño
  // Update handleSizeChange to properly update the node's dimensions
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    const newMeasured = {
      ...node.measured,
      [dimension]: value
    };
    
    if (dimension === 'width') {
      setWidth(value);
    } else {
      setHeight(value);
    }
    onUpdateNode(node.id, {
      ...node,
      data: {
        ...node.data,
        measured: newMeasured
      },
      style: {
        ...node.style,
        [dimension]: `${value}px`
      }
    });
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
        <h2 className="text-lg font-semibold">Propiedades del nodo - {nodeType}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="space-y-4">
        {config.showLabel && (
          <div className="space-y-2">
            <Label>Contenido label:</Label>
            <Textarea
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Añade información adicional aquí..."
              className="min-h-[100px]"
            />
          </div>
        )}

        {config.showContent && (
          <div className="space-y-2">
            <Label>Contenido adicional:</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Añade información adicional aquí..."
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">

          {config.showColorText && (
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
            </div>
          )}

          {config.showBorderColor && (
            <div className="space-y-2">
              <Label>Color del borde</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  placeholder="#cccccc"
                />
                <Input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-12 p-1"
                />
              </div>
            </div>
          )}

          {config.showBackgroundColor && (
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
          )}

          {config.showBorderRadius && (

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
          )}

        </div>


        {config.showFontSize && (
          <div className="space-y-2">
            <Label>Tamaño de la letra (px)</Label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="10"
            />
          </div>
        )}

        {config.showLayoutOrder && (

          <div className="space-y-2">
            <Label>Orden del layout (z-index)</Label>
            <Input
              type="number"
              value={layoutOrder}
              onChange={(e) => setLayoutOrder(Number(e.target.value))}
              min="0"
            />
          </div>
        )}

      <div className="grid grid-cols-2 gap-4">
        {config.showFontFamily && (
          <div className="space-y-2 col-span-2">
            <Label>Tipo de fuente</Label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="system-ui">System UI</option>
            </select>
          </div>
        )}
      </div>

        {config.showPosition && (

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
        )}

        {config.showMeasured && (
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ancho (px)</Label>
            <Input
              type="number"
              value={width}
              min="50"
              max="800"
              onChange={(e) => {
                const newWidth = Number(e.target.value);
                setWidth(newWidth);
                handleSizeChange('width', newWidth);
              }}
              />
          </div>
          <div className="space-y-2">
            <Label>Alto (px)</Label>
            <Input
              type="number"
              value={height}
              min="30"
              max="600"
              onChange={(e) => {
                const newHeight = Number(e.target.value);
                setHeight(newHeight);
                handleSizeChange('height', newHeight);
              }}
              />
          </div>
        </div>
        )}



        <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}