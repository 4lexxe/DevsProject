import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SideNavigationLoading from "../components/Content/SideNavigationLoading";
import ContentLoading from "../components/Content/ContentLoading";
const ContentPage = () => {
    const { contentId } = useParams();
    const { courseId } = useParams();
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Maneja la transición suave
    const handleSidebarToggle = (expanded) => {
        setIsTransitioning(true);
        setSidebarExpanded(expanded);
        // Reset transitioning state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500); // Match duration to the CSS transition
    };
    if (!contentId || !courseId) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50", children: _jsx("div", { className: "animate-pulse text-xl text-gray-600", children: "Cargando..." }) }));
    }
    return (_jsx("div", { className: "h-full from-cyan-50 via-white to-slate-100 mx-5 lg:mx-8 xl:mx-12 my-12", children: _jsxs("div", { className: `flex flex-row gap-4 lg:gap-8 xl:gap-12 justify-between transition-all duration-500`, children: [_jsx(ContentLoading, { contentId: contentId, courseId: courseId }), _jsx(SideNavigationLoading, { contentId: contentId, courseId: courseId, sidebarExpanded: sidebarExpanded, setSidebarExpanded: handleSidebarToggle })] }) }));
};
export default ContentPage;
