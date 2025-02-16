import { Router } from "express";
import ContentController from "./contentController";

const router = Router();

router.get("/contents", ContentController.getAll);
router.get("/contents/:id", ContentController.getById);
router.get("/contentsBySection/:sectionId", ContentController.getBySectionId);
router.post("/contents", ContentController.create);
router.put("/contents/:id", ContentController.update);
router.delete("/contents/:id", ContentController.delete);

export default router;