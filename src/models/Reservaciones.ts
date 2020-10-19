/**
 * Modelo para las reservaciones
*/

import { Document, model, Schema, SchemaDefinition, Types, PaginateModel } from "mongoose";
import  mongoosePaginate  from "mongoose-paginate-v2";


// interface para las reservaciones
export interface IReservaciones extends Document {
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    usuario: any;
    salon: any;
}

interface IReservacionesModel extends PaginateModel< IReservaciones > {
}

// cremos las opciones del modelo
const ReservacionesOptions: SchemaDefinition = {
    fecha_inicio: {
        type: Date,
        required: true,  
    },
    fecha_fin: {
        type: Date,
        required: true
    },
    usuario: {
        type: Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    salon: {
        type: Types.ObjectId,
        ref: 'Aulas',
        required: true
    }
}

// creamos el esquema
const ReservacionesSchema: Schema = new Schema( ReservacionesOptions );

ReservacionesSchema.plugin(mongoosePaginate);

// exportamos el modelo
export const ReservacionesModel = model<IReservaciones, IReservacionesModel>( 'Reservaciones', ReservacionesSchema );


