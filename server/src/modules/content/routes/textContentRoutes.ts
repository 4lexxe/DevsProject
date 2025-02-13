import { Router } from "express";
import TextContentController from "../controllers/textContentController";

const router = Router();

router.get("/textContent", TextContentController.getAll);
router.get("/textContent/:id", TextContentController.getById);
router.get("/textContent/section/:sectionId", TextContentController.getBySectionId);
router.post("/textContent", TextContentController.create);
router.put("/textContent/:id", TextContentController.update);
router.delete("/textContent/:id", TextContentController.delete);

export default router;
