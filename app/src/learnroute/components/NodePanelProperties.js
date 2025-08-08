import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Textarea } from '../components/Textarea';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { componentPropertiesConfig } from '../types/CustomComponentType';
export function NodeInfoPanel({ isOpen, onClose, node, onUpdateNode }) {
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
    const nodeType = node?.type;
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
            measured: config.showMeasured ? { width, height } : undefined,
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
    const handleSizeChange = (dimension, value) => {
        const newMeasured = {
            ...node.measured,
            [dimension]: value
        };
        if (dimension === 'width') {
            setWidth(value);
        }
        else {
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
    const handlePositionChange = (axis, value) => {
        if (axis === 'x') {
            setPosX(value);
        }
        else {
            setPosY(value);
        }
        // Actualizar la posición del nodo en el gráfico
        onUpdateNode(node.id, {
            ...node,
            position: { x: axis === 'x' ? value : posX, y: axis === 'y' ? value : posY },
        });
    };
    if (!node || !isOpen)
        return null;
    return (_jsxs("div", { className: "fixed right-0 top-16 h-[calc(100vh-61px)] w-[400px] bg-white border-l shadow-lg p-6 overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold", children: ["Propiedades del nodo - ", nodeType] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, children: "\u2715" })] }), _jsxs("div", { className: "space-y-4", children: [config.showLabel && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Contenido label:" }), _jsx(Textarea, { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "A\u00F1ade informaci\u00F3n adicional aqu\u00ED...", className: "min-h-[100px]" })] })), config.showContent && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Contenido adicional:" }), _jsx(Textarea, { value: content, onChange: (e) => setContent(e.target.value), placeholder: "A\u00F1ade informaci\u00F3n adicional aqu\u00ED...", className: "min-h-[100px]" })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [config.showColorText && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Color del texto" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "text", value: colorText, onChange: (e) => setColorText(e.target.value), placeholder: "#000000" }), _jsx(Input, { type: "color", value: colorText, onChange: (e) => setColorText(e.target.value), className: "w-12 p-1" })] })] })), config.showBorderColor && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Color del borde" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "text", value: borderColor, onChange: (e) => setBorderColor(e.target.value), placeholder: "#cccccc" }), _jsx(Input, { type: "color", value: borderColor, onChange: (e) => setBorderColor(e.target.value), className: "w-12 p-1" })] })] })), config.showBackgroundColor && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Color de fondo" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "text", value: backgroundColor, onChange: (e) => setBackgroundColor(e.target.value), placeholder: "#ffffff" }), _jsx(Input, { type: "color", value: backgroundColor, onChange: (e) => setBackgroundColor(e.target.value), className: "w-12 p-1" })] })] })), config.showBorderRadius && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Border Radius" }), _jsx("div", { className: "flex gap-2", children: _jsx(Input, { type: "number", value: borderRadius, onChange: (e) => setBorderRadius(e.target.value), min: "1", defaultValue: "8" }) })] }))] }), config.showFontSize && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Tama\u00F1o de la letra (px)" }), _jsx(Input, { type: "number", value: fontSize, onChange: (e) => setFontSize(Number(e.target.value)), min: "10" })] })), config.showLayoutOrder && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Orden del layout (z-index)" }), _jsx(Input, { type: "number", value: layoutOrder, onChange: (e) => setLayoutOrder(Number(e.target.value)), min: "0" })] })), _jsx("div", { className: "grid grid-cols-2 gap-4", children: config.showFontFamily && (_jsxs("div", { className: "space-y-2 col-span-2", children: [_jsx(Label, { children: "Tipo de fuente" }), _jsxs("select", { value: fontFamily, onChange: (e) => setFontFamily(e.target.value), className: "w-full p-2 border rounded-md", children: [_jsx("option", { value: "Arial", children: "Arial" }), _jsx("option", { value: "Times New Roman", children: "Times New Roman" }), _jsx("option", { value: "Helvetica", children: "Helvetica" }), _jsx("option", { value: "Georgia", children: "Georgia" }), _jsx("option", { value: "Verdana", children: "Verdana" }), _jsx("option", { value: "system-ui", children: "System UI" })] })] })) }), config.showPosition && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Posici\u00F3n X" }), _jsx(Input, { type: "number", value: posX, onChange: (e) => handlePositionChange('x', Number(e.target.value)) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Posici\u00F3n Y" }), _jsx(Input, { type: "number", value: posY, onChange: (e) => handlePositionChange('y', Number(e.target.value)) })] })] })), config.showMeasured && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Ancho (px)" }), _jsx(Input, { type: "number", value: width, min: "50", max: "800", onChange: (e) => {
                                            const newWidth = Number(e.target.value);
                                            setWidth(newWidth);
                                            handleSizeChange('width', newWidth);
                                        } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Alto (px)" }), _jsx(Input, { type: "number", value: height, min: "30", max: "600", onChange: (e) => {
                                            const newHeight = Number(e.target.value);
                                            setHeight(newHeight);
                                            handleSizeChange('height', newHeight);
                                        } })] })] })), _jsx(Button, { onClick: handleSave, className: "w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded", children: "Guardar cambios" })] })] }));
}
