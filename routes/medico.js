// =================================================================
//                         Requires
// =================================================================
var express = require('express');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');


// =================================================================
//                     Obtener todos los medicos
// =================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando médicos.',
                        errors: err
                    })
                };

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: medicos
                    });
                });


            }); //end exec
});

// =================================================================
//                     Obtener medico
// =================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar médico.',
                    errors: err
                })
            };

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El médico con el id: ' + id + ' no existe',
                    errors: { message: 'No existe un médico con ese ID' }
                })
            };

            return res.status(200).json({
                ok: true,
                medico: medico
            })


        })

})

// =================================================================
//                         Actualizar hospital
// =================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar médico.',
                errors: err
            })
        };

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con el id: ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID' }
            })
        };

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar médico.',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        }); //end save

    }); //end FindById
});


// =================================================================
//                      Crear un nuevo médico
// =================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear médico.',
                errors: err
            })
        };

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    }); //end save
});


// =================================================================
//                      Eliminar hospital
// =================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar médico.',
                errors: err
            })
        };

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID.',
                errors: { message: 'No existe un medico con ese ID.' }
            })
        };

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    }); //end findAndRemove
});


// =================================================================
//                          Exports
// =================================================================
module.exports = app;