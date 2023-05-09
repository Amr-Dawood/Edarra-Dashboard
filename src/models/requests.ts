const mongoose = require('mongoose');
const {Schema} = mongoose;

const requestSchema = new Schema({
    supervisorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending',
        required: true,
    },
    currentStock: {
        type: Number,
        required: true,
    },
    desiredStock: {
        type: Number,
        required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
}, {timestamps: true});

const RequestModel = mongoose.model('Request', requestSchema);

module.exports = RequestModel;