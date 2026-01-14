import { Router } from "express";
import ContentController from "../controllers/content.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { validateQuiz } from "../validators/QuizValidation";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/contents", ContentController.getAll);
router.get("/contents/:id/quiz", ContentController.getQuizById);
router.get("/contents/:id", ContentController.getById);
router.get("/contents/navigate/:id", ContentController.getByIdWithNavigation);
router.get("/contents/section/:sectionId", ContentController.getBySectionId);

// Rutas protegidas (requieren autenticación y permisos)
router.post("/contents", 
  authMiddleware,
  ContentController.create
);

router.put("/contents/:id", 
  authMiddleware,
  ContentController.update
);

router.put("/contents/:contentId/quiz", 
  authMiddleware,
  validateQuiz,
  ContentController.updateContentQuiz
);

router.delete("/contents/:contentId/quiz", 
  authMiddleware,
  ContentController.deleteQuiz
);

router.delete("/contents/:id", 
  authMiddleware,
  ContentController.delete
);

export default router;