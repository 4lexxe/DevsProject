import { Router } from "express";
import { QuizContentController } from "../controllers/quizContentController";

const router = Router();

// Definir rutas
router.get("/quizContent", QuizContentController.getAll);
router.get("/quizContent/:id", QuizContentController.getById);
router.get("/quizContent/section/:sectionId", QuizContentController.getBySectionId);
router.post("/quizContent", QuizContentController.create);
router.put("/quizContent/:id", QuizContentController.update);
router.delete("/quizContent/:id", QuizContentController.delete);

export default router;
