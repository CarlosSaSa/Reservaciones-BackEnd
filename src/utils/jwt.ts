// funcion para generar el token dado un payload
import { sign, SignOptions } from "jsonwebtoken";
import { secretKey } from "../config/configJWT";

export interface payload {
    _id: string;
    nombre: string;
    apellido: string,
    correo: string
}


export const generarJWT = ( usuarioPayload: payload ): Promise <string>  => {

    const options: SignOptions = {
        // tiempo de expiracion del token
        expiresIn: '1h'
    }

    return new Promise( (resolve, reject) => {
        sign( usuarioPayload, secretKey, options, ( err, token ) => {
            if( err ) {
                return reject(err);
            } 
            // si no hay un error
            return resolve( token );
        } )
    } )
}