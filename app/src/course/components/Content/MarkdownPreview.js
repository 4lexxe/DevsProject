import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Markdown from "markdown-to-jsx";
export default function MarkdownPreview({ markdown }) {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "", children: "Previsualizacion del texto en markdown" }), _jsx("div", { className: "prose ", style: { maxWidth: "100%", maxHeight: "100%", overflow: "auto" }, children: _jsx(Markdown, { children: markdown }) })] }));
}
