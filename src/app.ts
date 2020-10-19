import express, { Application } from 'express';
import cors from 'cors';
import home from "./routes/home";
import admin from './routes/admin';
import user from './routes/user';
// Inicializacion
const app: Application = express(); 


// Middlewares
app.use(cors());
app.use( express.json() )

// Rutas
app.use('/home', home );
app.use('/admin', admin );
app.use('/user', user );

export default app;