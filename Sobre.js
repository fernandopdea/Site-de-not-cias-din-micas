var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sobreSchema = new Schema({
  titulo: String,
  imagem: String,
  categoria: String,
  conteudo: String,
  slug: String,
  autor: String,
  views: Number,
  link: String,
  conteudo2: String,
  imagem2: String,
  imagem3: String,
  imagem4: String,
}, { collection: 'sobre' })

var Sobre = mongoose.model("Sobre", sobreSchema);

module.exports = Sobre;