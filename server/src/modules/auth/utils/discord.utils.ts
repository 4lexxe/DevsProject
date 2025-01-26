import User from "../../user/User";
import { DiscordProfile, DiscordUserResponse } from "../types/discord.types";

export class DiscordUtils {
  static formatProviderMetadata(profile: any): DiscordProfile | null {
    if (!profile) return null;
    
    return {
      id: profile.id,
      username: profile.username,
      global_name: profile.global_name,
      avatar: profile.avatar,
      locale: profile.locale,
      verified: profile.verified,
    };
  }

  static formatUserResponse(user: User, authResponse: any): DiscordUserResponse {
    const safeProviderMetadata = this.formatProviderMetadata(
      user.dataValues.providerMetadata?.profile
    );

    return {
      ...authResponse.user,
      name: user.dataValues.name,
      email: user.dataValues.email,
      avatar: user.dataValues.avatar,
      username: user.dataValues.username,
      displayName: user.dataValues.displayName,
      roleId: user.dataValues.roleId,
      role: user.dataValues.Role ? {
        id: user.dataValues.Role.id,
        name: user.dataValues.Role.name,
        description: user.dataValues.Role.description,
      } : null,
      authProvider: user.dataValues.authProvider,
      authProviderId: user.dataValues.authProviderId,
      providerMetadata: safeProviderMetadata,
      createdAt: user.dataValues.createdAt,
      updatedAt: user.dataValues.updatedAt,
    };
  }
}