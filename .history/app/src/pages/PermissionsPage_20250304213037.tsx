import React, { useEffect, useState } from 'react';
import { Role, RoleService } from '../profile/services/role.service';
import { Container, Typography, Paper, Grid, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';

/**
 * Componente que muestra la página de gestión de permisos
 */
const PermissionsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await RoleService.getRolesWithPermissions();
        setRoles(rolesData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los roles. Por favor intente nuevamente más tarde.');
        console.error('Error fetching roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Gestión de Permisos
      </Typography>
      
      <Typography variant="h5" gutterBottom>
        Roles del Sistema
      </Typography>
      
      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role.id}>
            <Card elevation={3}>
              <CardHeader
                title={role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                subheader={role.description}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <Divider />
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Permisos asignados:
                </Typography>
                
                {(() => {
                  // Manejar ambas estructuras de permisos posibles
                  const permissionsList = role.permissions || role.Permissions;
                  
                  if (permissionsList && permissionsList.length > 0) {
                    return (
                      <List dense>
                        {permissionsList.map((permission) => (
                          <ListItem key={permission.id}>
                            <ListItemText 
                              primary={permission.name} 
                              secondary={permission.description} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    );
                  } else {
                    return (
                      <Typography variant="body2" color="textSecondary">
                        Este rol no tiene permisos asignados.
                      </Typography>
                    );
                  }
                })()}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PermissionsPage;
