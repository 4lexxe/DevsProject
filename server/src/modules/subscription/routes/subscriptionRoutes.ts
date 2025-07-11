import {Router} from 'express';
import SubscriptionController from '../controller/subscriptionController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

router.get("/subscriptions/success", SubscriptionController.getData);
router.get("/subscriptions/user", SubscriptionController.getById);
router.put("/subscriptions/:id/cancel", SubscriptionController.cancel);


export default router;