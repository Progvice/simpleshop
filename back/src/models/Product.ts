import mongoose, { Schema } from 'mongoose';

import Category from './Category';

const Product = new Schema({
    sku: {},
    product_img: {
        type: [],
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
    },
    category: {
        type: [Category]
    }
});

export default Product;