import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import cors, { CorsOptions } from 'cors';
import dotEnv from 'dotenv';
// import jwt from 'express-jwt';
// import jwks from 'jwks-rsa';
import http from 'http';
import session from 'express-session';
import mongoose from 'mongoose';
import createApiRouter from './routes/api';
import createAuthRoute from './routes/auth';

dotEnv.config();

const app = express();

const mode = process.env.MODE || 'null';
const port = process.env.PORT || 2001;

app.set('views', './public/static/');
app.set('view engine', 'pug');

//#region Get Environment Variables
type AuthConfig = {
  audience: string;
  issuer: string;
  algorythm: string;
  dbConnection: string;
  sessionSecret: string;
  appOrigin: string;
  localAppOrigin: string;
  localAppPort: string;
};

const buildAuthSecrets = (): AuthConfig => {
  if (process.env.AUTH0_AUDIENCE && process.env.AUTH0_ISSUER) {
    if (process.env.APP_ORIGIN || process.env.LOCAL_APP_ORIGIN) {
      return {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER,
        algorythm: process.env.AUTH0_AGORYTHM,
        dbConnection: process.env.DB_CONNECT,
        sessionSecret: process.env.SESSION_SECRET,
        appOrigin: process.env.APP_ORIGIN,
        localAppOrigin: process.env.LOCAL_APP_ORIGIN,
        localAppPort: process.env.LOCAL_APP_PORT
      };
    }
    throw new Error(
      'Cannot find app origin. An origin needs to be specified. Check ENV file.'
    );
  }
  throw new Error('Cannot authorize. Check ENV file.');
};
const auth = buildAuthSecrets();
//#endregion

//#region Build Routes
const buildLogoutRoute = () => {
  app.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (req.session) {
        req.session.destroy(err => {
          if (err) {
            next(err);
          } else {
            res.clearCookie('connect.sid');
            res.clearCookie('userId');
            res.status(200).send('Success');
          }
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  });
};

const buildRoutes = (db: typeof mongoose) => {
  app.use('/api', createApiRouter(db));
  app.use('/auth', createAuthRoute(db));
  buildLogoutRoute();
};
//#endregion

//#region Init Middleware
const localCors: CorsOptions = {
  origin: `${auth.localAppOrigin}${auth.localAppPort}/`
};

const prodCors: CorsOptions = {
  origin: auth.appOrigin,
  preflightContinue: true
};
if (process.env.MODE === 'dev') {
  app.use(cors(localCors));
} else {
  app.use(cors(prodCors));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
if (mode === 'dev') {
  app.use(logger('dev'));
}
//#endregion

//#region Setup Session
const sess = {
  secret: auth.sessionSecret,
  cookie: {
    secure: false
  },
  resave: true,
  saveUninitialized: true
};

app.use(session(sess));
//#endregion

//#region Setup Auth0 Middleware
// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://dev-6ryc0ksm.us.auth0.com/.well-known/jwks.json'
//   }),
//   audience: auth.audience,
//   issuer: auth.issuer,
//   algorithms: [auth.algorythm]
// });

// app.use(jwtCheck);

// app.get('/authorized', (req: Request, res: Response) => {
//   res.send('Secured Resource');
// });
//#endregion

app.get('/', (req: Request, res: Response) => {
  res.status(200).sendFile('./public/static/index.html', { root: __dirname });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json(err);
});

//#region Start Server
const server = http.createServer(app);

const serverStartCallback = () => {
  if (process.env.MODE === 'dev') {
    console.log(`Server started. Listening on port: ${port}`);
  }
};

const connectToDatabase = async () => {
  if (auth.dbConnection) {
    const db = await mongoose.connect(auth.dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    });
    buildRoutes(db);
  } else {
    throw new Error('Cannot connect to database. Check ENV file.');
  }
};

const startServer = () => {
  if (port) {
    app.set('port', port);
    connectToDatabase()
      .then(() => {
        server.listen(port, () => serverStartCallback());
      })
      .catch(err => {
        throw err;
      });
  } else {
    throw new Error(
      'Server start failed. Could not normalize port. Check ENV file.'
    );
  }
};

startServer();
//#endregion
