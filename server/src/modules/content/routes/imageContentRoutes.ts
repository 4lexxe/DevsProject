import { Router } from "express";
import ImageContentController from "../controllers/imageContentController";

const router = Router();

// Rutas para ImageContent
router.get("/ImageContent", ImageContentController.getAll);
router.get("/ImageContent/:id", ImageContentController.getById);
router.get("/ImageContent/section/:sectionId", ImageContentController.getBySectionId);
router.post("/ImageContent/", ImageContentController.create);
router.put("/ImageContent/:id", ImageContentController.update);
router.delete("/ImageContent/:id", ImageContentController.delete);

export default router;
