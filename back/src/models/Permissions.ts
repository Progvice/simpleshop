import mongoose, { Schema } from 'mongoose';

const Permissions = new Schema({
    name: {
        type: String,
        index: {
            unique: true
        },
        required: [true, 'permissionnamerequired']
    },
    create_product: {type: Boolean, default: false},
    read_product: {type: Boolean, default: false},
    update_product: {type: Boolean, default: false},
    delete_product: {type: Boolean, default: false},

    create_categories: {type: Boolean, default: false},
    read_categories: {type: Boolean, default: false},
    update_categories: {type: Boolean, default: false},
    delete_categories: {type: Boolean, default: false},

    create_payments: {type: Boolean, default: false},
    read_payments: {type: Boolean, default: false},
    update_payments: {type: Boolean, default: false},
    delete_payments: {type: Boolean, default: false},
    refund_payments: {type: Boolean, default: false},

    create_taxes: {type: Boolean, default: false},
    read_taxes: {type: Boolean, default: false},
    update_taxes: {type: Boolean, default: false},
    delete_taxes: {type: Boolean, default: false},
});

export default Permissions;