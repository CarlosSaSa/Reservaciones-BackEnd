import { Router } from "express";
import { ValidationChain, check } from "express-validator";
import { CrearSalon } from "../controllers/Admin";

// Creamos las rutas para que se puedan crear cosas de administrador
const app: Router = Router();

// Array de validaciones
const validacionesRegistro: Array<ValidationChain> = [ check('nombreSalon').notEmpty().withMessage('El campo es obligatorio') ]

// Ruta para crear un salon
app.post('/crearSalon', validacionesRegistro ,CrearSalon);

export default app;