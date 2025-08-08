import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Hero from './components/hero/Hero';
import Features from './components/features/Features';
import CourseCategories from './components/categories/CourseCategories';
import { ComingSoon } from './components/coming-soon/ComingSoon';
import LatestCourses from './components/courses/LatestCourses';
import CollaboratorsSection from './components/developers/CollaboratorsSection';
export default function Home() {
    return (_jsxs("main", { className: "w-full mx-auto ", children: [_jsx("section", { className: "w-full", children: _jsx(Hero, {}) }), _jsxs("section", { className: " mx-auto", children: [_jsx(Features, {}), _jsx(CourseCategories, {}), _jsx(LatestCourses, {}), _jsx(ComingSoon, {}), _jsx(CollaboratorsSection, {})] })] }));
}
