// auth controller.ts

// Descripción: En este archivo se definen los controladores de autenticación y autorización, así como las rutas relacionadas con la autenticación y autorización de usuarios. Estos controladores y rutas se utilizan para manejar las operaciones de registro, inicio de sesión, verificación de autenticación, autenticación OAuth, gestión de sesiones y tokens, entre otras funcionalidades relacionadas con la autenticación y autorización de usuarios en la aplicación.

import { Request, Response, NextFunction } from "express";
import { RegisterController } from "./register.controller";
import { LoginController } from "./login.controller";
import { DiscordController } from "./discord.controller";
import { GitHubController } from "./github.controller";
import { VerifyController } from "./verify.controller";
import { SessionController } from "./session.controller";
import { LogoutController } from "./logout.controller";
import { TokenController } from "./token.controller";
import { registerValidations, loginValidations } from "../validators/auth.validator";

export class AuthController {
  static registerValidations = registerValidations;
  static loginValidations = loginValidations;

  // Auth methods
  static register = RegisterController.handle;
  static login = LoginController.handle;
  static verifyAuth = VerifyController.handle;

  // OAuth methods
  static discordAuth = (req: Request, res: Response, next: NextFunction) => {
    DiscordController.auth(req, res, next);
  };

static discordCallback = (req: Request, res: Response, next: NextFunction) => {
  DiscordController.callback(req, res);
};

  static githubAuth = GitHubController.auth;
  static githubCallback = GitHubController.callback;

  // Session management
  static getActiveSessions = SessionController.getActiveSessions;
  static revokeSession = SessionController.revokeSession;
  static revokeOtherSessions = SessionController.revokeOtherSessions;
  static logout = LogoutController.handle;

  // Token management
  static refreshToken = TokenController.refresh;
}