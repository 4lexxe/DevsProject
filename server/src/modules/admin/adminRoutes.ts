import { Router } from "express"
import { AdminController } from "../admin/adminController"
import { authMiddleware } from "../../shared/middleware/authMiddleware"
import { checkRole } from "../../shared/middleware/checkRole"

const router = Router()

// Todas las rutas de admin requieren autenticación
router.use(authMiddleware)

// Todas las rutas de admin requieren rol de superadmin
router.use(checkRole(["superadmin"]))

router.post("/", AdminController.createAdminValidations, AdminController.createAdmin)
router.get("/admins", AdminController.getAllAdmins)
router.get("/:adminId", AdminController.getAdminById)
router.put("/:adminId", AdminController.updateAdminValidations, AdminController.updateAdmin)
router.delete("/:adminId", AdminController.deleteAdmin)

export default router