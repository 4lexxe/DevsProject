import React from "react";
import CourseForm from "../components/forms/course/CourseForm";
import SectionList from "../components/forms/section/SectionList";
import SectionForm from "../components/forms/section/SectionForm";

import { CourseProvider, useCourseContext } from "../context/CourseFormContext";
import { QuizProvider, useQuizContext } from "../context/QuizFormContext";
import QuizForm from "../components/forms/content/QuizForm";

function SectionManager() {
  const { state: sectionState } = useCourseContext();
  const { isAddingQuiz, isEditingQuiz } = useQuizContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 p-5 border rounded-md shadow-md bg-white mt-20 mb-20">
        {isAddingQuiz || isEditingQuiz ? (
          <QuizForm />
        ) : (
          <>
            {sectionState.isAddingSection || sectionState.editingSection ? (
              <SectionForm />
            ) : (
              <SectionList />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SectionsAndContentsPage() {
  return (
    <CourseProvider>
      <QuizProvider>
        <SectionManager/>
      </QuizProvider>
    </CourseProvider>
  );
}
export default SectionsAndContentsPage;
