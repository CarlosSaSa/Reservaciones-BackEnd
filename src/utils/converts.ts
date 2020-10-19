// funcion para retornar un objeto del tipo payload

import { IUserModel } from "../models/User";
import { payload } from "./jwt";

export const ConvertToPayload = ( Usuario: IUserModel ): payload => ({
    _id: Usuario._id.toString(),
    nombre: Usuario.nombre,
    apellido: Usuario.apellido,
    correo: Usuario.correo
})
