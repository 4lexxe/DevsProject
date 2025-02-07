"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInput from "@/shared/components/inputs/CustomInput";
import CheckInput from "@/shared/components/inputs/CheckInput";
import TextAreaInput from "@/shared/components/inputs/TextAreaInput";
import SelectInput from "@/shared/components/inputs/SelectInput";

import { ICourseInput } from "@/course/interfaces/interfaces";
import { courseSchema, categories } from "@/course/validations/courseSchema";

export default function CourseForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      image: "",
      category: "",
      relatedCareerType: "",
      summary: "",
      about: "",
      learningOutcomes: "" ,
      isActive: false,
      isInDevelopment: false,
      Sections: [],
    }
  });

  const onSubmit: SubmitHandler<ICourseInput> = (data: ICourseInput): void => {
    const dataSections = sessionStorage.getItem("section-form-data");
    const dataContens = sessionStorage.getItem("content-form-data");

    const sections = dataSections ? JSON.parse(dataSections).sections : [];
    const contents = dataContens ? JSON.parse(dataContens).contents : [];

    console.log({...data, sections, contents});

    sessionStorage.clear();
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Añadir Nuevo Curso</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="title"
            register={register}
            type="text"
            error={errors["title"]?.message}
            labelText="Titulo"
          />

          <CustomInput
            name="image"
            register={register}
            type="text"
            error={errors["image"]?.message}
            labelText="URL de la imagen"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="category"
            labelText="Categoría"
            register={register}
            error={errors["category"]?.message}
            placeholder="Seleccione alguna categoría"
            options={categories.map((category) => ({
              value: category,
              label: category,
            }))}
          />
          <CustomInput
            name="relatedCareerType"
            labelText="Tipo de Carrera Relacionada"
            type="text"
            register={register}
            error={errors["relatedCareerType"]?.message}
          />
        </div>

        <TextAreaInput
          name="summary"
          labelText="Resumen"
          register={register}
          error={errors["summary"]?.message}
        />
        <TextAreaInput
          name="about"
          labelText="Acerca del Curso"
          register={register}
          error={errors["about"]?.message}
          rows={4}
        />

        <TextAreaInput
          name="learningOutcomes"
          labelText="Resultados de Aprendizaje"
          register={register}
          arrayValue={true}
          error={errors["learningOutcomes"]?.message}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <CheckInput
              name="isActive"
              labelText="Activo"
              register={register}
              error={errors["isActive"]?.message}
            />
            <CheckInput
              name="isInDevelopment"
              labelText="En desarrollo"
              register={register}
              error={errors["isInDevelopment"]?.message}
            />
          </div>
        </div>

        {errors.Sections?.message && <p className="mt-1 text-xs text-red-500">{errors.Sections.message}</p>}
        <div className="flex justify-end space-x-3 pt-4">

          <button 
            type="submit">
              Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
