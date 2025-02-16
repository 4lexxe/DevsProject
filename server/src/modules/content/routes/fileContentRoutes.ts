import { Router } from "express";
import FileContentController from "../controllers/fileContentController";

const router = Router();

router.get("/fileContent", FileContentController.getAll);
router.get("/fileContent/:id", FileContentController.getById);
router.get("/fileContent/section/:sectionId", FileContentController.getBySectionId);
router.post("/fileContent", FileContentController.create);
router.put("/fileContent/:id", FileContentController.update);
router.delete("/fileContent/:id", FileContentController.delete);

export default router;



