// =================================================================
//                         Requires
// =================================================================
var express = require('express');

var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



// middleware
app.use(fileUpload());


// =================================================================
//                          Upload
// =================================================================

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // validar tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Tipo de colección no válida',
          errors: { message: 'Tipo de colección no válida'}
        })
    }

    // validar que exista archivo
    if ( !req.files ) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No seleccionó nada.',
          errors: { message: 'Debe seleccionar una imagen.'}
        })
    }

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];


    //validar extension
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf( extensionArchivo ) < 0 ) { //no lo encontró
        return res.status(400).json({
          ok: false,
          mensaje: 'Extensión no válida.',
          errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ')}
        })
    }


    //nombre de archivo personalizado
    // 1516112314-123.png   ---> (id-numeroRandom-extension)
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    //mover el archivo del temporal a un path específico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {

        if ( err ) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al mover archivo.',
              errors: err
            })
        }

        subirPorTipo( tipo, id, nombreArchivo, res );

        // res.status(200).json({
        //   ok: true,
        //   mensaje: 'Archivo movido'
        // })

    });


});

// =================================================================
//                          Subir
// =================================================================


function subirPorTipo( tipo, id, nombreArchivo, res ) {

    if ( tipo === 'usuarios' ){

          Usuario.findById( id, (err, usuario) => {

              if (!usuario){
                  return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'}
                  })
              }

              var pathViejo = './uploads/usuarios/' + usuario.img;

              // Si existe, elimina la imagen anterior
              if ( fs.existsSync(pathViejo) ){
                  fs.unlink( pathViejo )
              }

              usuario.img = nombreArchivo;

              usuario.save( (err, usuarioActualizado) => {

                  if ( err ) {
                      return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imágen.',
                        errors: err
                      })
                  }

                  usuarioActualizado.password = ':)';

                  return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de usuario actualizada',
                    usuario: usuarioActualizado
                  })
              }) // end save

          }) // end findById
    }

    if ( tipo === 'hospitales' ){

          Hospital.findById( id, (err, hospital) => {

              if (!hospital){
                  return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe'}
                  })
              }

              var pathViejo = './uploads/hospitales/' + hospital.img;

              // Si existe, elimina la imagen anterior
              if ( fs.existsSync(pathViejo) ){
                  fs.unlink( pathViejo )
              }

              hospital.img = nombreArchivo;

              hospital.save( (err, hospitalActualizado) => {

                  if ( err ) {
                      return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imágen.',
                        errors: err
                      })
                  }

                  return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de hospital actualizada',
                    hospital: hospitalActualizado
                  })
              }) // end save

          }) // end findById
    }

    if ( tipo === 'medicos' ){

          Medico.findById( id, (err, medico) => {

              if (!medico){
                  return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
                  })
              }

              var pathViejo = './uploads/medicos/' + medico.img;

              // Si existe, elimina la imagen anterior
              if ( fs.existsSync(pathViejo) ){
                  fs.unlink( pathViejo )
              }

              medico.img = nombreArchivo;

              medico.save( (err, medicoActualizado) => {

                  if ( err ) {
                      return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imágen.',
                        errors: err
                      })
                  }

                  return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de medico actualizada',
                    medico: medicoActualizado
                  })
              }) // end save

          }) // end findById
    }
}



// =================================================================
//                          Exports
// =================================================================
module.exports = app;
