import { Router } from "express";
import { Register } from "../controllers/Register";
import { check, ValidationChain } from "express-validator";

const app: Router = Router();

// array de validaciones
const validacionesRegistro: Array<ValidationChain> = [ 
    check('nombre').notEmpty().withMessage('El nombre no puede ser vacio'),
    check('apellido').notEmpty().withMessage('El apellido no puede ser vacio'),
    check('correo').isEmail().withMessage('Debe ser un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
                     .isLength({ min:6 }).withMessage('La contraseña debe tener al menos 6 caracteres') ]

// Registro
app.post('/register', validacionesRegistro ,Register)

export default app;