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
    value?: number;
    type?: CustomComponentType;
    rotation?: number;
    state?: CustomComponentState;
    isAttachedToGroup?: boolean;
    visible?: boolean;
    connectable?: boolean;
  };
  
  /*export enum HistoryAction {
    AddNode = "addNode",
    RemoveNode = "removeNode",
    AddEdge = "addEdge",
    RemoveEdge = "removeEdge",
  }*/