import React from "react";
import CourseForm from "../components/Forms/CourseForm";
import SectionList from "../components/Forms/Section/SectionList";
import SectionForm from "../components/Forms/Section/SectionForm";

import { SectionProvider, useSectionContext } from "../context/SectionContext";
import { ContentProvider, useContentContext } from "../context/ContentContext";
import { CourseProvider, useCourseContext } from "../context/CourseContext";

function SectionManager() {
  const { state: sectionState } = useSectionContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 p-5 border rounded-md shadow-md bg-white mt-20 mb-20">

        <CourseForm />

          {sectionState.isAddingSection || sectionState.editingSection ? (
          <SectionForm />
        ) : (
          <SectionList />
        )}

      </div>
    </div>
  );
}

function CourseFormPage() {
    return (
       <CourseProvider>
            <SectionProvider>
                <ContentProvider>
                    <SectionManager />
                </ContentProvider>
            </SectionProvider>
       </CourseProvider>
);
}
export default CourseFormPage;
