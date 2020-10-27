/**
 * Archivo que crea los controladores para el registro de reservaciones de los usuarios
*/
import { Request, Response  } from "express";
import { validationResult } from "express-validator";
import { ReservacionesModel } from "../models/Reservaciones";
import { flattenArray} from "../utils/flattenObject";
import { AulasModel } from "../models/Salones";
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
                                          populate: { path: 'salon usuario', select: '-__v -fecha_creacion -fecha_actualizacion -password' },
                                          lean: true, leanWithId: false });
        if ( Reservaciones.length > 0 ) {
            for (let i of Reservaciones ) {
                i.usuario._id =  i.usuario._id.toString();
                i.salon._id =  i.salon._id.toString();
                i.fecha_inicio = moment.utc(i.fecha_inicio).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                i.fecha_fin = moment.utc(i.fecha_fin).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                
            }
        }
        return res.status(200).json({mensaje: 'Peticion correcta', Reservaciones: flattenArray( Reservaciones ) });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error del servidor'});
    }

}

// Controlador para obtener todas las reservaciones es decir sin el filtro del salon
export const getAllReservations = async ( req: Request, res: Response ) => {

    // obtener el query
    const { page, size } = req.query;
    const pagina: number = parseInt( page as string, 10 );
    const limite: number = parseInt( size as string, 10 );


    // Aqui vamos a implementar la paginacion
    try {
        const { docs: Reservaciones } = await ReservacionesModel.paginate({},{
            select: '-__v',
            populate: { path: "usuario salon", select: '-_id -__v -password' },
            page: pagina,
            limit: limite,
            sort: { fecha_inicio: 'asc' },
            lean: true,
            leanWithId: false
        })

        if ( Reservaciones.length > 0 ) {
            for( let i of Reservaciones ) {
                i._id = i._id.toString();
                if( i.fecha_inicio && i.fecha_fin ) {
                    i.fecha_inicio = moment.utc(i.fecha_inicio).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                    i.fecha_fin = moment.utc(i.fecha_fin).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                }
            }
        }
        return res.status(200).json({ mensaje: 'Listo!', Reservaciones: flattenArray(Reservaciones) });

    } catch (error) {
        return res.status(500).json({mensaje: 'Ha ocurrido un error', error});
    }


}

export const getAllClassRoom = async (req: Request, res: Response) => {

    try {
        const Salones = await AulasModel.find({}, '-__v').sort({ nombreSalon: 1 });
        return res.status(200).json({mensaje: 'Listo!', Salones });
    } catch (error) {
        return res.status(500).json({ error });
    }


}

export const getClassRoomById = async (req: Request, res: Response) => {

    // obtenemos el id de los params
    const { id } = req.params;
    // intentamos hacer la busqueda
    try {
        const salon = await AulasModel.findById( id, '-__v' ).exec();
        // si no existe el salon o es null
        if( !salon ) {
            return res.status(200).json({ mensaje: 'Salón no disponible' });
        }
        return res.status(200).json({ mensaje: 'Salon Ok', salon });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error', error });
    }

}

export const getReservationsPersonal = async (req: Request, res: Response) => {

    // obtenemos el id del middleware
    const id = req.id;

    // obtenemos los params del request
    const { page, limit } = req.query;
    const pagina = parseInt( page as string, 10 ) || 1;
    const limite = parseInt( limit as string, 10 ) || 10;

    // buscamos las reservaciones asociadas a ese id del usuario
    try {
        const { docs } = await ReservacionesModel.paginate({ usuario: id },{
            select: '-__v',
            populate: { path: 'usuario salon', select: "-password -correo -fecha_creacion -fecha_actualizacion -__v" },
            page: pagina,
            limit: limite,
            lean: true,
            leanWithId: false,
        })

        if ( docs.length > 0 ) {
            for (const index of docs) {
                index._id = index._id.toString();
                index.fecha_inicio = moment.utc(index.fecha_inicio).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                index.fecha_fin = moment.utc(index.fecha_fin).local().format('dddd, D [de] MMMM [de] YYYY h:mm:ss a');
                if( index.usuario && index.salon ) {
                    index.usuario._id = index.usuario._id.toString();
                    index.salon._id = index.salon._id.toString();
                }
            }
        }
        
        // convertir fechas a datos locales asi como los ids a strings

        return res.status(200).json({ mensaje: 'Datos obtenido correctamente', Reservaciones: flattenArray( docs) });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error del servidor' });
    }

}

// funcion para actualizar un documento
export const updateReservation =  async ( req: Request, res: Response ) => {

    // obtenemos del body los elementos y de los params
    // TODO: Verificar que el parametro no venga vacio
    const { idReservacion } = req.query;
    const { fecha_inicio, fecha_fin, salon } = req.body;

    const errors = validationResult(req);

    // si hay errores
    if (!errors.isEmpty()) {
        return res.status(400).json({mensaje: 'Verifique bien los datos', errors: errors.array() });
    }

    // buscamos el id de la reservacion 
    try {
        const Reservacion = await ReservacionesModel.findById(idReservacion).exec();

        // si es nulo entonces no existe la reservacion
        if ( !Reservacion ) {
            return res.status(400).json({ mensaje: 'La reservacion no existe' });
        }

        // si el id del usuario de la reservacion es diferente al id del token entonces no puede edutat
        if ( Reservacion.usuario != req.id ) {
            return res.status(403).json({ mensaje: 'La reservacion no existe' });
        }

        // Esta consulta es diferente aqui, tenemos que analizar todas las reservaciones diferentes al id que queremos actualizar
        // porque si no excluimos el id en el mejor de los casos vamos a obtener que la fecha se traslapa con el mismo evento suyo 
        // y lo que queremos es actualizar dicho evento traslapado
        const overlapsDate = await ReservacionesModel.find({ _id: { $ne: idReservacion } ,salon: { $eq: salon } ,fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gt: fecha_inicio }  }).exec();
       

        if ( overlapsDate.length > 0 ) {
            return res.status(406).json({ mensaje: 'Las fechas estan traslapadas con otro evento'  });
        }


        // actualizamos el documento
        const ReservationUpdated = await ReservacionesModel.findByIdAndUpdate(idReservacion, {  fecha_inicio, fecha_fin, salon }, { new: true });
        return res.status(201).json({ mensaje: 'Evento actualizado', ReservationUpdated });

    } catch (error) {
        return res.status(500).json({ mensaje: 'Ha ocurrido un error' });
    }



}

// funcion para eliminar una reservacion
export const deleteReservation = async ( req: Request, res: Response ) => {

    // Obtenemos el id de los parametros
    const { id } = req.params;
    try {

        // buscamos el registro
        const Reservacion = await ReservacionesModel.findById(id).exec();

        if( !Reservacion ){
            return res.status(400).json({ mensaje: 'No es posible encontrar el id'});
        }

        // si existe la reservacion pero el id del usuario que esta en el token no coindice con el id del usuario
        if( req.id !== Reservacion.usuario.toString() ) {
            return res.status(403).json({ mensaje: 'No puede borrar una reservación que no es suya' })
        }

        //TODO: Realizar la validacion de que si la fecha de inicio de la reservacion a eliminar es menor a la fecha actual
        // es decir el dia actual entonces no lo podemos permitir
        
        // eliminamos el registro
        const userDeleted = await ReservacionesModel.findByIdAndDelete( id );
        return res.status(200).json({ mensaje: 'Usuario eliminado', userDeleted});

    } catch (error) {
        return res.status(500).json({ mensaje:'Ha ocurrido un error mientras se realizaba la operación' });
    }


}