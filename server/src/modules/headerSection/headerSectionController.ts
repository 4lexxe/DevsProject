import { Request, Response, RequestHandler } from 'express';
import HeaderSection from './HeaderSection';
import Admin from '../admin/Admin';
import User from '../user/User';
import Permission from '../role/Permission';

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
  console.error('Stack trace:', error.stack);
  res.status(500).json({
    ...metadata(req, res),
    status: "error",
    message,
    error: error.message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

// Crear una sección de encabezado (requiere autenticación)
export const createHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { 
      image, title, slogan, about, buttonName, buttonLink, badgeText,
      contentType, customCode, iframeUrl, customHtml, customCss, customJs,
      backgroundColor, titleColor, sloganColor, textColor, buttonColor, buttonTextColor,
      techStack
    } = req.body;
    const user = req.user as User;

    // Validar campos requeridos
    if (!image || !title || !slogan || !buttonName || !buttonLink) {
      res.status(400).json({
        ...metadata(req, res),
        status: "error",
        message: "Faltan campos requeridos",
        details: {
          image: !image ? "La imagen es obligatoria" : undefined,
          title: !title ? "El título es obligatorio" : undefined,
          slogan: !slogan ? "El slogan es obligatorio" : undefined,
          buttonName: !buttonName ? "El nombre del botón es obligatorio" : undefined,
          buttonLink: !buttonLink ? "El enlace del botón es obligatorio" : undefined,
        }
      });
      return;
    }

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

    // Obtener o crear el Admin asociado al usuario autenticado
    let admin = await Admin.findOne({ where: { userId: user.id } });
    if (!admin) {
      // Si el usuario tiene permisos pero no tiene Admin, crear uno automáticamente
      const userRole = user.Role?.name || '';
      const isSuperAdmin = userRole === 'superadmin';
      
      // Obtener todos los permisos si es superadmin, o los permisos del rol
      let permissions: string[];
      try {
        if (isSuperAdmin) {
          const allPermissions = await Permission.findAll();
          permissions = allPermissions.map(p => p.name);
        } else {
          permissions = userPermissions.length > 0 ? userPermissions : ['manage:system_settings'];
        }
      } catch (permError: any) {
        console.error('Error al obtener permisos:', permError);
        // Si hay error obteniendo permisos, usar los permisos del usuario o un permiso por defecto
        permissions = userPermissions.length > 0 ? userPermissions : ['manage:system_settings'];
      }
      
      // Determinar el nombre del admin
      const adminName = user.name || user.username || user.email || `Admin ${user.id}`;
      
      try {
        admin = await Admin.create({
          userId: user.id,
          name: adminName,
          admin_since: new Date(),
          permissions: permissions,
          isSuperAdmin: isSuperAdmin,
        });
      } catch (adminError: any) {
        console.error('Error al crear Admin:', adminError);
        throw new Error(`No se pudo crear el Admin: ${adminError.message}`);
      }
    }

    // Preparar datos para crear la sección
    const createData: any = {
      image: image.trim(),
      title: title.trim(),
      slogan: slogan.trim(),
      about: about ? about.trim() : null,
      buttonName: buttonName.trim(),
      buttonLink: buttonLink.trim(),
      adminId: admin.id,
    };

    // Agregar badgeText si está definido
    if (badgeText !== undefined && badgeText !== null && badgeText !== '') {
      createData.badgeText = badgeText.trim();
    }

    // Agregar campos de personalización solo si están definidos
    // Esto evita errores si las columnas aún no existen en la BD
    if (contentType !== undefined) createData.contentType = contentType || 'default';
    if (customCode !== undefined && customCode !== null && customCode !== '') createData.customCode = customCode;
    
    // Si iframeUrl contiene HTML de iframe, extraer solo la URL o guardarlo en customHtml
    if (iframeUrl !== undefined && iframeUrl !== null && iframeUrl !== '') {
      // Detectar si es HTML de iframe completo
      if (iframeUrl.trim().startsWith('<iframe')) {
        // Extraer la URL del src del iframe
        const srcMatch = iframeUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
          createData.iframeUrl = srcMatch[1];
        } else {
          // Si no se puede extraer la URL, guardar el HTML completo en customHtml
          createData.customHtml = iframeUrl;
          createData.contentType = 'custom';
    }
      } else {
        // Es solo una URL, guardarla normalmente
        createData.iframeUrl = iframeUrl;
      }
    }
    if (customHtml !== undefined && customHtml !== null && customHtml !== '') createData.customHtml = customHtml;
    if (customCss !== undefined && customCss !== null && customCss !== '') createData.customCss = customCss;
    if (customJs !== undefined && customJs !== null && customJs !== '') createData.customJs = customJs;
    if (backgroundColor !== undefined && backgroundColor !== null && backgroundColor !== '') createData.backgroundColor = backgroundColor;
    if (titleColor !== undefined && titleColor !== null && titleColor !== '') createData.titleColor = titleColor;
    if (sloganColor !== undefined && sloganColor !== null && sloganColor !== '') createData.sloganColor = sloganColor;
    if (textColor !== undefined && textColor !== null && textColor !== '') createData.textColor = textColor;
    if (buttonColor !== undefined && buttonColor !== null && buttonColor !== '') createData.buttonColor = buttonColor;
    if (buttonTextColor !== undefined && buttonTextColor !== null && buttonTextColor !== '') createData.buttonTextColor = buttonTextColor;
    if (techStack !== undefined && techStack !== null && Array.isArray(techStack) && techStack.length > 0) createData.techStack = techStack;

    // Crear la nueva sección
    console.log('Intentando crear HeaderSection con datos:', JSON.stringify(createData, null, 2));
    
    let headerSection;
    try {
      headerSection = await HeaderSection.create(createData);
    } catch (createError: any) {
      // Si el error es porque faltan columnas, intentar sincronizar y crear de nuevo
      if (createError.name === 'SequelizeDatabaseError' || createError.name === 'SequelizeValidationError') {
        console.error('Error al crear HeaderSection, intentando sincronizar modelo:', createError.message);
        try {
          await HeaderSection.sync({ alter: true });
          console.log('Modelo sincronizado, intentando crear nuevamente...');
          // Intentar crear solo con campos básicos primero
          const basicData = {
            image: image.trim(),
            title: title.trim(),
            slogan: slogan.trim(),
            about: about ? about.trim() : null,
            buttonName: buttonName.trim(),
            buttonLink: buttonLink.trim(),
            adminId: admin.id,
          };
          headerSection = await HeaderSection.create(basicData);
          // Luego actualizar con campos de personalización si existen
          if (Object.keys(createData).length > Object.keys(basicData).length) {
            await headerSection.update(createData);
          }
        } catch (syncError: any) {
          console.error('Error al sincronizar o crear después del sync:', syncError);
          throw createError; // Lanzar el error original
        }
      } else {
        throw createError;
      }
    }

    res.status(201).json({
      ...metadata(req, res),
      status: "success",
      message: "Sección de encabezado creada correctamente",
      data: headerSection
    });
  } catch (error: any) {
    console.error('Error detallado al crear HeaderSection:', {
      error: error.message,
      name: error.name,
      stack: error.stack,
      sql: error.sql,
      body: req.body,
      userId: (req.user as User)?.id
    });
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
    const { 
      image, title, slogan, about, buttonName, buttonLink, badgeText,
      contentType, customCode, iframeUrl, customHtml, customCss, customJs,
      backgroundColor, titleColor, sloganColor, textColor, buttonColor, buttonTextColor,
      techStack
    } = req.body;
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

    // Obtener o crear el Admin asociado al usuario autenticado
    let admin = await Admin.findOne({ where: { userId: user.id } });
      if (!admin) {
      // Si el usuario tiene permisos pero no tiene Admin, crear uno automáticamente
      const userRole = user.Role?.name || '';
      const isSuperAdmin = userRole === 'superadmin';
      
      // Obtener todos los permisos si es superadmin, o los permisos del rol
      let permissions: string[];
      try {
        if (isSuperAdmin) {
          const allPermissions = await Permission.findAll();
          permissions = allPermissions.map(p => p.name);
        } else {
          permissions = userPermissions.length > 0 ? userPermissions : ['manage:system_settings'];
        }
      } catch (permError: any) {
        console.error('Error al obtener permisos:', permError);
        // Si hay error obteniendo permisos, usar los permisos del usuario o un permiso por defecto
        permissions = userPermissions.length > 0 ? userPermissions : ['manage:system_settings'];
      }
      
      // Determinar el nombre del admin
      const adminName = user.name || user.username || user.email || `Admin ${user.id}`;
      
      try {
        admin = await Admin.create({
          userId: user.id,
          name: adminName,
          admin_since: new Date(),
          permissions: permissions,
          isSuperAdmin: isSuperAdmin,
        });
      } catch (adminError: any) {
        console.error('Error al crear Admin:', adminError);
        throw new Error(`No se pudo crear el Admin: ${adminError.message}`);
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      image: image ? image.trim() : headerSection.image,
      title: title ? title.trim() : headerSection.title,
      slogan: slogan ? slogan.trim() : headerSection.slogan,
      about: about !== undefined ? (about ? about.trim() : null) : headerSection.about,
      buttonName: buttonName ? buttonName.trim() : headerSection.buttonName,
      buttonLink: buttonLink ? buttonLink.trim() : headerSection.buttonLink,
      adminId: admin.id,
    };

    // Agregar badgeText si está definido
    if (badgeText !== undefined) {
      updateData.badgeText = badgeText ? badgeText.trim() : null;
    }

    // Agregar campos de personalización solo si están definidos o si existen en el modelo
    if (contentType !== undefined) updateData.contentType = contentType;
    if (customCode !== undefined) updateData.customCode = customCode || null;
    
    // Si iframeUrl contiene HTML de iframe, extraer solo la URL o guardarlo en customHtml
    if (iframeUrl !== undefined) {
      if (iframeUrl && iframeUrl.trim() !== '') {
        // Detectar si es HTML de iframe completo
        if (iframeUrl.trim().startsWith('<iframe')) {
          // Extraer la URL del src del iframe
          const srcMatch = iframeUrl.match(/src=["']([^"']+)["']/);
          if (srcMatch && srcMatch[1]) {
            updateData.iframeUrl = srcMatch[1];
          } else {
            // Si no se puede extraer la URL, guardar el HTML completo en customHtml
            updateData.customHtml = iframeUrl;
            updateData.contentType = 'custom';
            updateData.iframeUrl = null;
      }
        } else {
          // Es solo una URL, guardarla normalmente
          updateData.iframeUrl = iframeUrl;
        }
      } else {
        updateData.iframeUrl = null;
      }
    }
    
    if (customHtml !== undefined) updateData.customHtml = customHtml || null;
    if (customCss !== undefined) updateData.customCss = customCss || null;
    if (customJs !== undefined) updateData.customJs = customJs || null;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor || null;
    if (titleColor !== undefined) updateData.titleColor = titleColor || null;
    if (sloganColor !== undefined) updateData.sloganColor = sloganColor || null;
    if (textColor !== undefined) updateData.textColor = textColor || null;
    if (buttonColor !== undefined) updateData.buttonColor = buttonColor || null;
    if (buttonTextColor !== undefined) updateData.buttonTextColor = buttonTextColor || null;
    if (techStack !== undefined) updateData.techStack = techStack || null;

    // Actualizar la sección de encabezado
    const updatedSection = await headerSection.update(updateData);

    res.status(200).json({
      ...metadata(req, res),
      status: "success",
      message: "Sección de encabezado actualizada correctamente",
      data: updatedSection
    });
  } catch (error: any) {
    console.error('Error detallado al actualizar HeaderSection:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      params: req.params,
      userId: (req.user as User)?.id
    });
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