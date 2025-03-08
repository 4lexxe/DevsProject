import { FiTag } from "react-icons/fi";
import { LuHouse, LuBookmark  } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegStar, FaRegUser,FaShieldAlt   } from "react-icons/fa";
import { BsGear } from "react-icons/bs";

export const COMPONENTS = [
    {
        label: "Inicio",
        icon: LuHouse,
    },
    {
        label: "Populares",
        icon: FaArrowTrendUp,
    },
    { 
        label: "Guardados", 
        icon: LuBookmark, 
    },  
    { 
        label: "Categorías", 
        icon: FiTag, 
    },
    { 
        label: "Destacados", 
        icon:  FaRegStar, 
    },
    { 
        label: "Usuarios", 
        icon: FaRegUser, 
    },
    { 
        label: "Moderación", 
        icon: FaShieldAlt, 
    },
    {
        label: "Configuración",
        icon: BsGear,
    },
  ];