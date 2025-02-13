import { Router } from "express";
import { LinkContentController } from "../controllers/linkContentController";

const router = Router();

router.get("/linkContent", LinkContentController.getAll);
router.get("/linkContent/:id", LinkContentController.getById);
router.get("/linkContent/section/:sectionId", LinkContentController.getBySectionId);
router.post("/linkContent", LinkContentController.create);
router.put("/linkContent/:id", LinkContentController.update);
router.delete("/linkContent/:id", LinkContentController.delete);

export default router;
