import { Router } from "express";
import { Login, Register } from "../controllers/Register";
import { check, ValidationChain } from "express-validator";

const app: Router = Router();

// array de validaciones
const validacionesRegistro: Array<ValidationChain> = [ 
    check('nombre').notEmpty().withMessage('El nombre no puede ser vacio'),
    check('apellido').notEmpty().withMessage('El apellido no puede ser vacio'),
    check('correo').isEmail().withMessage('Debe ser un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
                     .isLength({ min:6 }).withMessage('La contraseña debe tener al menos 6 caracteres') ];


// Array de validaciones para el login
const validacionesLogin: Array<ValidationChain> = [
    check('correo').isEmail().withMessage('Debe ser un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
];

// Registro
app.post('/register', validacionesRegistro ,Register);

// Login
app.post('/login', validacionesLogin ,Login);

export default app;