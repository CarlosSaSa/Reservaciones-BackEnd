// midlewares para los usuarios
import { Response, Request, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import moment from 'moment';
import { secretKey } from "../config/configJWT";


declare global {
    namespace Express {
      interface Request {
        id: string;
      }
    }
}

/**
 * Funcion que actua como middleware en el cual se debe obtener un token valido, si el token no es valido 
 * entonces no se le permite el acceso al controlador 
*/
export const AuthUser = ( req: Request, res: Response, next: NextFunction ) => {

    // como el token vendra en el header de autorización entonces necesitamos extraerlo de ahi
    const token = req.headers.authorization;
    // si el token viene nulo entonces no se avanza
    if (!token) {
        return res.status(400).json({ mensaje: 'El token no ha sido encontrado' });
    }
    // verificamos si es un token valido
    try {
        const decodedToken: any = verify( token, secretKey ) ;
        // del token obtenemos el id del usuario
        req.id = decodedToken._id;
        next();
    } catch (error) {
        // si el token es invalido
        // si el token ha expirado entonces mandamos un 401
        if ( error.expiredAt ) {
            return res.status(401).json({ mensaje: 'El token ha expirado' })
        } 
        // cualquier otro caso es un token manipulado, etc
        return res.status(400).json({ mensaje: 'Token invalido' });
    }

}


// Middleware customizado para saber si la fecha de inicio es valida o no, esta es una funcion sincrona
// esta funcion sincrona debe retornar false si el valor es invalido
export const customDateVerify = ( value: string ) => {

    const today = moment().date();

    // // Verificamos que la fecha sea valida
    if ( !moment(value).isValid()  ) {
        throw new Error('La fecha es inválida')
    }
    //si son validas entonces verificamos que el dia no sea mayor o menor al dia de hoy
    // si el dia es mayor o menos al dia de hoy es un dato invalido

    if (  moment(value).date() > today || moment(value).date() < today ) {
        throw new Error('La fecha debe ser igual al dia de hoy');
    }
   
    return true;

}
// TODO: Crear un validador para obtener las horas y las fechas