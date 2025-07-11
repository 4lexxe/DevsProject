import { Request, Response } from "express";
import Rating from "./Rating";
import Resource from "../Resource";
import User from "../../user/User";

// Definimos una interfaz para los métodos del controlador
interface IRatingController {
  getRatingsByResource(req: Request, res: Response): Promise<void>;
  rateResource(req: Request, res: Response): Promise<void>;
  deleteRating(req: Request, res: Response): Promise<void>;
  getStarCount(req: Request, res: Response): Promise<void>;
}

export const RatingController: IRatingController = {
  // Obtener todas las calificaciones de un recurso específico
  async getRatingsByResource(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      const ratings = await Rating.findAll({
        where: { resourceId },
        include: [{ model: User, as: "User", attributes: ["id", "name"] }],
      });
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las calificaciones." });
    }
  },

  // Agregar o actualizar la calificación de un usuario a un recurso
  async rateResource(req: Request, res: Response) {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: "No autorizado." });
        return;
      }

      const userId = user.id;
      const { resourceId, star } = req.body;

      if (typeof star !== "boolean") {
        res.status(400).json({ error: "El valor de 'star' debe ser booleano." });
        return;
      }

      const existingRating = await Rating.findOne({
        where: { userId, resourceId },
      });

      if (existingRating) {
        if (existingRating.star === star) {
          res.status(200).json({ message: "La calificación ya está registrada." });
          return;
        }
        await existingRating.update({ star });
        res.json({ message: "Calificación actualizada correctamente." });
        return;
      }

      await Rating.create({ userId, resourceId, star });
      res.json({ message: "Calificación agregada correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al calificar el recurso." });
    }
  },

  // Eliminar una calificación
  async deleteRating(req: Request, res: Response) {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: "No autorizado." });
        return;
      }

      const userId = user.id;
      const { resourceId } = req.body;
      const rating = await Rating.findOne({ where: { userId, resourceId } });

      if (!rating) {
        res.status(404).json({ error: "Calificación no encontrada." });
        return;
      }

      // Verificar permisos: propietario de la calificación o admin con permisos
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const isOwner = rating.userId === userId;
      const hasPermissions = userPermissions.includes('delete:content') || user.Role?.name === 'superadmin';

      if (!isOwner && !hasPermissions) {
        res.status(403).json({ error: "No tienes permiso para eliminar esta calificación." });
        return;
      }

      await rating.destroy();
      res.json({ message: "Calificación eliminada correctamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la calificación." });
    }
  },

  // Obtener la cantidad total de estrellas de un recurso
  async getStarCount(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      const resource = await Resource.findByPk(resourceId, {
        attributes: ["starCount"],
      });
      if (!resource) {
        res.status(404).json({ error: "Recurso no encontrado." });
        return;
      }
      res.json({ resourceId, starCount: resource.starCount });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener la cantidad de estrellas." });
    }
  },
};

export default RatingController;