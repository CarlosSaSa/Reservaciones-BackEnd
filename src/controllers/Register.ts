import { Request, Response } from "express";
import { IUser, UserModel } from "../models/User";
import { validationResult } from "express-validator";

export const Register = async ( req: Request, res: Response ) : Promise< Response< any > >  =>  {
     // Obtenemos los datos del body de la request
     const { nombre, apellido, correo, password } = req.body as IUser;
    
     // el resultado de validationResult es un objeto, el segundo elemento llamado error es un arreglo de objetos el cual
     // contiene los mensajes de validacion asi como las etiquetas en la cual esta sucediendo la validacion
     const errors = validationResult(req);

     // para obtener ese arreglo de errores usamos la funcion array(), para comprobar que esta vacio podenos usar la funcion
     // isEmpty()
    // entonces si el array de errores no esta vacio mandamos los mensajes de errores
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    // si no hay errores de validacion entonces hacemos el insert en la base de datos
    const User = new UserModel({
        nombre, apellido, correo, password
    })

    try {
        const userSave = await User.save();
        // Si no ha ocurrido un error
        return res.status(201).json({mensaje: 'Usuario guardado con exito', userSave });
    } catch (error) {
        return res.status(200).json({ message: 'Ha ocurrido un error al insertar el registro', error });
    }
    
}