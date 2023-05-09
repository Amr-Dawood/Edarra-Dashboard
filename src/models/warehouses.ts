const mongoose = require('mongoose');
const { Schema } = mongoose;

const warehouseSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    supervisor_id: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export const WarehouseModel = mongoose.model('Warehouse', warehouseSchema);

module.exports = WarehouseModel;

export const getWarehouses =  () => WarehouseModel.find();

export const getWarehouseById = (id: string) => WarehouseModel.findOne(id);

export const deleteWarehouseById = (id: string) => WarehouseModel.findOneAndDelete({_id: id});


