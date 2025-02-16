import { Router } from "express";
import { VideoContentController } from "../controllers/videoContentController";

const router = Router();

router.get("/videoContents", VideoContentController.getAll);
router.get("/videoContents/:id", VideoContentController.getById);
router.get("/videoContents/section/:sectionId", VideoContentController.getBySectionId);
router.post("/videoContents", VideoContentController.create);
router.put("/videoContents/:id", VideoContentController.update);
router.delete("/videoContents/:id", VideoContentController.delete);

export default router;
