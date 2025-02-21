import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt   } from "react-icons/md";
import { FaGripLinesVertical,FaLink } from "react-icons/fa";
import { BsTypeH1,BsTextParagraph } from "react-icons/bs";
import { LuListTodo  } from "react-icons/lu";
import { TbSection } from "react-icons/tb";
import { CustomComponentType } from "../types/CustomComponentType";

export const COMPONENTS = [
    {
        type: CustomComponentType.NodeButton,
        label: "Nodo",
        icon: <MdCheckBoxOutlineBlank/>,
        data: { content: "Nuevo Nodo" }
    },
    {
        type: CustomComponentType.Line,
        label: "Linea",
        icon: <FaGripLinesVertical/>,
    },
    { 
        type: CustomComponentType.H1, 
        label: "H1 Título", 
        icon: <BsTypeH1/>, 
        data: { content: "Título principal" } 
    },
    { 
        type: CustomComponentType.Tema, 
        label: "Tema", 
        icon: <MdTopic/>, 
        data: { content: "Nuevo tema" } 
    },
    { 
        type: CustomComponentType.Subtema,
        label: "Subtema", 
        icon:  <MdOutlineTopic />, 
        data: { content: "Subsección" } },
    { 
        type: CustomComponentType.Parrafo, 
        label: "Párrafo", 
        icon: <BsTextParagraph/>, 
        data: { content: "Texto descriptivo..." } 
    },
    { 
        type: CustomComponentType.ToDo, 
        label: "ToDo", 
        icon: <LuListTodo/>, 
        data: { tasks: [] } 
    },
    {
        type: CustomComponentType.Etiqueta,
        label: "Etiqueta",
        icon: <MdNoteAlt/>,
        data: { content: "Nueva etiqueta..." },
    },
    { 
        type: CustomComponentType.Link, 
        label: "Link", 
        icon: <FaLink/>, 
        data: { url: "https://" } 
    },
    {
        type: CustomComponentType.Seccion,
        label: "Seccion",
        icon: <TbSection/>,
    }
  ];