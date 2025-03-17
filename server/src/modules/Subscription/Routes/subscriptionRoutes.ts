import {Router} from 'express';
import SubscriptionController from '../controller/subscriptionController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

router.get("/subscriptions/data", SubscriptionController.getData);
router.get("/subscriptions/:id", SubscriptionController.getById);
router.post("/subscriptions", SubscriptionController.create);


export default router;