import React from "react";
import CourseForm from "../components/forms/course/CourseForm";


function SectionManager() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 p-5 border rounded-md shadow-md bg-white mt-20 mb-20">
        
          <CourseForm />
        
      </div>
    </div>
  );
}

function CourseFormPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 p-5 border rounded-md shadow-md bg-white mt-20 mb-20">
        
          <CourseForm />
        
      </div>
    </div>
  );
}
export default CourseFormPage;
