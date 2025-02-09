import { Request, Response } from "express";
import Resource from "./Resource";
import { AuthRequest } from "../auth/controllers/verify.controller";

export class ResourceController {
  static async createResource(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { title, description, url, type, coverImage } = req.body;

      // Asignar un valor por defecto si userAvatar es null o una cadena vacía
      const userAvatar = req.user.avatar || "https://default-avatar-url.com/avatar.png";

      const resource = await Resource.create({
        title,
        description,
        url,
        type,
        userId: req.user.id,
        userName: req.user.name,
        userAvatar, // Usar el avatar del usuario o una URL por defecto
        isVisible: true, // Los recursos creados por usuarios normales son visibles por defecto
        coverImage,
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

      if (!resource) {
        return res.status(404).json({ message: "Recurso no encontrado" });
      }

      if (resource.userId !== req.user.id && req.user.Role?.name !== 'admin' && req.user.Role?.name !== 'superadmin') {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      const { title, description, url, type, coverImage, isVisible } = req.body;

      // Los usuarios normales no pueden cambiar el valor de isVisible
      if (resource.userId === req.user.id && (isVisible !== undefined || isVisible !== resource.isVisible)) {
        return res.status(403).json({ message: "No tienes permiso para cambiar la visibilidad del recurso" });
      }

      await resource.update({
        title,
        description,
        url,
        type,
        coverImage,
        isVisible: req.user.Role?.name === 'admin' || req.user.Role?.name === 'superadmin' ? isVisible : resource.isVisible,
      });

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

      if (!resource) {
        return res.status(404).json({ message: "Recurso no encontrado" });
      }

      if (resource.userId !== req.user.id && req.user.Role?.name !== 'admin' && req.user.Role?.name !== 'superadmin') {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      await resource.destroy();
      res.status(200).json({ message: "Recurso eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el recurso", error });
    }
  }

  static async getResource(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const resource = await Resource.findByPk(id);

      if (!resource) {
        return res.status(404).json({ message: "Recurso no encontrado" });
      }

      // Verificar visibilidad del recurso
      if (!resource.isVisible && (!req.user || (req.user.Role?.name !== 'admin' && req.user.Role?.name !== 'superadmin'))) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el recurso", error });
    }
  }

  static async getAllResources(req: AuthRequest, res: Response) {
    try {
      const resources = await Resource.findAll();

      // Filtrar recursos no visibles para usuarios normales
      const visibleResources = resources.filter(resource => resource.isVisible || (req.user && (req.user.Role?.name === 'admin' || req.user.Role?.name === 'superadmin')));

      res.status(200).json(visibleResources);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los recursos", error });
    }
  }
}