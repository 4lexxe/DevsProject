import React, { createContext, useContext, useEffect } from "react";
import { ICourse, ICourseInput, ICourseState } from "../interfaces/interfaces";

// Definimos el tipo de datos que manejará el contexto del curso
interface CourseContextType {
    course: ICourse | null; // El único curso que estamos manejando
    editCourse: (courseData: ICourseInput) => void;
    clearCourse: () => void;
    updateCourseAttribute: (attributeName: keyof ICourse, value: any) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const STORAGE_KEY = "course-data";

const getInitialCourse = (): ICourse | null => {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing stored course data:", error);
        }
    }
    return null; // Si no hay datos almacenados, no hay curso inicialmente
};

export function CourseProvider({ children }: { children: React.ReactNode }) {
    const [course, setCourse] = React.useState<ICourse | null>(getInitialCourse);

    // Guardamos en sessionStorage el curso cada vez que cambia
    useEffect(() => {
        if (course) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(course));
        }
    }, [course]);

    const editCourse = (courseData: ICourseInput) => {
        setCourse((prev) => ({
            ...prev,
            ...courseData,
            id: prev?.id || crypto.randomUUID(), // Mantenemos el ID existente o generamos uno nuevo
        }));
    };

    const clearCourse = () => {
        setCourse(null); // Restablecemos el curso a null
        sessionStorage.removeItem(STORAGE_KEY); // Removemos los datos almacenados
    };

    // Nueva función para actualizar un atributo específico de `course`
    const updateCourseAttribute = (attributeName: keyof ICourse, value: any) => {
        setCourse((prev) => {
            if (!prev) {
                console.warn("No hay un curso disponible para actualizar.");
                return null; // Si no hay curso, retornar null
            }
            return {
                ...prev,
                [attributeName]: value, // Actualiza dinámicamente el atributo
            };
        });
    };

    return (
        <CourseContext.Provider
            value={{
                course,
                editCourse,
                clearCourse,
                updateCourseAttribute, // Exponer la nueva función
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}



export function useCourseContext() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error("useCourseContext must be used within a CourseProvider");
    }
    return context;
}

