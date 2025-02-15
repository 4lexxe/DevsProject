import { Textarea } from "../components/Textarea";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Label } from "../components/Label";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";

interface NodeInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export function NodeInfoPanel({ isOpen, onClose, node, onUpdateNode }: NodeInfoPanelProps) {
  const [content, setContent] = useState(node?.data?.content || "");
  const [color, setColor] = useState(node?.data?.color || "#000000");
  const [backgroundColor, setBackgroundColor] = useState(node?.data?.backgroundColor || "#ffffff");
  const [posX, setPosX] = useState(node?.position?.x || 0);
  const [posY, setPosY] = useState(node?.position?.y || 0);
  const [zIndex, setZIndex] = useState(node?.data?.zIndex || 0);
  const [imageUrl, setImageUrl] = useState(node?.data?.url || "");

  useEffect(() => {
    if (node) {
      setContent(node.data?.content || "");
      setColor(node.data?.color || "#000000");
      setBackgroundColor(node.data?.backgroundColor || "#ffffff");
      setPosX(node.position?.x || 0);
      setPosY(node.position?.y || 0);
      setZIndex(node.data?.zIndex || 0);
      setImageUrl(node.data?.url || "");
    }
  }, [node]);

  const handleSave = () => {
    const updatedData = {
      ...node.data,
      content,
      color,
      backgroundColor,
      zIndex,
      ...(node.type === 'image' && { url: imageUrl }),
    };

    onUpdateNode(node.id, {
      ...node,
      data: updatedData,
      position: { x: Number(posX), y: Number(posY) },
      style: {
        ...node.style,
        color,
        backgroundColor,
        zIndex: Number(zIndex),
      },
    });

    toast.success("¡Guardado con exito!");
  };

  if (!node || !isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-white border-l shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Propiedades del nodo - {node?.data?.label}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Contenido adicional</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
              />
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 p-1"
              />
            </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Posición X</Label>
            <Input
              type="number"
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Posición Y</Label>
            <Input
              type="number"
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Orden Z (capa)</Label>
          <Input
            type="number"
            value={zIndex}
            onChange={(e) => setZIndex(Number(e.target.value))}
            min="0"
          />
        </div>

        {node.type === 'image' && (
          <div className="space-y-2">
            <Label>URL de la imagen</Label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}