import { Schema, model, SchemaDefinition, SchemaOptions, Document } from "mongoose";

// Interfaz para definir el tipo de dato del modelo
export interface IUser {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
}

// Interfaz para ser usada en el modelo
interface IUserModel extends IUser, Document{}

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
        type: Date 
    }
}

const options: SchemaOptions = {
    timestamps: {
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    }
}


// definiendo el esquema
const userSchema = new Schema( UserDefinition, options );

// Creando el modelo
export const UserModel = model<IUserModel>('Usuarios', userSchema);
