import { Request, Response, RequestHandler } from 'express';
import HeaderSection from './HeaderSection';
import Admin from '../admin/Admin';
import User from '../user/User';

// Función para generar metadata
const metadata = (req: Request, res: Response) => {
  return {
    statusCode: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
    method: req.method,
  };
};

// Función para manejar errores internos del servidor
const handleServerError = (res: Response, req: Request, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({
    ...metadata(req, res),
    status: "error",
    message,
    error: error.message,
  });
};

// Crear una sección de encabezado (requiere autenticación)
export const createHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { image, title, slogan, about, buttonName, buttonLink, adminId } = req.body;
    const user = req.user as User;

    // Verificar permisos adicionales para gestionar configuraciones del sistema
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('manage:system_settings') && user.Role?.name !== 'superadmin') {
      res.status(403).json({
        ...metadata(req, res),
        status: "error",
        message: "No tienes permisos para crear secciones de encabezado",
      });
      return;
    }

    // Verificar que el admin existe
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({
        ...metadata(req, res),
        status: "error",
        message: 'Admin no encontrado'
      });
      return;
    }

    // Crear la nueva sección
    const headerSection = await HeaderSection.create({
      image,
      title,
      slogan,
      about,
      buttonName,
      buttonLink,
      adminId,
    });

    res.status(201).json({
      ...metadata(req, res),
      status: "success",
      message: "Sección de encabezado creada correctamente",
      data: headerSection
    });
  } catch (error) {
    handleServerError(res, req, error, "Error creando la sección de encabezado");
  }
};

// Obtener todas las secciones de encabezado (SIN autenticación)
export const getHeaderSections: RequestHandler = async (req, res): Promise<void> => {
  try {
    const headerSections = await HeaderSection.findAll({
      include: [{
        model: Admin,
        as: 'Admin',
        attributes: ['id', 'name']
      }]
    });

    if (!headerSections.length) {
      res.status(404).json({
        ...metadata(req, res),
        status: "error",
        message: 'No se encontraron secciones de encabezado'
      });
      return;
    }

    res.status(200).json({
      ...metadata(req, res),
      status: "success",
      message: "Secciones de encabezado obtenidas correctamente",
      data: headerSections
    });
  } catch (error) {
    handleServerError(res, req, error, "Error obteniendo las secciones de encabezado");
  }
};

// Obtener una sección de encabezado por ID (SIN autenticación)
export const getHeaderSectionById: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const headerSection = await HeaderSection.findByPk(id, {
      include: [{
        model: Admin,
        as: 'Admin',
        attributes: ['id', 'name']
      }]
    });

    if (!headerSection) {
      res.status(404).json({
        ...metadata(req, res),
        status: "error",
        message: 'Sección de encabezado no encontrada'
      });
      return;
    }

    res.status(200).json({
      ...metadata(req, res),
      status: "success",
      message: "Sección de encabezado obtenida correctamente",
      data: headerSection
    });
  } catch (error) {
    handleServerError(res, req, error, "Error obteniendo la sección de encabezado");
  }
};

// Actualizar una sección de encabezado (requiere autenticación)
export const updateHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { image, title, slogan, about, buttonName, buttonLink, adminId } = req.body;
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('manage:system_settings') && user.Role?.name !== 'superadmin') {
      res.status(403).json({
        ...metadata(req, res),
        status: "error",
        message: "No tienes permisos para actualizar secciones de encabezado",
      });
      return;
    }

    const headerSection = await HeaderSection.findByPk(id);
    if (!headerSection) {
      res.status(404).json({
        ...metadata(req, res),
        status: "error",
        message: 'Sección de encabezado no encontrada'
      });
      return;
    }

    // Verificar que el admin existe si se proporciona
    if (adminId) {
      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Admin no encontrado'
        });
        return;
      }
    }

    // Actualizar la sección de encabezado
    const updatedSection = await headerSection.update({
      image,
      title,
      slogan,
      about,
      buttonName,
      buttonLink,
      adminId
    });

    res.status(200).json({
      ...metadata(req, res),
      status: "success",
      message: "Sección de encabezado actualizada correctamente",
      data: updatedSection
    });
  } catch (error) {
    handleServerError(res, req, error, "Error actualizando la sección de encabezado");
  }
};

// Eliminar una sección de encabezado (requiere autenticación)
export const deleteHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('manage:system_settings') && user.Role?.name !== 'superadmin') {
      res.status(403).json({
        ...metadata(req, res),
        status: "error",
        message: "No tienes permisos para eliminar secciones de encabezado",
      });
      return;
    }

    const headerSection = await HeaderSection.findByPk(id);
    if (!headerSection) {
      res.status(404).json({
        ...metadata(req, res),
        status: "error",
        message: 'Sección de encabezado no encontrada'
      });
      return;
    }

    await headerSection.destroy();

    res.status(200).json({
      ...metadata(req, res),
      status: "success",
      message: 'Sección de encabezado eliminada correctamente'
    });
  } catch (error) {
    handleServerError(res, req, error, "Error eliminando la sección de encabezado");
  }
};