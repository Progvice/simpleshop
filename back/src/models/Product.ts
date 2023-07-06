import mongoose, { Schema } from 'mongoose';

import CategoryModel from './Category';
const Category = mongoose.model('Category', CategoryModel);

const Product = new Schema({
    sku: {
        index: {
            unique: true
        },
        type: String,
    },
    product_main_img: {
        type: String,
        default: [
            '/img/default_product.jpg'
        ]
    },
    product_imgs: {
        type: [String],
        default: [
            '/img/default_product.jpg'
        ]
    },
    product_name: {
        type: String,
        required: [true, 'productnamerequired']
    },
    product_url : {
        type: String,
        index: {
            unique: true
        },
        required: [true, 'nameurlrequired']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    short_desc: {
        type: String,
        maxlength: 255
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        min: [1, 'toolowprice'],
        max: [10000000, 'toohighprice'] // Value is 10 million. Price is measured in cents.
    }
});

export default Product;