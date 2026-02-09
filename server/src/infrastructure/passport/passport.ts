import passport from "passport"
import { Strategy as GitHubStrategy } from "passport-github2"
import { Strategy as DiscordStrategy } from "passport-discord"
import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcryptjs"
import User, { AuthProvider } from "../../modules/user/User"
import { Request } from "express"

// Extend the Request interface to include realIp and geo properties
declare global {
  namespace Express {
    interface Request {
      realIp?: string;
      geo?: {
        city: string;
        region: string;
        country: string;
        ll: [number, number];
        timezone: string;
        proxy?: boolean;
      };
    }
  }
}

// Serialización del usuario - Guardar más información en la sesión
passport.serializeUser((user: any, done) => {
  // Guardar información relevante del usuario en la sesión
  const sessionUser = {
    id: user.id,
    authProvider: user.authProvider,
    username: user.username,
    displayName: user.displayName
  };
  done(null, sessionUser);
});

// Deserialización del usuario - Recuperar usuario completo
passport.deserializeUser(async (sessionUser: any, done) => {
  try {
    const user = await User.findByPk(sessionUser.id, {
      include: [{
        association: "Role",
        attributes: ["id", "name", "description"]
      }]
    });

    if (!user) {
      return done(null, false);
    }

    // Asegurarse de que la información de autenticación persista
    user.authProvider = sessionUser.authProvider;
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia Local (email y contraseña)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: {
            email,
            authProvider: AuthProvider.LOCAL,
          },
          include: ["Role"],
        })

        if (!user) {
          return done(null, false, { message: "Email no registrado" })
        }

        const isValidPassword = await bcrypt.compare(password, user.password!)
        if (!isValidPassword) {
          return done(null, false, { message: "Contraseña incorrecta" })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

// Configuración de la estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      passReqToCallback: true
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const ip = (req as any).realIp;
        const geoData = (req as any).geo;
        
        // Validación de datos geográficos
        const safeGeo = {
          city: geoData?.city,
          region: geoData?.region,
          country: geoData?.country,
          ll: geoData?.ll,
          timezone: geoData?.timezone,
          proxy: geoData?.proxy
        };

        const [user, created] = await User.findOrCreate({
          where: {
            authProvider: AuthProvider.GITHUB,
            authProviderId: profile.id.toString(),
          },
          defaults: {
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            username: profile.username,
            displayName: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            roleId: 1,
            registrationIp: ip,
            registrationGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            lastLoginIp: ip,
            lastLoginGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            providerMetadata: {
              profile,
              accessToken,
            },
          },
        })

        if (!created) {
          await user.update({
            username: profile.username,
            displayName: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            lastLoginIp: ip,
            lastLoginGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            providerMetadata: {
              profile,
              accessToken,
            },
            isActiveSession: true,
            lastActiveAt: new Date()
          })
        }

        // Actualizar explícitamente el authProvider
        user.authProvider = AuthProvider.GITHUB;

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

// Validar variables de entorno de Discord antes de configurar la estrategia
const discordClientId = process.env.DISCORD_CLIENT_ID?.trim();
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET?.trim();
const discordCallbackUrl = process.env.DISCORD_CALLBACK_URL?.trim();

if (!discordClientId || !discordClientSecret || !discordCallbackUrl) {
  console.warn('  Discord OAuth no está completamente configurado:');
  if (!discordClientId) console.warn('   - DISCORD_CLIENT_ID no está definido');
  if (!discordClientSecret) console.warn('   - DISCORD_CLIENT_SECRET no está definido');
  if (!discordCallbackUrl) console.warn('   - DISCORD_CALLBACK_URL no está definido');
  console.warn('   La autenticación con Discord no funcionará hasta que estas variables estén configuradas.');
} else {
  // Validar formato del Client ID
  const maxSnowflake = BigInt('9223372036854775807'); // Máximo valor de Int64
  const clientIdBigInt = discordClientId ? BigInt(discordClientId) : null;
  
  if (clientIdBigInt && clientIdBigInt > maxSnowflake) {
    console.error(' DISCORD_CLIENT_ID es demasiado grande para un snowflake de Discord');
    console.error(`   Valor actual: ${discordClientId} (${discordClientId.length} dígitos)`);
    console.error(`   Máximo permitido: ${maxSnowflake.toString()} (19 dígitos)`);
    console.error('     Verifica que estés usando el Client ID correcto de Discord');
    console.error('    En Discord Developer Portal, el Client ID está en OAuth2 > General');
    console.error('    Asegúrate de copiar el "Client ID", no el "Application ID" si son diferentes');
  } else {
    console.log(' Discord OAuth configurado correctamente');
    console.log(`   Client ID: ${discordClientId} (${discordClientId.length} dígitos)`);
    console.log(`   Callback URL: ${discordCallbackUrl}`);
  }
}

// Estrategia de Discord (versión corregida)
// Nota: passport-discord espera el clientID como string, no como número
passport.use(
  new DiscordStrategy(
    {
      clientID: discordClientId || '',
      clientSecret: discordClientSecret || '',
      callbackURL: discordCallbackUrl || '',
      scope: ["identify", "email"],
      passReqToCallback: true
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const ip = (req as any).realIp;
        const geoData = (req as any).geo;
        
        // Validación de datos geográficos
        const safeGeo = {
          city: geoData?.city,
          region: geoData?.region,
          country: geoData?.country,
          ll: geoData?.ll,
          timezone: geoData?.timezone,
          proxy: geoData?.proxy
        };

        const [user] = await User.findOrCreate({
          where: {
            authProvider: AuthProvider.DISCORD,
            authProviderId: profile.id,
          },
          defaults: {
            name: profile.username,
            email: profile.email,
            username: profile.username,
            displayName: profile.global_name || profile.username,
            avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
            roleId: 1,
            registrationIp: ip,
            registrationGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            lastLoginIp: ip,
            lastLoginGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            providerMetadata: {
              profile,
              accessToken,
            },
          },
        });

        // Actualizar explícitamente el authProvider
        user.authProvider = AuthProvider.DISCORD;

        await user.update({
          lastLoginIp: ip,
          lastLoginGeo: {
            city: safeGeo.city,
            region: safeGeo.region,
            country: safeGeo.country,
            loc: safeGeo.ll ? [safeGeo.ll[0], safeGeo.ll[1]] : undefined,
            timezone: safeGeo.timezone,
            isProxy: safeGeo.proxy
          },
          isActiveSession: true,
          lastActiveAt: new Date()
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;