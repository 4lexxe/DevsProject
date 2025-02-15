export enum CustomComponentType {
    NodeButton = "nodeButton",
    Line = "line",
    H1 = "h1",
    Tema = "tema",
    Subtema = "subtema",
    Parrafo = "parrafo",
    ToDo = "todo",
    Etiqueta = "etiqueta",
    BotonClick = "botonClick",
    Link = "link",
    Seccion= "seccion"
  }
  
  export enum CustomComponentState {
    Add = "add",
    NotAdd = "notAdd",
  }
  
  export type CustomComponentData = {
    id?: string;
    position?: {
        x: number;
        y: number;
    };
    measured?: {
      width: number;
      height: number;
    };
    value?: number;
    type?: CustomComponentType;
    color?: string;
    rotation?: number;
    isAttachedToGroup?: boolean;
    visible?: boolean;
    connectable?: boolean;
  };

  export type TitleNodeData = CustomComponentData & {
    label: string;
  };

  export type NodeButtonData = CustomComponentData & {
    label: string;
    colorText: string;
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    fontSize: number;
    layoutOrder: number;
    content?: string;
    zIndex?: number;
  };

  export type TemaNodeData = CustomComponentData & {
    label: string;
    colorText: string;
    backgroundColor: string;
    borderColor:string; //feat(borderColor):string;
    borderRadius: number; //feat(borderRadius):string;
    fontSize: number;
    layoutOrder: number;
    content?: string;
    zIndex?: number;
  };
  
  export type SubtemaNodeData = CustomComponentData & {
    label: string;
    colorText: string;
  }

  export type ParrafoNodeData = CustomComponentData & {
    label: string;
    colorText: string;
  }

  export type TodoNodeData = CustomComponentData & {
    label: string;
    colorText: string;
  }

  export type LinkNodeData = CustomComponentData & {
    label: string;
    link: string;
    colorText: string;
  }

  export type SeccionNodeData = CustomComponentData & {
    borderColor: string;
    bgColor: string;
    borderRadius: string;
  }

  /*export enum HistoryAction {
    AddNode = "addNode",
    RemoveNode = "removeNode",
    AddEdge = "addEdge",
    RemoveEdge = "removeEdge",
  }*/