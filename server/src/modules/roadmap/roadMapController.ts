import { Request, Response } from "express";
import { Op } from "sequelize";
import Roadmap from "./RoadMap";
import User from "../user/User";

export interface AuthRequest extends Request {
  user?: User;
}

export const RoadmapController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, isPublic, structure } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const roadmap = await Roadmap.create({
        title,
        description,
        isPublic,
        structure,
        userId
      });

      return res.status(201).json(roadmap);
    } catch (error: any) {
      return res.status(500).json({ error: (error as Error).message });
    }
  },

  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const whereClause = userId 
        ? {
            [Op.or]: [
              { isPublic: true },
              { userId }
            ]
          }
        : { isPublic: true };
  
      const roadmaps = await Roadmap.findAll({
        where: whereClause,
        attributes: ['id', 'title', 'description', 'isPublic', 'structure', 'userId', 'createdAt', 'updatedAt'],
        include: [{
          association: 'User',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      return res.json(roadmaps);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  },

  getById: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const roadmap = await Roadmap.findOne({
        where: {
          id: req.params.id,
          [Op.or]: [
            { isPublic: true },
            { userId }
          ]
        },
        attributes: ['id', 'title', 'description', 'isPublic', 'structure', 'userId', 'createdAt', 'updatedAt'],
        include: [{
          association: 'User',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap no encontrado" });
      }
      
      return res.json(roadmap);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, isPublic, structure } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      
      const roadmap = await Roadmap.findOne({
        where: {
          id: req.params.id,
          userId
        }
      });
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap no encontrado o no tienes permisos" });
      }

      await roadmap.update({
        title,
        description,
        isPublic,
        structure
      });

      return res.json(roadmap);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      
      const roadmap = await Roadmap.findOne({
        where: {
          id: req.params.id,
          userId
        }
      });
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap no encontrado o no tienes permisos" });
      }
      
      await roadmap.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
};