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

// Serialización del usuario
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id, {
      include: ["Role"],
    })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

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
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
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
            providerMetadata: {
              profile,
              accessToken,
            },
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

// Estrategia de Discord (versión corregida)
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ["identify", "email"],
      passReqToCallback: true
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const ip = (req as any).realIp; // ← Ya tiene fallback seguro
        const geoData = (req as any).geo;
        
        // Validación de datos geográficos
        const safeGeo = {
          city: geoData.city,
          region: geoData.region,
          country: geoData.country,
          ll: geoData.ll,
          timezone: geoData.timezone,
          proxy: geoData.proxy
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
              loc: [safeGeo.ll[0], safeGeo.ll[1]],
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            lastLoginIp: ip,
            lastLoginGeo: {
              city: safeGeo.city,
              region: safeGeo.region,
              country: safeGeo.country,
              loc: [safeGeo.ll[0], safeGeo.ll[1]],
              timezone: safeGeo.timezone,
              isProxy: safeGeo.proxy
            },
            providerMetadata: {
              profile,
              accessToken,
            },
          },
        });

        await user.update({
          lastLoginIp: ip,
          lastLoginGeo: {
            city: safeGeo.city,
            region: safeGeo.region,
            country: safeGeo.country,
            loc: [safeGeo.ll[0], safeGeo.ll[1]],
            timezone: safeGeo.timezone,
            isProxy: safeGeo.proxy
          }
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport

