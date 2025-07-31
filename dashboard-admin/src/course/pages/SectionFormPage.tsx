import SectionList from "../components/SectionForm/SectionList";
import SectionForm from "../components/SectionForm/SectionForm";

import {
  SectionProvider,
  useSectionContext,
} from "../context/SectionFormContext";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSectionById } from "../services/sectionServices";

import { ISection } from "../interfaces/CourseForm";
import { IContent } from "../interfaces/Content";

function SectionManager() {
  const { courseId, sectionId } = useParams<string>();
  const { state: sectionState } = useSectionContext();

  useEffect(() => {
    const getSection = async () => {
      if (sectionId) {
        try {
          const response = await getSectionById(sectionId);
          sectionState.section = transformSectionData(response);
        } catch (err) {
          console.error("Hubo un error: ", err);
        }
      }
    };

    getSection();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Tienes cambios sin guardar. ¿Estás seguro de salir?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const transformSectionData = (section: any): ISection => {
    return {
      title: section.title,
      description: section.description,
      moduleType: section.moduleType,
      coverImage: section.coverImage,
      colorGradient: section.colorGradient,
      contents: section.contents.map((content: IContent) => {
        return {
          id: content.id,
          title: content.title,
          text: content.text,
          markdown: content.markdown,
          quiz:
            content.quiz && typeof content.quiz === "string"
              ? JSON.parse(content.quiz)
              : content.quiz,
          resources:
            content.resources && typeof content.resources === "string"
              ? JSON.parse(content.resources)
              : content.resources,
          duration: content.duration,
          position: content.position,
        };
      }),
    };
  };

  console.log("El estado de la seccino es: ", sectionState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-4/5 p-5 border rounded-xl shadow-md bg-white mt-20 mb-20">
        <>
          {sectionState.section === null || sectionState.isEditingSection ? (
            <SectionForm />
          ) : courseId ? (
            sectionId ? (
              <SectionList courseId={courseId} sectionId={sectionId} />
            ) : (
              <SectionList courseId={courseId} />
            )
          ) : (
            <p>Cargando...</p>
          )}
        </>
      </div>
    </div>
  );
}

function SectionsAndContentsPage() {
  return (
    <SectionProvider>
      <SectionManager />
    </SectionProvider>
  );
}
export default SectionsAndContentsPage;
