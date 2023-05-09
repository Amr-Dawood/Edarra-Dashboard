const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
});

export const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;

export const getProducts =  () => ProductModel.find();

export const getWarehouseById = (id: string) => ProductModel.findOne(id);

export const deleteWarehouseById = (id: string) => ProductModel.findOneAndDelete({_id: id});