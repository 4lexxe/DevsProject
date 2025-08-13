"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown, ChevronRight, CheckSquare, Square, BookOpen, Play, GraduationCap } from "lucide-react";
//import  ButtonRoadmap  from "@/shared/components/buttons/ButtonRoadmap"
import { Badge } from "./Badge";
import { Button } from "./Button";
const currentLevel = {
    number: 1,
    title: "Beginner Level",
    goal: "Create your very first simple Laravel project.",
    topics: [
        {
            id: "1",
            title: "Routing and Controllers: Basics",
            completed: false,
            resources: [
                { type: "Test", title: "Let's Test Your Laravel Routing Skills: Complete 12 Tasks", url: "#" },
                { type: "Docs", title: "Basic Routing", url: "#" },
                { type: "Docs", title: "View Routes", url: "#" },
            ],
        },
        {
            id: "2",
            title: "Callback Functions and Route::view()",
            completed: false,
            resources: [
                { type: "Docs", title: "Basic Routing", url: "#" },
                { type: "Docs", title: "View Routes", url: "#" },
            ],
        },
        {
            id: "3",
            title: "Routing to a Single Controller Method",
            completed: false,
            resources: [{ type: "Docs", title: "Basic Controllers with Routes", url: "#" }],
        },
        {
            id: "4",
            title: "Route Parameters",
            completed: false,
            resources: [{ type: "Docs", title: "Route Parameters", url: "#" }],
        },
        {
            id: "5",
            title: "Route Naming",
            completed: false,
            resources: [
                { type: "Docs", title: "Named Routes", url: "#" },
                { type: "Video", title: "Laravel: Why You Need Route Names?", url: "#" },
            ],
        },
        {
            id: "6",
            title: "Route Groups",
            completed: false,
            resources: [
                { type: "Docs", title: "Route Groups", url: "#" },
                { type: "Video", title: "Laravel Route Grouping: Simple to Very Complex", url: "#" },
            ],
        },
    ],
};
// Componente Progress simple
const Progress = ({ progress, className }) => (_jsx("div", { className: `bg-gray-200 rounded-full ${className}`, children: _jsx("div", { className: "bg-blue-600 h-full rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }));
// Datos de ejemplo para courseProgress
const courseProgress = {
    sections: [
        {
            id: 1,
            title: "Introducción a React",
            description: "Conceptos básicos de React",
            moduleType: "Básico",
            progress: 75,
            completedContent: 3,
            totalContent: 4,
            contents: [
                {
                    id: 1,
                    title: "¿Qué es React?",
                    duration: 15,
                    timeSpent: 15,
                    isCompleted: true,
                    completedAt: "2024-01-15"
                },
                {
                    id: 2,
                    title: "Componentes y JSX",
                    duration: 20,
                    timeSpent: 10,
                    isCompleted: false,
                    completedAt: null
                }
            ]
        }
    ]
};
export default function LearningPath() {
    const [expandedTopics, setExpandedTopics] = useState([]);
    const [completedTopics] = useState([]);
    const toggleTopic = (topicId) => {
        setExpandedTopics((current) => current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId]);
    };
    const toggleCompletion = (contentId, isCompleted) => {
        console.log(`Toggle completion for content ${contentId}, currently ${isCompleted}`);
        // Aquí iría la lógica para actualizar el estado de completado
    };
    const handleContentClick = (contentId) => {
        console.log(`Content clicked: ${contentId}`);
        // Aquí iría la lógica para navegar al contenido
    };
    const ResourceIcon = {
        Docs: BookOpen,
        Video: Play,
        Test: GraduationCap,
    };
    return (_jsx("div", { className: "bg-gray-50 py-16 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900", children: ["Level ", currentLevel.number, "/5: ", currentLevel.title] }), _jsxs("span", { className: "text-sm font-medium text-gray-500", children: [completedTopics.length, " of ", currentLevel.topics.length, " completed"] })] }), _jsxs("p", { className: "mt-4 text-gray-600", children: ["Goal: ", currentLevel.goal] })] }), _jsx("div", { className: "space-y-6", children: courseProgress.sections.map((section) => {
                        const isExpanded = expandedTopics.includes(section.id.toString());
                        const sectionCompleted = section.progress === 100;
                        return (_jsxs("div", { className: `border rounded-lg transition-colors ${sectionCompleted ? "bg-green-50/50 border-green-100" : "bg-white"}`, children: [_jsxs("div", { className: "flex items-center p-4 cursor-pointer", onClick: () => toggleTopic(section.id.toString()), children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-medium text-lg", children: section.title }), _jsxs("span", { className: "text-sm text-gray-500", children: [section.completedContent, "/", section.totalContent, " completados"] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: section.description }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Badge, { variant: "secondary", className: "text-xs", children: section.moduleType }), _jsx(Progress, { progress: section.progress, className: "h-2 flex-1" }), _jsxs("span", { className: "text-sm font-medium text-gray-700", children: [section.progress, "%"] })] })] }), _jsx(Button, { variant: "primary", size: "icon", className: "ml-4", children: isExpanded ? _jsx(ChevronDown, { className: "h-5 w-5" }) : _jsx(ChevronRight, { className: "h-5 w-5" }) })] }), isExpanded && (_jsx("div", { className: "px-4 pb-4 pt-0", children: _jsx("div", { className: "pl-4 space-y-3", children: section.contents.map((content) => {
                                            return (_jsxs("div", { className: `flex items-center p-3 rounded-lg border transition-colors ${content.isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`, children: [_jsx(Button, { variant: "primary", size: "icon", className: "h-6 w-6 mr-3", onClick: () => toggleCompletion(content.id, content.isCompleted), children: content.isCompleted ? (_jsx(CheckSquare, { className: "h-4 w-4 text-green-600" })) : (_jsx(Square, { className: "h-4 w-4 text-gray-400" })) }), _jsxs("div", { className: "flex-1 cursor-pointer", onClick: () => handleContentClick(content.id), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium text-sm", children: content.title }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [_jsxs("span", { children: [content.duration, " min"] }), content.timeSpent > 0 && (_jsxs("span", { children: ["\u2022 ", content.timeSpent, " min gastados"] }))] })] }), content.completedAt && (_jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Completado el ", new Date(content.completedAt).toLocaleDateString()] }))] })] }, content.id));
                                        }) }) }))] }, section.id));
                    }) })] }) }));
}
