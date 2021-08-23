import jwt, { RequestHandler } from 'express-jwt';
import jwks from 'jwks-rsa';
import dotEnv from 'dotenv';

dotEnv.config();

export type EnvOption = 'dev' | 'prod' | 'stage';

export interface AuthConfig {
  port: number;
  env: string;
  useAuth: boolean;
  audience: string;
  issuer: string;
  algorythm: string;
  dbConnection: string;
  sessionSecret: string;
  appOrigin: string;
  localAppOrigin: string;
  localAppPort: string;

  authCheck?: RequestHandler | null;
};

export default class AuthConfigHelper {
  static auth: AuthConfig;
  private static buildAuth() {
    if (process.env.AUTH0_AUDIENCE && process.env.AUTH0_ISSUER) {
      if (process.env.APP_ORIGIN || process.env.LOCAL_APP_ORIGIN) {
        this.auth = {
          port: this.normalizePort(),
          env: this.normalizeEnvOption(),
          useAuth: process.env.USE_AUTH == 'true' ? true : false,
          audience: process.env.AUTH0_AUDIENCE,
          issuer: process.env.AUTH0_ISSUER,
          algorythm: process.env.AUTH0_ALGORYTHM,
          dbConnection: process.env.DB_CONNECT,
          sessionSecret: process.env.SESSION_SECRET,
          appOrigin: process.env.APP_ORIGIN,
          localAppOrigin: process.env.LOCAL_APP_ORIGIN,
          localAppPort: process.env.LOCAL_APP_PORT,
        };
        return;
      }
      throw new Error(
        'Cannot find app origin. An origin needs to be specified. Check ENV file.'
      );
    }
    throw new Error('Cannot authorize. Check ENV file.');
  }

  private static normalizePort(): number {
    const port = Number.parseInt(process.env.PORT);
    if (isNaN(port)) {
      return 2000;
    }
    return port;
  }

  private static normalizeEnvOption(): EnvOption {
    if (process.env.MODE) {
      const tempEnv = process.env.MODE as EnvOption;
      if (tempEnv) {
        return tempEnv;
      }
      return 'dev';
    }
    return 'dev';
  }

  private static buildAuthCheck() {
    this.auth.authCheck = jwt({
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

  static buildConfig(): AuthConfig {
    this.buildAuth();
    this.buildAuthCheck();
    return this.auth;
  }

  static getAuthConfig(): AuthConfig {
    if (!this.auth) {
      this.buildConfig();
    }
    return this.auth;
  }

  static getAuthCheck(): RequestHandler | null {
    return this.auth.authCheck;
  }
}
