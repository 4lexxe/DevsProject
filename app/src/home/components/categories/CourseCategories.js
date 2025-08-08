import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CategoryCard from "./CategoryCard";
import { getCategoriesActivesLimited } from "@/home/services/categoriesService";
import { useState, useEffect } from "react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "@/shared/assets/styles/categorySwiper.css";
export default function CourseCategories() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesActivesLimited("8");
                setCategories(data);
            }
            catch (err) {
                console.error("Error al obtener las categorías:", err);
            }
        };
        fetchCategories();
    }, []);
    return (_jsx("section", { className: "py-20 bg-gradient-to-br from-gray-50 via-white to-slate-50", children: _jsxs("div", { className: "w-full max-w-7xl mx-auto px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("div", { className: "inline-flex items-center justify-center p-4 bg-blue-50 rounded-2xl mb-6", children: _jsx(GraduationCap, { className: "w-10 h-10 text-blue-600" }) }), _jsx("h2", { className: "text-4xl lg:text-5xl font-black text-gray-900 mb-4", children: _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Categor\u00EDas de Cursos" }) }), _jsx("p", { className: "text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-medium", children: "Explora nuestra amplia variedad de cursos organizados por categor\u00EDas especializadas" })] }), _jsxs("div", { className: "relative", children: [_jsx(Swiper, { modules: [Navigation, Pagination], navigation: {
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }, pagination: {
                                clickable: true,
                                dynamicBullets: true,
                            }, spaceBetween: 24, breakpoints: {
                                0: {
                                    slidesPerView: 1,
                                },
                                480: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                                1280: {
                                    slidesPerView: 5,
                                },
                                1536: {
                                    slidesPerView: 6,
                                }
                            }, className: "categories-swiper pb-12", children: categories.map((category) => (_jsx(SwiperSlide, { children: _jsx(CategoryCard, { ...category }) }, category.id))) }), _jsx("div", { className: "swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group", children: _jsx("svg", { className: "w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsx("div", { className: "swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group", children: _jsx("svg", { className: "w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] })] }) }));
}
