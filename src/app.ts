import express, { Application } from 'express';
import cors from 'cors';
import home from "./routes/home";

// Inicializacion
const app: Application = express(); 


// Middlewares
app.use(cors());
app.use( express.json() )

// Rutas
app.use('/home', home )

export default app;