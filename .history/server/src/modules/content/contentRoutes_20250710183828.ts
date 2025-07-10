import { Router } from "express";
import ContentController from "./contentController";

const router = Router();

router.get("/contents", ContentController.getAll);
router.get("/contents/:id/quiz", ContentController.getQuizById)
router.get("/contents/:id", ContentController.getById);
router.get("/contents/navigate/:id", ContentController.getByIdWithNavigation);
router.get("/contents/section/:sectionId", ContentController.getBySectionId);
router.post("/contents", ContentController.create);
router.put("/contents/:id", ContentController.update);
router.delete("/contents/:id", ContentController.delete);

export default router;