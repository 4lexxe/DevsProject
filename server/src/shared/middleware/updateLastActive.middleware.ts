import { Request, Response, NextFunction } from "express";
import User from "../../modules/user/User";

export const updateLastActive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        user.lastActiveAt = new Date();
        await user.save();
      }
    }
    next();
  } catch (error) {
    console.error("Error al actualizar lastActiveAt:", error);
    next();
  }
};