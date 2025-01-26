import { TokenSession } from "../types/auth.types";
import { SessionResponse } from "../types/session.types";

export class SessionUtils {
  static maskToken(token: string): string {
    return token.substring(0, 10) + '...';
  }

  static formatSession(session: TokenSession): SessionResponse {
    return {
      ...session,
      token: this.maskToken(session.token)
    };
  }

  static formatSessions(sessions: TokenSession[]): SessionResponse[] {
    return sessions.map(session => this.formatSession(session));
  }
}