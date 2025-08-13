import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { getCourses } from '@/course/services/courseServices';
export default function LatestCourses() {
    const [courses, setCourses] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const carouselRef = useRef(null);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                const sortedCourses = data
                    .filter((course) => course.id && course.id !== undefined)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10);
                setCourses(sortedCourses);
            }
            catch (error) {
                console.error('No se pudieron cargar los cursos', error);
            }
        };
        fetchCourses();
    }, []);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            }
            else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
            }
            else {
                setSlidesToShow(3);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const nextSlide = () => {
        if (currentIndex < courses.length - slidesToShow) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };
    const maxSlides = Math.max(0, courses.length - slidesToShow);
    return (_jsx("section", { className: "py-8 sm:py-12 lg:py-16 px-4 sm:px-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4", children: [_jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-black", children: "\u00DAltimos Cursos" }), _jsxs("a", { href: "/cursos", className: "flex items-center text-[#00D7FF] hover:text-[#66E7FF] transition-colors text-sm sm:text-base", children: ["Ver todos", _jsx(ArrowRight, { className: "ml-2 w-4 h-4 sm:w-5 sm:h-5" })] })] }), _jsxs("div", { className: "relative", children: [slidesToShow < courses.length && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: prevSlide, disabled: currentIndex === 0, className: "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed -translate-x-1/2", children: _jsx(ChevronLeft, { className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" }) }), _jsx("button", { onClick: nextSlide, disabled: currentIndex >= maxSlides, className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed translate-x-1/2", children: _jsx(ChevronRight, { className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" }) })] })), _jsx("div", { className: "overflow-hidden relative", children: _jsx("div", { ref: carouselRef, className: "flex transition-transform duration-500 ease-in-out", style: {
                                    transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
                                }, children: courses.map((course) => (_jsx("div", { className: `flex-none px-2 sm:px-3 ${slidesToShow === 1 ? 'w-full' :
                                        slidesToShow === 2 ? 'w-1/2' : 'w-1/3'}`, children: _jsx("div", { className: "w-full", children: _jsx(CourseCard, { id: course.id, title: course.title, summary: course.summary, courseName: course.category, image: course.image, careerType: course.careerType?.name || 'Sin categoría', pricing: course.pricing }) }) }, course.id))) }) }), slidesToShow < courses.length && (_jsx("div", { className: "flex justify-center mt-4 sm:mt-6 space-x-2", children: Array.from({ length: maxSlides + 1 }).map((_, index) => (_jsx("button", { onClick: () => goToSlide(index), className: `w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-[#00D7FF] scale-110'
                                    : 'bg-gray-300 hover:bg-gray-400'}` }, index))) }))] })] }) }));
}
