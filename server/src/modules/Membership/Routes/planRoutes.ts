import express from 'express';
import PlanController from '../controller/planController';
import { validatePlan } from '../validators/planValidate';

const router = express.Router();

// Rutas para Plan
router.get('/plans', PlanController.getAll); // Obtener todos los planes
router.get('/plans/:id', PlanController.getById); // Obtener un plan por ID
router.post('/plans', validatePlan, PlanController.createPlan); // Crear un plan
router.put('/plans/:id', validatePlan, PlanController.updatePlan); // Actualizar un plan por ID
router.delete('/plans/:id', PlanController.delete); // Eliminar un plan por ID

export default router;