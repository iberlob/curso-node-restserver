const {request, response} = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const usuariosGet = async (req=request, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total, usuarios
    });
}
const usuariosPost = async (req, res = response) => {
    const {nombre, correo, password, role} = req.body;

    const usuario = new Usuario({nombre, correo, password, role});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    console.log(usuario.role)

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}
const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto} = req.body;

    //TODO validar contra base de datos
    if( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}
const usuariosPatch = (req, res = response) => {
    res.json({
        'msg':'Pacth API - controlador'
    });
}
const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}