import { Schema, model, SchemaDefinition, Document } from "mongoose";
import moment from "moment";

moment.locale('es-mx');

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
        type: String,
        default: moment().format('LLLL')
    },
    fecha_actualizacion: { 
        type: String,
    }
}

// definiendo el esquema
const userSchema = new Schema( UserDefinition);

// Metodos de esquema
userSchema.pre< IUserModel>('save', function (next){
     // este metodo sirve para actualizar la fecha de actualizacion
     // para ambos casos cuando se cree o se actualice necesitaremos la fecha actual
     this.fecha_actualizacion = moment().format('LLLL');

    // antes que se guarde el documento pero cuando se actualice entonces igual se actualizará la contraseña
    // entonces para hacer esto tenemos que verificar una condicion
    
    // TODO: Verificar el comportamiento cuando se actualiza si es que funciona

     next();
})


// Creando el modelo
export const UserModel = model<IUserModel>('Usuarios', userSchema);
