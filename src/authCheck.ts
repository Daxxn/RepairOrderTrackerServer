import jwt, { RequestHandler } from 'express-jwt';
import jwks from 'jwks-rsa';

export interface AuthConfig {
  audience: string;
  issuer: string;
  algorythm: string;
  dbConnection: string;
  sessionSecret: string;
  appOrigin: string;
  localAppOrigin: string;
  localAppPort: string;

  authCheck: RequestHandler;
};

export default class AuthConfigHelper {
  static auth: AuthConfig;
  static buildAuthSecrets(): AuthConfig {
    if (process.env.AUTH0_AUDIENCE && process.env.AUTH0_ISSUER) {
      if (process.env.APP_ORIGIN || process.env.LOCAL_APP_ORIGIN) {
        this.auth = {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: process.env.AUTH0_ISSUER,
          algorythm: process.env.AUTH0_AGORYTHM,
          dbConnection: process.env.DB_CONNECT,
          sessionSecret: process.env.SESSION_SECRET,
          appOrigin: process.env.APP_ORIGIN,
          localAppOrigin: process.env.LOCAL_APP_ORIGIN,
          localAppPort: process.env.LOCAL_APP_PORT,

          authCheck: this.buildAuthCheck()
        };
        return this.auth;
      }
      throw new Error(
        'Cannot find app origin. An origin needs to be specified. Check ENV file.'
      );
    }
    throw new Error('Cannot authorize. Check ENV file.');
  }

  static getAuthConfig(): AuthConfig {
    return this.auth;
  }

  private static buildAuthCheck() {
    return jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-6ryc0ksm.us.auth0.com/.well-known/jwks.json'
      }),
      audience: this.auth.audience,
      issuer: this.auth.issuer,
      algorithms: [this.auth.algorythm]
    });
  }
}
