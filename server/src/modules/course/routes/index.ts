// ==================================================
// Índice de rutas de cursos
// ==================================================

import { Router } from 'express';
import careerTypeRoutes from './careerType.route';
import categoryRoutes from './category.route';
import contentRoutes from './content.route';
import courseRoutes from './course.route';
import sectionRoutes from './section.route';

const courseRouter = Router();

// Configurar todos los endpoints de course
courseRouter.use(careerTypeRoutes);
courseRouter.use(categoryRoutes);
courseRouter.use(contentRoutes);
courseRouter.use(courseRoutes);
courseRouter.use(sectionRoutes);

export default courseRouter;
