import { Request, Response } from "express";
import { IUser, UserModel } from "../models/User";
import { validationResult } from "express-validator";
import { hash, compare } from "bcrypt";
import moment from 'moment';
import { generarJWT, payload } from "../utils/jwt";
import { ConvertToPayload } from "../utils/converts";

export const Register = async (req: Request, res: Response): Promise<Response<any>> => {
    // Obtenemos los datos del body de la request
    const { nombre, apellido, correo, password } = req.body as IUser;

    // el resultado de validationResult es un objeto, el segundo elemento llamado error es un arreglo de objetos el cual
    // contiene los mensajes de validacion asi como las etiquetas en la cual esta sucediendo la validacion
    const errors = validationResult(req);

    // para obtener ese arreglo de errores usamos la funcion array(), para comprobar que esta vacio podenos usar la funcion
    // isEmpty()
    // entonces si el array de errores no esta vacio mandamos los mensajes de errores
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    // si no hay errores de validacion entonces hacemos la comprobacion de que no exista el usuario registrado con un email
    const User = new UserModel({
        nombre, apellido, correo, password
    })

    try {
        // Si el usuario no existe entonces la variable UserExist es nula en caso contrario devuelve un elemento
        const UserExist = await UserModel.findOne({ correo }).exec();
        // si existe el elemento entonces el usuario ya existe
        if (UserExist) {
            return res.status(200).json({ message: 'El usuario ya esta registrado' });
        }
        // Si no esta registrado entonces lo guardamos, hay que encriptar la contraseña
        User.password = await hash(User.password, 10);

        // Pasamos a guardar al usuario
        const { nombre, apellido } = await User.save();
        return res.status(201).json({ mensaje: 'Usuario guardado con exito', Usuario: { nombre: `${ nombre } ${ apellido }` } });

    } catch (error) {
        // si ha ocurrido un error
        return res.status(200).json({ message: 'Ha ocurrido un error al registrar un usuario', error });
    }

}

// Funcion para el login de usuario
export const Login = async ( req: Request, res: Response ) => {

    // Obtenemos del body el password y el correo
    const { correo, password } = req.body;

    // Tenemos que hacer la consulta para verificar que este registrado el usuario
    try {
        const UserExist = await UserModel.findOne({ correo });

        // si el variable UserExist es null entonces el usuario no esta registradi en caso contrario ya esta registrado
        if ( !UserExist ) {
            return res.status(200).json({ message: 'El usuario y/o contraseña no son correctos' });
        }

        // si si existe el usuario entonces procedemos a verificar que la contraseña coincida
        const IsSamePassword = await compare( password, UserExist.password );

        // si la variable anterior es true entonces la contraseña es correcta
        if ( !IsSamePassword ) {
            return res.status(200).json({ message: 'El usuario y/o contraseña no son correctos' });
        }

        

       // si la contraseña coincidio entonces enviamos el token
       const token = await generarJWT( ConvertToPayload( UserExist ) );
        // hasta este punto la autenticacion ha sido un exito entonces procedemos a enviar el JWT
        return res.status(200).json({ message: 'Hello world', token });

    } catch (error) {
        return res.status(200).json({ message: 'Ha ocurrido un error al iniciar sesion', error });
    }


}