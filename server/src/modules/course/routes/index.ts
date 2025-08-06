// ==================================================
// Índice de rutas de cursos
// ==================================================

import { Router } from 'express';
import careerTypeRoutes from './careerType.route';
import categoryRoutes from './category.route';
import contentRoutes from './content.route';
import contentFilesRoutes from './contentFiles.route';
import courseRoutes from './course.route';
import sectionRoutes from './section.route';
import searchRoutes from './search.route';
import progressRoutes from './progress.routes';

const courseRouter = Router();

// Configurar todos los endpoints de course
courseRouter.use(careerTypeRoutes);
courseRouter.use(categoryRoutes);
courseRouter.use(contentRoutes);
courseRouter.use(contentFilesRoutes);
courseRouter.use(courseRoutes);
courseRouter.use(sectionRoutes);
courseRouter.use(searchRoutes);
courseRouter.use(progressRoutes);

export default courseRouter;
