import { Router } from "express"
import { AdminController } from "../admin/adminController"
import { authMiddleware } from "../../shared/middleware/authMiddleware"
import { requirePermission } from "../../shared/middleware/permissionsMiddleware"

const router = Router()

// Todas las rutas de admin requieren autenticación
router.use(authMiddleware)

router.post("/", requirePermission("admin:create"), AdminController.createAdminValidations, AdminController.createAdmin)
router.get("/admins", requirePermission("admin:view"), AdminController.getAllAdmins)
router.get("/:adminId", requirePermission("admin:view"), AdminController.getAdminById)
router.put("/:adminId", requirePermission("admin:update"), AdminController.updateAdminValidations, AdminController.updateAdmin)
router.delete("/:adminId", requirePermission("admin:delete"), AdminController.deleteAdmin)

export default router