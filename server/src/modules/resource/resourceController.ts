import { Request, Response } from "express";
import Resource from "./Resource";
import { AuthRequest } from "../auth/controllers/verify.controller";

export class ResourceController {
  static async createResource(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { title, description, url, type } = req.body;
      const resource = await Resource.create({
        title,
        description,
        url,
        type,
        userId: req.user.id,
      });

      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el recurso", error });
    }
  }

  static async updateResource(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { id } = req.params;
      const resource = await Resource.findByPk(id);

      if (!resource || resource.userId !== req.user.id) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      await resource.update(req.body);
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el recurso", error });
    }
  }

  static async deleteResource(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { id } = req.params;
      const resource = await Resource.findByPk(id);

      if (!resource || resource.userId !== req.user.id) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      await resource.destroy();
      res.status(200).json({ message: "Recurso eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el recurso", error });
    }
  }

  static async getResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resource = await Resource.findByPk(id);

      if (!resource) {
        return res.status(404).json({ message: "Recurso no encontrado" });
      }

      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el recurso", error });
    }
  }

  static async getAllResources(req: Request, res: Response) {
    try {
      const resources = await Resource.findAll();
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los recursos", error });
    }
  }
}