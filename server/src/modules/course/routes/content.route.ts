import { Router } from "express";
import ContentController from "../controllers/content.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { permissionsMiddleware } from "../../../shared/middleware/permissionsMiddleware";
import { validateCourseAccess, contentRateLimit, validateAdminCourseAccess } from "../../../shared/middleware/courseAccessMiddleware";
import { validateQuiz } from "../validators/QuizValidation";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/contents", ContentController.getAll);

// Rutas que requieren autenticación y acceso al curso
router.get("/contents/:id/quiz", 
  authMiddleware,
  validateCourseAccess,
  contentRateLimit,
  ContentController.getQuizById
);

router.get("/contents/:id", 
  authMiddleware,
  validateCourseAccess,
  contentRateLimit,
  ContentController.getById
);

router.get("/contents/navigate/:id", 
  authMiddleware,
  validateCourseAccess,
  contentRateLimit,
  ContentController.getByIdWithNavigation
);

router.get("/contents/section/:sectionId", 
  authMiddleware,
  validateCourseAccess,
  contentRateLimit,
  ContentController.getBySectionId
);

// Rutas protegidas (requieren autenticación y permisos administrativos)
router.post("/contents", 
  authMiddleware,
  validateAdminCourseAccess,
  ContentController.create
);

router.put("/contents/:id", 
  authMiddleware,
  validateAdminCourseAccess,
  ContentController.update
);

router.put("/contents/:contentId/quiz", 
  authMiddleware,
  validateAdminCourseAccess,
  validateQuiz,
  ContentController.updateContentQuiz
);

router.delete("/contents/:contentId/quiz", 
  authMiddleware,
  validateAdminCourseAccess,
  ContentController.deleteQuiz
);

router.delete("/contents/:id", 
  authMiddleware,
  validateAdminCourseAccess,
  ContentController.delete
);

export default router;