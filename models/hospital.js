// =================================================================
//                         Requires
// =================================================================
var mongoose = require('mongoose');

// =================================================================
//                        Schema
// =================================================================
var Schema = mongoose.Schema;


var hospitalSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

    },
    { collection: 'hospitales' });


// =================================================================
//                           Exports
// =================================================================
module.exports = mongoose.model('Hospital', hospitalSchema);
