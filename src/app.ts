import express, { Application, NextFunction, Request, Response } from 'express';
import home from "./routes/home";

// Inicializacion
const app: Application = express(); 

// cors 
// Configurar cabeceras y cors
app.use( (req: Request, res: Response, next: NextFunction ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middlewares
app.use( express.json() )

// Rutas
app.use('/home', home )

export default app;