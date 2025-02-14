import React from 'react'
import { Node, NodeProps } from "@xyflow/react"
import { CustomComponentData, CustomComponentType } from '../types/CustomComponentType';
import { MdCheckBoxOutlineBlank, MdOutlineTopic, MdTopic, MdNoteAlt   } from "react-icons/md";
import { FaGripLinesVertical,FaLink } from "react-icons/fa";
import { BsTypeH1,BsTextParagraph } from "react-icons/bs";
import { LuListTodo, LuMousePointerClick  } from "react-icons/lu";
import { TbSection } from "react-icons/tb";


type CustomComponentNode = Node<CustomComponentData, 'string'>;

function NodeButton({
    data: {value, type},
}: NodeProps<CustomComponentNode>) {
  return (
    <div  className='relative'>
        {type === CustomComponentType.NodeButton && <MdCheckBoxOutlineBlank size={24}/>}
        {type === CustomComponentType.H1 && <BsTypeH1 size={24}/>}
        {type === CustomComponentType.Parrafo && <BsTextParagraph size={24}/>}
        <span className="text-sm absolute">
            {value}
        </span>
    </div>
  )
}

export default NodeButton