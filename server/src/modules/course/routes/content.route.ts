import { Router } from "express";
import ContentController from "../controllers/content.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { permissionsMiddleware } from "../../../shared/middleware/permissionsMiddleware";
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
  permissionsMiddleware(['manage:course_content']),
  ContentController.create
);

router.put("/contents/:id", 
  authMiddleware,
  permissionsMiddleware(['manage:course_content']),
  ContentController.update
);

router.put("/contents/:contentId/quiz", 
  authMiddleware,
  permissionsMiddleware(['manage:course_content']),
  validateQuiz,
  ContentController.updateContentQuiz
);

router.delete("/contents/:contentId/quiz", 
  authMiddleware,
  permissionsMiddleware(['manage:course_content']),
  ContentController.deleteQuiz
);

router.delete("/contents/:id", 
  authMiddleware,
  permissionsMiddleware(['delete:content']),
  ContentController.delete
);

export default router;