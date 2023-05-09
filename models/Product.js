const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

ProductSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', ProductSchema)