var mongoose = require('mongoose');

var CombattantSchema = new mongoose.Schema({
  id: String,
  name: String,
  hp: {type: Number, default: 100, min:0},
  mp: {type: Number, default: 30, min: 0, max: 100},
  st: {type: Number, default: 40, min: 0, max: 100},
  created_by: String,
  is_my_player: Boolean,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Combattant', CombattantSchema);