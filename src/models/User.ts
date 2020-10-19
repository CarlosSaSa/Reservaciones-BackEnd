import { Schema, model, SchemaDefinition, Document } from "mongoose";
import moment from "moment";

// Interfaz para definir el tipo de dato del modelo
export interface IUser {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
}

// Interfaz para ser usada en el modelo
export interface IUserModel extends IUser, Document{
    fecha_creacion ?: string,
    fecha_actualizacion?: string
}

const UserDefinition: SchemaDefinition = {
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    },
    correo: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    fecha_creacion: { 
        type: Date
    },
    fecha_actualizacion: { 
        type: Date,
    }
}

// definiendo el esquema
const userSchema = new Schema( UserDefinition, { timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' } });

// Creando el modelo
export const UserModel = model<IUserModel>('Usuarios', userSchema);
