// src/types/custom.d.ts
import { User } from '../../modules/user/User';
import { Roadmap } from '../../modules/roadmap/RoadMap';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      roadmap?: Roadmap;
    }
  }
}