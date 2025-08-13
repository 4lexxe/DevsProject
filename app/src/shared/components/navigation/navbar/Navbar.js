import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import DesktopNavbar from './NavbarDesktop';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
export default function Navbar() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    if (isMobile) {
        return (_jsxs(_Fragment, { children: [_jsx(TopNavbar, {}), _jsx("div", { className: "pb-16" }), _jsx(BottomNavbar, {})] }));
    }
    return _jsx(DesktopNavbar, {});
}
