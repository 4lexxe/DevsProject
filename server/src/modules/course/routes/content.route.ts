import { Router } from "express";
import ContentController from "../controllers/content.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { optionalAuthMiddleware } from "../../../shared/middleware/optionalAuthMiddleware";
import { permissionsMiddleware } from "../../../shared/middleware/permissionsMiddleware";
import { validateQuiz } from "../validators/QuizValidation";

const router = Router();

// Rutas protegidas - requieren autenticación y permisos para ver contenidos
router.get("/contents", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getAll
);

router.get("/contents/:id/quiz", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getQuizById
);

router.get("/contents/:id", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getById
);

// Ruta para buscar contenido por courseSlug, sectionSlug y contentSlug (debe ir antes de las rutas con :id)
router.get("/contents/course/:courseSlug/section/:sectionSlug/content/:contentSlug", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getByCourseSectionAndContentSlug
);

// Ruta con autenticación obligatoria - El controlador verifica permisos y acceso internamente
router.get("/contents/navigate/:id", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getByIdWithNavigation
);

router.get("/contents/section/:sectionId", 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  ContentController.getBySectionId
);

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