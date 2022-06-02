import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import passport from 'passport';
import db from './db';
import router from './network/routes';
import './utils/strategies';

require('dotenv').config();

//db(`mongodb+srv://${process.env.MONGOATLAS_USER}:${process.env.MONGOATLAS_PASSWORD}@cluster0.v65cq.mongodb.net/${process.env.MONGOATLAS_APPNAME}?retryWrites=true&w=majority`);
db(`mongodb+srv://${process.env.MONGOATLAS_USER}:${process.env.MONGOATLAS_PASSWORD}@cluster0.qoymy.mongodb.net/${process.env.MONGOATLAS_APPNAME}?retryWrites=true&w=majority`);
const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
router(app);

app.use('/app', express.static('public')); // servir estáticos desde la carpeta public

app.listen(process.env.PORT);
console.log(`La aplicacion esta escuchando en el puerto ${process.env.PORT}`);
