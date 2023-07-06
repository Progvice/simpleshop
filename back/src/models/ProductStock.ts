import mongoose, { Schema } from 'mongoose';

import CategoryModel from './Product';
const Product = mongoose.model('Product', CategoryModel);

const ProductStock = new Schema({
    sku: {
        index: {
            unique: true
        },
        type: String,
        ref: 'Product'
    },
    action: {
        type: String,
        enum: ['add', 'subtract'],
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

export default Product;