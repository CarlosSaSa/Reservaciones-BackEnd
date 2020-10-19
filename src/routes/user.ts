/**
 * Rutas para crear recursos de los usuarios
*/

import { Router } from "express";
import { body } from "express-validator";
import { crearReservacion, obtenerReservaciones } from "../controllers/User";
import { AuthUser, customDateVerify } from "../middlewares/user";


// Creamos una instancia de route
const app: Router = Router();

// Creacion del array de middlewares usando express validator
const arrayValidator = [ body('salon').notEmpty().withMessage('El id del salon es requerido'),
                         body(['fecha_inicio', 'fecha_fin']).custom( customDateVerify ).
                         withMessage('Verifique el formato de las fechas o que la fecha no sea igual o menor a la de hoy'),
                         AuthUser
                        ]

// metodo para poder insertar un registro de un evento es decir una reservacion
app.post('/crearReservacion', arrayValidator ,crearReservacion );
app.get('/obtenerReservaciones', AuthUser, obtenerReservaciones  );

export default app;
