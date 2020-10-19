import { Document, model, Schema, SchemaDefinition  } from "mongoose";

// Interfaz para recibir ayuda de typescript
interface ISalones extends Document {
    nombreSalon: string
}

// Creamos la definicion del esquema
const AulasSchema: SchemaDefinition = {
    nombreSalon: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    }
}

// Creamos el esquema
const Aulas: Schema = new Schema(AulasSchema);

// Creamos el modelo
export const AulasModel = model< ISalones >('Aulas', Aulas);