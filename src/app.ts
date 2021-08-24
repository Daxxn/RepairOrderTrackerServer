import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import cors, { CorsOptions } from 'cors';
import dotEnv from 'dotenv';
import http from 'http';
import session from 'express-session';
import mongoose from 'mongoose';
import createApiRouter from './routes/api';
import createAuthRoute from './routes/auth';
import AuthConfigHelper from './utils/authCheck';

dotEnv.config();

//#region Get Environment Variables
const config = AuthConfigHelper.buildConfig();
//#endregion

const app = express();
app.set('use-auth', config.useAuth);

app.set('views', './public/static/');
app.set('view engine', 'pug');

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
  app.use('/api', createApiRouter(db, config));
  app.use('/auth', createAuthRoute(db));
  buildLogoutRoute();
};
//#endregion

//#region Init Middleware
const localCors: CorsOptions = {
  origin: `${config.localAppOrigin}${config.localAppPort}/`,
};

const prodCors: CorsOptions = {
  origin: config.appOrigin,
  preflightContinue: true,
};
if (config.env === 'dev') {
  app.use(cors(localCors));
} else {
  app.use(cors(prodCors));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
if (config.env === 'dev') {
  app.use(logger(config.env));
}
//#endregion

//#region Setup Session
const sess = {
  secret: config.sessionSecret,
  cookie: {
    secure: false,
  },
  resave: true,
  saveUninitialized: true,
};

app.use(session(sess));
//#endregion

//#region Setup Auth0 Middleware
if (config.useAuth == true) {
  app.use('/api', config.authCheck);
}
//#endregion

app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .sendFile('./public/static/index.html', { root: __dirname });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json(err);
});

//#region Start Server
const server = http.createServer(app);

const serverStartCallback = () => {
  if (config.env === 'dev') {
    console.log(`Server started. Listening on port: ${config.port}`);
  }
};

const connectToDatabase = async () => {
  if (config.dbConnection) {
    const db = await mongoose.connect(config.dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    buildRoutes(db);
  } else {
    throw new Error('Cannot connect to database. Check ENV file.');
  }
};

const startServer = () => {
  if (config.port) {
    app.set('port', config.port);
    connectToDatabase()
      .then(() => {
        server.listen(config.port, () => serverStartCallback());
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
