import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt   } from "react-icons/md";
import { FaGripLinesVertical,FaLink } from "react-icons/fa";
import { BsTypeH1,BsTextParagraph } from "react-icons/bs";
import { LuListTodo, LuMousePointerClick  } from "react-icons/lu";
import { TbSection } from "react-icons/tb";

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