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

  export type ComponentPropertiesConfig = {
    [key in CustomComponentType]: {
      showLabel: boolean;
      showBorderColor: boolean;
      showBackgroundColor: boolean;
      showColorText: boolean;
      showBorderRadius: boolean;
      showFontSize: boolean;
      showLayoutOrder: boolean;
      showPosition: boolean;
      showContent: boolean;
      showMeasured: boolean;
    };
  };

  export const componentPropertiesConfig: ComponentPropertiesConfig = {
    [CustomComponentType.H1]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: false,
      showMeasured: true,
    },
    [CustomComponentType.Tema]: {
      showLabel: true,
      showBorderColor: true,
      showBackgroundColor: true,
      showColorText: true,
      showBorderRadius: true,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.Subtema]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: false,
      showMeasured: true,
    },
    [CustomComponentType.NodeButton]: {
      showLabel: true,
      showBorderColor: true,
      showBackgroundColor: true,
      showColorText: true,
      showBorderRadius: true,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.Line]: {
      showLabel: false,
      showBorderColor: true,
      showBackgroundColor: false,
      showColorText: false,
      showBorderRadius: false,
      showFontSize: false,
      showLayoutOrder: false,
      showPosition: true,
      showContent: false,
      showMeasured: true,
    },
    [CustomComponentType.Parrafo]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.ToDo]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.Etiqueta]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.BotonClick]: {
      showLabel: true,
      showBorderColor: true,
      showBackgroundColor: true,
      showColorText: true,
      showBorderRadius: true,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.Link]: {
      showLabel: true,
      showBorderColor: false,
      showBackgroundColor: false,
      showColorText: true,
      showBorderRadius: false,
      showFontSize: true,
      showLayoutOrder: true,
      showPosition: true,
      showContent: true,
      showMeasured: true,
    },
    [CustomComponentType.Seccion]: {
      showLabel: false,
      showBorderColor: true,
      showBackgroundColor: true,
      showColorText: false,
      showBorderRadius: true,
      showFontSize: false,
      showLayoutOrder: false,
      showPosition: true,
      showContent: false,
      showMeasured: true,
    }
  };

  /*export enum HistoryAction {
    AddNode = "addNode",
    RemoveNode = "removeNode",
    AddEdge = "addEdge",
    RemoveEdge = "removeEdge",
  }*/