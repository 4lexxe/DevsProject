import { jsx as _jsx } from "react/jsx-runtime";
const ActionButton = ({ href, children }) => {
    return (_jsx("a", { href: href, className: "inline-block px-8 py-4 mt-4 text-lg font-semibold text-black bg-[#00D7FF] rounded-full hover:bg-[#00b3cc] transition", children: children }));
};
export default ActionButton;
