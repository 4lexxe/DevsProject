import { Node } from "@xyflow/react";
import { CustomComponentType } from "../types/CustomComponentType";
import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt   } from "react-icons/md";
import { FaGripLinesVertical } from "react-icons/fa";
import { BsTypeH1 } from "react-icons/bs";
import { BsTextParagraph } from "react-icons/bs";
import { LuListTodo, LuMousePointerClick  } from "react-icons/lu";
import { FaLink } from "react-icons/fa";
import { TbSection } from "react-icons/tb";


export const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    type: "nodeButton",
    data: { type: CustomComponentType.NodeButton, value: "Nuevo NODO" },
  },
  {
    id: "2",
    position: { x: 200, y: 200 },
    type: "nodeButton",
    data: { type: CustomComponentType.NodeButton, value: 3 },
  },
  {
    id: "3",
    position: { x: 300, y: 300 },
    type: "nodeButton",
    data: { type: CustomComponentType.NodeButton, value: 3 },
  },
];

export const COMPONENTS = [
    {
        type: "nodeButton",
        label: "Nodo",
        icon: <MdCheckBoxOutlineBlank/>,
        data: { content: "Nuevo Nodo" }
    },
    {
        type: "line",
        label: "Linea",
        icon: <FaGripLinesVertical/>,
    },
    { 
        type: "h1", 
        label: "H1 Título", 
        icon: <BsTypeH1/>, 
        data: { content: "Título principal" } 
    },
    { 
        type: "tema", 
        label: "Tema", 
        icon: <MdTopic/>, 
        data: { content: "Nuevo tema" } 
    },
    { 
        type: "subtema",
        label: "Subtema", 
        icon:  <MdOutlineTopic />, 
        data: { content: "Subsección" } },
    { 
        type: "parrafo", 
        label: "Párrafo", 
        icon: <BsTextParagraph/>, 
        data: { content: "Texto descriptivo..." } 
    },
    { 
        type: "todo", 
        label: "ToDo", 
        icon: <LuListTodo/>, 
        data: { tasks: [] } 
    },
    {
        type: "etiqueta",
        label: "Etiqueta",
        icon: <MdNoteAlt/>,
        data: { content: "Nueva etiqueta..." },
    },
    {
        type: "botonClick",
        label: "Boton Click",
        icon: <LuMousePointerClick />,
        data: { content: "Nuevo Boton click..." },
    },
    { 
        type: "link", 
        label: "Link", 
        icon: <FaLink/>, 
        data: { url: "https://" } 
    },
    {
        type: "seccion",
        label: "Seccion",
        icon: <TbSection/>,
    }
  ];