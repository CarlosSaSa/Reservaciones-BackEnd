import app from './app';
import moongose from "mongoose";
import { URI } from './config/configDB';

const PORT = process.env.PORT || 8080;

// Cambiando el puerto
app.set('port', PORT);

// Conectando se la base de datos
moongose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // Si la conexion es exitosa entonces iniciamos el servidor
    app.listen(app.get('port'), () => {
      console.log(`Escuchando en el puerto: ${app.get('port')}`);
    })
  })
  .catch( (error) => {
    throw new Error(error);
  } )
