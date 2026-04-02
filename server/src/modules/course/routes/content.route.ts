import { Router } from "express";
import ContentController from "../controllers/content.controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requirePermission } from "../../../shared/middleware/permissionsMiddleware";
import { verifyCourseAccessFromContent } from "../../../shared/middleware/courseAccessMiddleware";
import { validateQuiz } from "../validators/QuizValidation";

const router = Router();

router.get("/contents",
  authMiddleware,
  requirePermission('content:view'),
  ContentController.getAll
);

//Esta ruta debe estar protegida por politicas
router.get("/contents/:id/quiz",
  authMiddleware,
  verifyCourseAccessFromContent,
  ContentController.getQuizById
);

router.get("/contents/:id",
  authMiddleware,
  requirePermission('content:view'),
);

//Esta ruta debe estar protegida por politicas
router.get("/contents/navigate/:id",
  authMiddleware,
  verifyCourseAccessFromContent,
  ContentController.getByIdWithNavigation
);

router.get("/contents/section/:sectionId",
  authMiddleware,
  requirePermission('content:view'),
  ContentController.getBySectionId
);


router.post("/contents",
  authMiddleware,
  requirePermission('content:create'),
  ContentController.create
);

router.put("/contents/:id",
  authMiddleware,
  requirePermission('content:update'),
  ContentController.update
);

router.put("/contents/:contentId/quiz",
  authMiddleware,
  requirePermission('content:update'),
  validateQuiz,
  ContentController.updateContentQuiz
);

router.delete("/contents/:contentId/quiz",
  authMiddleware,
  requirePermission('content:update'),
  ContentController.deleteQuiz
);

router.delete("/contents/:id",
  authMiddleware,
  requirePermission('content:delete'),
  ContentController.delete
);

export default router;