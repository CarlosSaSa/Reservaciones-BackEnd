/**
 * Archivo que crea los controladores para el registro de reservaciones de los usuarios
*/
import { Request, Response  } from "express";
import { validationResult } from "express-validator";
import { ReservacionesModel } from "../models/Reservaciones";
import moment from "moment";

// Controlador para crear una reservacion
export const crearReservacion = async ( req: Request, res: Response ) => {

    // Extramos del body los datos necesarios
    const { fecha_inicio, fecha_fin, salon } = req.body;

    // id del usuario  a partir del middleware
    const id = req.id;
    // Ponemos los validadores
    const errors = validationResult(req);

    // si hay errores
    if (!errors.isEmpty()) {
        return res.status(400).json({mensaje: 'Verifique bien los datos', errors: errors.array() });
    }
    // Consultamos en la base de datos que la fecha de inicio y de entrada no esten traslapadas
    // la formula es StartA < EndB and EndA > StartB
    try {
        // Date A - Fecha_inicio - Fecha_fin -> Campos de la base de datos
        // Date B - Fecha_inicio - Fecha_fin 
        // el find devuelve un arreglo de objeto es decir un arreglo de documentos en donde se proyectan todas las columnas
        // COMENTARIO: POR LO VISTO TODA LAS OPERACIONES DE FECHA SE MANEJAN EN FORMATO UTC, ES DECIR SE CASTEAN
        const overlapsDate = await ReservacionesModel.find({ salon: { $eq: salon } ,fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gt: fecha_inicio }  }).exec();
        // si la consulta devuelve datos entonces no podemos insertar
        if ( overlapsDate.length > 0 ) {
            return res.status(406).json({ mensaje: 'Las fechas estan traslapadas con otro evento'  });
        }

        // si no devuelve nada entonces insertamos los datos
        const ReservacionEvent = new ReservacionesModel( { fecha_inicio, fecha_fin, usuario: id, salon});
        const Reservacion = await ReservacionEvent.save();
        return res.status(201).send({ mensaje: 'Evento creado con exito', Reservacion });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Ha ocurrido un error mientras se registraba el evento' });
    }

}

export const obtenerReservaciones = async ( req: Request, res: Response ) => {
    // Obtener las querys
    let { salon } = req.query;
    const page =parseInt( req.query.page as string);
    const limit =parseInt( req.query.limit as string);
    
    // hacemos la consulta a la base de datos
    try {
        // con el metodo populate ya no se le indica la coleccion sino que el campo donde esta almacenado
        // el objectid que hace referencia a la coleccion indicada por ref, esto poblara automatiamente
        // const Reservaciones = await ReservacionesModel.find( { salon: { $eq: salon } }, '-_id -__v' ).populate('salon', '-_id -__v').lean().exec();
        const { docs: Reservaciones } = await ReservacionesModel.
                                    paginate({ salon: { $eq: salon } }, 
                                        { select: '-_id -__v', page, limit, 
                                          populate: { path: 'salon usuario', select: '-_id -__v -fecha_creacion -fecha_actualizacion -password' },
                                          lean: true, leanWithId: false });
        if ( Reservaciones.length > 0 ) {
            for (let i of Reservaciones ) {
                i.fecha_inicio = moment.utc(i.fecha_inicio).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                i.fecha_fin = moment.utc(i.fecha_fin).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
            }
        }
        return res.status(200).json({mensaje: 'Peticion correcta', Reservaciones});
    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error del servidor'});
    }

}
