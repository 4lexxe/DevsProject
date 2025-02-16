import { Request, Response, RequestHandler } from "express";
import QuizContent from "../models/QuizContent";
import Section from "../../section/Section";

const metadata = (req: any, res: any) => {
  return {
    status: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  };
};

export class QuizContentController {
  // Obtener todos los cuestionarios
  static getAll: RequestHandler = async (req, res) => {
    try {
      const quizContents = await QuizContent.findAll({
        include: [{ model: Section, as: "section" }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cuestionarios obtenidos correctamente",
        length: quizContents.length,
        data: quizContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cuestionarios",
        error,
      });
    }
  };

  // Obtener un cuestionario por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const quizContent = await QuizContent.findByPk(id, {
        include: [{ model: Section, as: "section" }],
      });
      if (!quizContent) {
        res
          .status(404)
          .json({ status: "error", message: "Cuestionario no encontrado" });
        return;
      }
      res.status(200).json({
        ...metadata(req, res),
        message: "Cuestionario obtenido correctamente",
        data: quizContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el cuestionario",
        error,
      });
    }
  };

  // Obtener cuestionarios por sectionId
  static getBySectionId: RequestHandler = async (req, res) => {
    try {
      const { sectionId } = req.params;
      const quizContents = await QuizContent.findAll({ where: { sectionId } });
      res.status(200).json({
        ...metadata(req, res),
        message:
          "Cuestionarios obtenidos correctamente para la sección especificada",
        length: quizContents.length,
        data: quizContents,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener los cuestionarios de la sección",
        error,
      });
    }
  };

  // Crear un cuestionario
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, content, questions, duration, position, sectionId } =
        req.body;
      const quizContent = await QuizContent.create({
        title,
        content,
        questions: JSON.stringify(questions),
        duration,
        position,
        sectionId,
      });
      res.status(201).json({
        ...metadata(req, res),
        message: "Cuestionario creado correctamente",
        data: quizContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al crear el cuestionario",
        error,
      });
    }
  };

  // Actualizar un cuestionario por ID
  static update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, questions, duration, position, sectionId } =
        req.body;
      const quizContent = await QuizContent.findByPk(id);

      if (!quizContent) {
        res.status(404).json({
          status: "error",
          message: "Cuestionario no encontrado",
        });
        return;
      }

      await quizContent.update({
        title,
        content,
        questions: JSON.stringify(questions),
        duration,
        position,
        sectionId,
      });
      res.status(200).json({
        ...metadata(req, res),
        message: "Cuestionario actualizado correctamente",
        data: quizContent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el cuestionario",
        error,
      });
    }
  };

  // Eliminar un cuestionario por ID
  static delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const quizContent = await QuizContent.findByPk(id);

      if (!quizContent) {
        res.status(404).json({
          status: "error",
          message: "Cuestionario no encontrado",
        });
        return;
      }

      await quizContent.destroy();
      res.status(200).json({
        ...metadata(req, res),
        message: "Cuestionario eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el cuestionario",
        error,
      });
    }
  };
}
