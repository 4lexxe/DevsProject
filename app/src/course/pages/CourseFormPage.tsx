import React, { useEffect, useState } from "react";
import CourseForm from "../components/forms/course/CourseForm";
import { useParams } from "react-router-dom";
import { getById } from "../services/courseServices";

function CourseFormPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>();

  useEffect(() => {
    const getCourse = async () => {
      if (id) {
        try {
          const c = await getById(id);
          setCourse(transformCourseData(c));
        } catch (err) {
          console.error("Hubo un error: ", err);
        }
      }
    };

    getCourse();
  }, []);

  const transformCourseData = (course: any) => {
    return {
      ...course,
      categoryIds: course.categories.map((category: any) => category.id),
      careerTypeId: course.careerTypeId || "",
      learningOutcomes: Array.isArray(course.learningOutcomes)
        ? course.learningOutcomes.length > 0
          ? course.learningOutcomes.join("\n")
          : ""
        : "",
      prerequisites: Array.isArray(course.prerequisites)
        ? course.prerequisites.length > 0
          ? course.prerequisites.join("\n")
          : ""
        : "",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 p-5 border rounded-md shadow-md bg-white mt-20 mb-20">
        {id ? (
          /* Formulario para edicion */
          <CourseForm course={course} />
        ) : (
          /* Formulario para creacion */
          <CourseForm />
        )}
      </div>
    </div>
  );
}
export default CourseFormPage;
