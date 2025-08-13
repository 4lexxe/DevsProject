export var CustomComponentType;
(function (CustomComponentType) {
    CustomComponentType["NodeButton"] = "nodeButton";
    CustomComponentType["Line"] = "line";
    CustomComponentType["H1"] = "h1";
    CustomComponentType["Tema"] = "tema";
    CustomComponentType["Subtema"] = "subtema";
    CustomComponentType["Parrafo"] = "parrafo";
    CustomComponentType["ToDo"] = "todo";
    CustomComponentType["Etiqueta"] = "etiqueta";
    CustomComponentType["Link"] = "link";
    CustomComponentType["Seccion"] = "seccion";
})(CustomComponentType || (CustomComponentType = {}));
export var CustomComponentState;
(function (CustomComponentState) {
    CustomComponentState["Add"] = "add";
    CustomComponentState["NotAdd"] = "notAdd";
})(CustomComponentState || (CustomComponentState = {}));
export const componentPropertiesConfig = {
    [CustomComponentType.H1]: {
        showLabel: true,
        showBorderColor: true,
        showBackgroundColor: true,
        showColorText: true,
        showBorderRadius: true,
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
        showBorderColor: true,
        showBackgroundColor: true,
        showColorText: true,
        showBorderRadius: true,
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
        showContent: false,
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
        showLabel: false,
        showBorderColor: true,
        showBackgroundColor: false,
        showColorText: true,
        showBorderRadius: true,
        showFontSize: true,
        showLayoutOrder: true,
        showPosition: true,
        showContent: true,
        showMeasured: true,
        showFontFamily: true,
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
        showContent: false,
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
        showContent: false,
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
