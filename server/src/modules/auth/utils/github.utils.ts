import User from "../../user/User";
import { GitHubProfile, GitHubUserResponse } from "../types/github.types";

export class GitHubUtils {
  static formatProviderMetadata(profile: any): GitHubProfile | null {
    if (!profile) return null;
    
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    };
  }

  static formatUserResponse(user: User, authResponse: any): GitHubUserResponse {
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