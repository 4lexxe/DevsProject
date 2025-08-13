import { jsx as _jsx } from "react/jsx-runtime";
import { CustomComponentType } from "../types/CustomComponentType";
import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt } from "react-icons/md";
import { FaGripLinesVertical } from "react-icons/fa";
import { BsTypeH1 } from "react-icons/bs";
import { BsTextParagraph } from "react-icons/bs";
import { LuListTodo, LuMousePointerClick } from "react-icons/lu";
import { FaLink } from "react-icons/fa";
import { TbSection } from "react-icons/tb";
export const initialNodes = [
    {
        id: '1',
        type: 'h1', // debe coincidir con el tipo registrado en nodeTypes
        position: { x: 100, y: 50 },
        data: {
            label: 'Nodo Izquierdo',
            measured: { width: 250, height: 60 },
            type: CustomComponentType.NodeButton
        },
    },
    {
        id: '2',
        type: 'h1',
        position: { x: 500, y: 50 },
        data: {
            label: 'Nodo Derecho',
            measured: { width: 250, height: 60 },
            type: CustomComponentType.NodeButton
        },
    },
];
export const COMPONENTS = [
    {
        type: "nodeButton",
        label: "Nodo",
        icon: _jsx(MdCheckBoxOutlineBlank, {}),
        data: { content: "Nuevo Nodo" }
    },
    {
        type: "line",
        label: "Linea",
        icon: _jsx(FaGripLinesVertical, {}),
    },
    {
        type: "h1",
        label: "H1 Título",
        icon: _jsx(BsTypeH1, {}),
        data: { content: "Título principal" }
    },
    {
        type: "tema",
        label: "Tema",
        icon: _jsx(MdTopic, {}),
        data: { content: "Nuevo tema" }
    },
    {
        type: "subtema",
        label: "Subtema",
        icon: _jsx(MdOutlineTopic, {}),
        data: { content: "Subsección" }
    },
    {
        type: "parrafo",
        label: "Párrafo",
        icon: _jsx(BsTextParagraph, {}),
        data: { content: "Texto descriptivo..." }
    },
    {
        type: "todo",
        label: "ToDo",
        icon: _jsx(LuListTodo, {}),
        data: { tasks: [] }
    },
    {
        type: "etiqueta",
        label: "Etiqueta",
        icon: _jsx(MdNoteAlt, {}),
        data: { content: "Nueva etiqueta..." },
    },
    {
        type: "botonClick",
        label: "Boton Click",
        icon: _jsx(LuMousePointerClick, {}),
        data: { content: "Nuevo Boton click..." },
    },
    {
        type: "link",
        label: "Link",
        icon: _jsx(FaLink, {}),
        data: { url: "https://" }
    },
    {
        type: "seccion",
        label: "Seccion",
        icon: _jsx(TbSection, {}),
    }
];
