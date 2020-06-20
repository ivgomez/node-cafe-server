const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  description: { type: String, unique: true, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
});
//categorySchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });
module.exports = mongoose.model("Category", categorySchema);
