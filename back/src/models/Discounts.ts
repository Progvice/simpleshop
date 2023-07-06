import mongoose, { Schema } from 'mongoose';

import ProductModel from './Product';
const Product = mongoose.model('Product', ProductModel);

const Discounts = new Schema({
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    /*
        - Percentage = Sets percentage discount to every product under this discount
        - Amount = Sets fixed amount of discount on every product under this discount
        - Quantity percentage = Sets percentage discount. Based on amount of products. 
        - Quantity amount = Sets fixed amount of discount. Based on amount of products.
        - Quantity product amount = How many products user needs to buy to get percentage/fixed amount of discount.
        - Bundle percentage = Sets percentage discount to bundle package. 
        - Bundle amount = Sets fixed amount discount to bundle package. 
        - Products = List of products that are included in this campaing.
    */
    type: {
        type: String,
        enum: ['percentage', 'amount', 'quantity', 'bundle']
    },
    // This value will be set based on discount type
    percentage: {
        type: Number
    },
    // This value will be set based on discount type
    amount: {
        type: Number
    },
    // This value will be set based on discount type
    quantity_percentage: {
        type: Number
    },
    quantity_amount: {
        type: Number
    },
    // This value will be set based on discount type
    quantity_product_amount: {
        type: Number
    },
    // This value will be set based on discount type. Seller can define if bundle has percentage or amount discount
    bundle_percentage: {
        type: Number
    },
    // This value will be set based on discount type. Seller can define if bundle has percentage or amount discount
    bundle_amount: {
        type: Number
    },
    // List of products that are part of discount. Shops can define multiple products or create discounts one by one
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    // Amount how many times this discount can be used
    discount_usage: {
        type: Number,
    },
    // How many times this discount has been used.
    discount_used: {
        type: Number,
        default: 0
    },
});

Discounts.pre('save', (next) => {

});

export default Discounts;