import { Request, Response, Router } from "express";

const app: Router = Router();

// Rutas 

// Registro
app.post('/register', ( req: Request, res: Response ) => {

    res.status(200).json({ message: 'Hello world' });

})

export default app;