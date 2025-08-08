import { jsx as _jsx } from "react/jsx-runtime";
import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt } from "react-icons/md";
import { FaGripLinesVertical, FaLink } from "react-icons/fa";
import { BsTypeH1, BsTextParagraph } from "react-icons/bs";
import { LuListTodo } from "react-icons/lu";
import { TbSection } from "react-icons/tb";
import { CustomComponentType } from "../types/CustomComponentType";
export const COMPONENTS = [
    {
        type: CustomComponentType.NodeButton,
        label: "Nodo",
        icon: _jsx(MdCheckBoxOutlineBlank, {}),
        data: { content: "Nuevo Nodo" }
    },
    {
        type: CustomComponentType.Line,
        label: "Linea",
        icon: _jsx(FaGripLinesVertical, {}),
    },
    {
        type: CustomComponentType.H1,
        label: "H1 Título",
        icon: _jsx(BsTypeH1, {}),
        data: { content: "Título principal" }
    },
    {
        type: CustomComponentType.Tema,
        label: "Tema",
        icon: _jsx(MdTopic, {}),
        data: { content: "Nuevo tema" }
    },
    {
        type: CustomComponentType.Subtema,
        label: "Subtema",
        icon: _jsx(MdOutlineTopic, {}),
        data: { content: "Subsección" }
    },
    {
        type: CustomComponentType.Parrafo,
        label: "Párrafo",
        icon: _jsx(BsTextParagraph, {}),
        data: { content: "Texto descriptivo..." }
    },
    {
        type: CustomComponentType.ToDo,
        label: "ToDo",
        icon: _jsx(LuListTodo, {}),
        data: { tasks: [] }
    },
    {
        type: CustomComponentType.Etiqueta,
        label: "Etiqueta",
        icon: _jsx(MdNoteAlt, {}),
        data: { content: "Nueva etiqueta..." },
    },
    {
        type: CustomComponentType.Link,
        label: "Link",
        icon: _jsx(FaLink, {}),
        data: { url: "https://" }
    },
    {
        type: CustomComponentType.Seccion,
        label: "Seccion",
        icon: _jsx(TbSection, {}),
    }
];
