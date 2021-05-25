
const express = require('express')
const cors = require('cors')

const {dbConnection} = require('../database/config')
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuario'

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();
        //Rutas de la app

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS        
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());
        
        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuario'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Servidor corriendo en puerto", this.port);
        });
    }
}


module.exports = Server;