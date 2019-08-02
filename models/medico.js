// =================================================================
//                        Requires
// =================================================================
var mongoose = require('mongoose');


// =================================================================
//                        Schema
// =================================================================
var Schema = mongoose.Schema;


var medicoSchema = new Schema({

  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  img: { type: String, required: false },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El ID del hospital es un campo obligatorio'] }

  });


// =================================================================
//                        Exports
// =================================================================
module.exports = mongoose.model('Medico', medicoSchema);
