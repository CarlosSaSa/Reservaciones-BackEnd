/**
 * Archivo para los controladores para poder crear solones, esto es con rol de administracion
*/

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AulasModel } from "../models/Salones";

export const CrearSalon = async ( req: Request, res: Response  ): Promise< Response <any> > => {
    // Como solo es crear un nombre para un salon, solo recibimos un cuerpo de body
    const { nombreSalon } = req.body;

    const errors = validationResult(req);

    // para obtener ese arreglo de errores usamos la funcion array(), para comprobar que esta vacio podenos usar la funcion
    // isEmpty()
    // entonces si el array de errores no esta vacio mandamos los mensajes de errores
    if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: 'Verifique bien sus datos' , errores: errors.array() });
    }

    // Comprobamos que no este repetido
    try {
        let Salon = await AulasModel.findOne({ nombreSalon }).exec();
        
        // si el resultado anterior no es nulo entonces quiere decir que ya existe el salon
        if ( Salon ) {
            return res.status(400).json({ mensaje: 'El salón ya se encuentra disponible' });
        }

        // si no se encuentra entonces lo insertamos
        Salon = new AulasModel({ nombreSalon });
        const { nombreSalon: nameSalon } = await Salon.save();
        return res.status(201).json({ mensaje: `Salon ${nameSalon} creado correctamente ` });
        
    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error en el servidor mientras se insertaba el registro' });
    }
 
}