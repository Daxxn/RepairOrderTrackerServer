import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import cors, { CorsOptions } from 'cors';
import dotEnv from 'dotenv';
dotEnv.config();

const app = express();

const mode = process.env.MODE || 'null';
const port = process.env.PORT || 2001;

//#region Init Middleware
const localCors: CorsOptions = {
    origin: 'http://localhost:3000'
};

const prodCors: CorsOptions = {
    origin: '',
    preflightContinue: true
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
if (mode === 'dev') {
    app.use(logger('dev'));
}
//#endregion

//#region Setup Session
const sess = {
    secret: 'keyboard cat',
    cookie: {
        secure: false
    },
    resave: true,
    saveUninitialized: true
};
//#endregion

app.get('/', (req: Request, res: Response, _next: NextFunction) => {
    res.send('Well done!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.send(err);
});

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
});
